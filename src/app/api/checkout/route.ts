import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateMemberFromCheckout, Plan, BillingCycle } from "@/lib/data";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, plan, billingCycle } = body as {
    name: string;
    email: string;
    plan: Plan;
    billingCycle: BillingCycle;
  };

  if (!name || !email || !plan) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const member = await createOrUpdateMemberFromCheckout({
    name,
    email,
    plan,
    billingCycle: billingCycle ?? "MONTHLY",
  });

  const res = NextResponse.json({ ok: true, memberId: member.id });
  res.cookies.set(SESSION_COOKIE, member.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
