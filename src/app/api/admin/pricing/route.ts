import { NextRequest, NextResponse } from "next/server";
import { updatePlanPrice } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";
import { Plan } from "@/lib/plans";

const VALID_PLANS: Plan[] = ["RESEARCH", "STRATEGY", "COMPLETE"];

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const plan = body?.plan as Plan | undefined;
  const monthly = Number(body?.monthly);
  const yearly = Number(body?.yearly);

  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (!Number.isFinite(monthly) || monthly <= 0 || !Number.isFinite(yearly) || yearly <= 0) {
    return NextResponse.json({ error: "Prices must be positive numbers" }, { status: 400 });
  }

  await updatePlanPrice(plan, Math.round(monthly), Math.round(yearly));
  return NextResponse.json({ ok: true });
}
