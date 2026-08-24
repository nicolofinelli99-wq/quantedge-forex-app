import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  activateMemberFromPaddleCheckout,
  markMemberActiveRenewalByPaddleSubscriptionId,
  markMemberCancelledByPaddleSubscriptionId,
  markMemberPastDueByPaddleSubscriptionId,
  syncMemberPlanByPaddleSubscriptionId,
  updateMemberPaddleManagementUrls,
} from "@/lib/data";
import { Plan, BillingCycle } from "@/lib/plans";
import { isPaddleWebhookConfigured, paddlePlanFromPriceId } from "@/lib/paddle";
import {
  sendEmail,
  welcomeEmailHtml,
  paymentFailedEmailHtml,
  subscriptionCancelledEmailHtml,
  renewalReceiptEmailHtml,
} from "@/lib/email";

function planLabel(plan: Plan): string {
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}

/** Manual HMAC-SHA256 verification per Paddle's docs (no SDK dependency needed
 *  since we don't call the Paddle REST API server-side — checkout runs entirely
 *  client-side via Paddle.js, and everything else comes through this webhook). */
function verifyPaddleSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(";").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  // Reject events older than 5 minutes (generous replay-attack window, well above
  // Paddle's own suggested 5s tolerance, to allow for clock drift / retries).
  const tsMs = parseInt(ts, 10) * 1000;
  if (!Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) return false;

  const signedPayload = `${ts}:${rawBody}`;
  const computed = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  const a = Buffer.from(computed);
  const b = Buffer.from(h1);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type PaddleEvent = {
  event_type: string;
  data: {
    id: string;
    status?: string;
    customer_id?: string;
    subscription_id?: string;
    origin?: string;
    custom_data?: { memberId?: string; plan?: Plan; cycle?: BillingCycle } | null;
    items?: { price?: { id?: string } }[];
    management_urls?: { update_payment_method?: string; cancel?: string } | null;
    details?: { totals?: { grand_total?: string; currency_code?: string } };
    currency_code?: string;
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY;
  if (!isPaddleWebhookConfigured() || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signatureHeader = req.headers.get("paddle-signature");
  const rawBody = await req.text();

  if (!verifyPaddleSignature(rawBody, signatureHeader, secret)) {
    console.error("[paddle webhook] signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: PaddleEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.event_type) {
      case "subscription.activated": {
        const data = event.data;
        const memberId = data.custom_data?.memberId;
        const plan = data.custom_data?.plan;
        const cycle = data.custom_data?.cycle || "MONTHLY";
        const customerId = data.customer_id;

        if (memberId && plan && customerId) {
          const member = await activateMemberFromPaddleCheckout({
            memberId,
            plan,
            billingCycle: cycle,
            paddleCustomerId: customerId,
            paddleSubscriptionId: data.id,
            updatePaymentMethodUrl: data.management_urls?.update_payment_method,
            cancelUrl: data.management_urls?.cancel,
          });
          if (member) {
            await sendEmail({
              to: member.email,
              subject: "Welcome to BE4 Trading — your subscription is active",
              html: welcomeEmailHtml(member.name, planLabel(member.plan)),
            });
          }
        } else {
          console.warn("[paddle webhook] subscription.activated missing expected fields", {
            memberId,
            plan,
            customerId,
          });
        }
        break;
      }

      case "subscription.updated": {
        const data = event.data;
        // Keep the "manage billing" links fresh even outside activation.
        await updateMemberPaddleManagementUrls(data.id, {
          updatePaymentMethodUrl: data.management_urls?.update_payment_method,
          cancelUrl: data.management_urls?.cancel,
        });

        const priceId = data.items?.[0]?.price?.id;
        if (priceId && data.status === "active") {
          const resolved = paddlePlanFromPriceId(priceId);
          if (resolved) {
            await syncMemberPlanByPaddleSubscriptionId(data.id, resolved.plan, resolved.cycle);
          }
        }
        break;
      }

      case "subscription.past_due": {
        const member = await markMemberPastDueByPaddleSubscriptionId(event.data.id);
        if (member) {
          await sendEmail({
            to: member.email,
            subject: "Payment failed — action needed on your BE4 Trading subscription",
            html: paymentFailedEmailHtml(member.name),
          });
        }
        break;
      }

      case "subscription.canceled": {
        const member = await markMemberCancelledByPaddleSubscriptionId(event.data.id);
        if (member) {
          await sendEmail({
            to: member.email,
            subject: "Your BE4 Trading subscription has been cancelled",
            html: subscriptionCancelledEmailHtml(member.name),
          });
        }
        break;
      }

      case "transaction.completed": {
        const data = event.data;
        const subscriptionId = data.subscription_id;
        // "subscription_recurring" = an auto-renewal charge, not the very first
        // payment — the first one is already handled by subscription.activated,
        // so this avoids sending both a welcome email and a renewal receipt for
        // the same charge.
        if (subscriptionId && data.origin === "subscription_recurring") {
          const member = await markMemberActiveRenewalByPaddleSubscriptionId(subscriptionId);
          if (member) {
            const amount = data.details?.totals?.grand_total
              ? Number(data.details.totals.grand_total) / 100
              : null;
            if (amount !== null) {
              await sendEmail({
                to: member.email,
                subject: "Payment received — thank you",
                html: renewalReceiptEmailHtml(member.name, planLabel(member.plan), amount),
              });
            }
          }
        }
        break;
      }

      case "transaction.payment_failed": {
        // Defensive: subscription.past_due should already cover this, but a
        // failed transaction can arrive first/instead depending on timing.
        const subscriptionId = event.data.subscription_id;
        if (subscriptionId) {
          await markMemberPastDueByPaddleSubscriptionId(subscriptionId);
        }
        break;
      }

      default:
        // Unhandled event types are fine to ignore.
        break;
    }
  } catch (err) {
    console.error(`[paddle webhook] handler error for ${event.event_type}`, err);
    // Still 200 so Paddle doesn't hammer retries for a bug on our side while we
    // fix it; the event is visible (and re-sendable) from the Paddle dashboard.
  }

  return NextResponse.json({ received: true });
}
