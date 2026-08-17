import { NextRequest, NextResponse } from "next/server";
import { createManualMember } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";
import { Plan, BillingCycle } from "@/lib/plans";

const PLANS: Plan[] = ["RESEARCH", "STRATEGY", "COMPLETE"];

// Lets an admin manually add/activate a subscriber — e.g. someone who paid by
// bank transfer before a payment processor was connected, or a comp account.
export async function POST(req: NextRequest) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const plan = body?.plan as Plan;
  const billingCycle: BillingCycle = body?.billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY";

  if (!name || !email || !plan || !PLANS.includes(plan)) {
    return NextResponse.json({ error: "Name, email and a valid plan are required" }, { status: 400 });
  }

  try {
    const member = await createManualMember({ name, email, plan, billingCycle, status: "ACTIVE" });
    return NextResponse.json({ ok: true, member });
  } catch (err) {
    console.error("[subscribers] manual create failed", err);
    return NextResponse.json({ error: "Could not create subscriber — check the email isn't already used by an admin account." }, { status: 500 });
  }
}
