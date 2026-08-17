import { NextRequest, NextResponse } from "next/server";
import { getMemberById } from "@/lib/data";
import { getSessionMemberId } from "@/lib/session";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const memberId = getSessionMemberId();
  const member = await getMemberById(memberId);
  if (!member) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments aren't set up yet." }, { status: 503 });
  }
  if (!member.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account on file yet." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const origin = req.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] create-portal-session failed", err);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}
