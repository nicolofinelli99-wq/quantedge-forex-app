import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  activateMemberFromCheckout,
  markMemberActiveRenewal,
  markMemberCancelledBySubscriptionId,
  markMemberPastDueByCustomerId,
  syncMemberPlanBySubscriptionId,
} from "@/lib/data";
import { PLAN_PRICE, Plan } from "@/lib/plans";
import { getStripe, isWebhookConfigured, planFromPriceId } from "@/lib/stripe";
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

// Stripe needs the raw request body to verify the signature, so this route
// reads req.text() rather than req.json().
export async function POST(req: NextRequest) {
  if (!isWebhookConfigured()) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const memberId = (session.metadata?.memberId as string) || session.client_reference_id || "";
        const plan = session.metadata?.plan as Plan | undefined;
        const cycle = (session.metadata?.cycle as "MONTHLY" | "YEARLY") || "MONTHLY";
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

        if (memberId && plan && customerId && subscriptionId) {
          const member = await activateMemberFromCheckout({
            memberId,
            plan,
            billingCycle: cycle,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          });
          if (member) {
            await sendEmail({
              to: member.email,
              subject: "Welcome to BE4 Trading — your subscription is active",
              html: welcomeEmailHtml(member.name, planLabel(member.plan)),
            });
          }
        } else {
          console.warn("[stripe webhook] checkout.session.completed missing expected fields", {
            memberId,
            plan,
            customerId,
            subscriptionId,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const member = await markMemberPastDueByCustomerId(customerId);
          if (member) {
            await sendEmail({
              to: member.email,
              subject: "Payment failed — action needed on your BE4 Trading subscription",
              html: paymentFailedEmailHtml(member.name),
            });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Skip the very first invoice — checkout.session.completed already
        // activates the account and sends the welcome email for that one.
        if (invoice.billing_reason === "subscription_cycle") {
          const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
          if (customerId) {
            const member = await markMemberActiveRenewal(customerId);
            if (member) {
              const amount = PLAN_PRICE[member.plan][member.billing_cycle === "YEARLY" ? "yearly" : "monthly"];
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

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const member = await markMemberCancelledBySubscriptionId(subscription.id);
        if (member) {
          await sendEmail({
            to: member.email,
            subject: "Your BE4 Trading subscription has been cancelled",
            html: subscriptionCancelledEmailHtml(member.name),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId && subscription.status === "active") {
          const resolved = planFromPriceId(priceId);
          if (resolved) {
            await syncMemberPlanBySubscriptionId(subscription.id, resolved.plan, resolved.cycle);
          }
        }
        break;
      }

      default:
        // Unhandled event types are fine to ignore.
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] handler error for ${event.type}`, err);
    // Still 200 so Stripe doesn't hammer retries for a bug on our side while we fix it;
    // the event is visible (and re-sendable) from the Stripe dashboard either way.
  }

  return NextResponse.json({ received: true });
}
