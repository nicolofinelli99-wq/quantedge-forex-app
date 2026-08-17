import { NextRequest, NextResponse } from "next/server";
import { getMemberById, setMemberStripeCustomerId } from "@/lib/data";
import { getSessionMemberId } from "@/lib/session";
import { getStripe, isStripeConfigured, getPriceId } from "@/lib/stripe";
import { Plan, BillingCycle } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const memberId = getSessionMemberId();
  const member = await getMemberById(memberId);
  if (!member) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const plan = body?.plan as Plan;
  const cycle = (body?.cycle as BillingCycle) ?? "MONTHLY";

  if (!plan) {
    return NextResponse.json({ error: "Missing plan." }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't set up yet. Add your Stripe keys to enable checkout." },
      { status: 503 }
    );
  }

  const priceId = getPriceId(plan, cycle);
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for ${plan} / ${cycle} yet.` },
      { status: 503 }
    );
  }

  try {
    const stripe = getStripe();
    const origin = req.nextUrl.origin;

    let customerId = member.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        name: member.name,
        metadata: { memberId: member.id },
      });
      customerId = customer.id;
      await setMemberStripeCustomerId(member.id, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: member.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/checkout?plan=${plan}&cycle=${cycle}&cancelled=1`,
      subscription_data: { metadata: { memberId: member.id, plan, cycle } },
      metadata: { memberId: member.id, plan, cycle },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] create-checkout-session failed", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
