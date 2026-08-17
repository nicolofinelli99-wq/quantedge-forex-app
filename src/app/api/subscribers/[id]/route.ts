import { NextRequest, NextResponse } from "next/server";
import { adminUpdateMember, deleteMember } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";
import { Plan, MemberStatus } from "@/lib/plans";

const PLANS: Plan[] = ["RESEARCH", "STRATEGY", "COMPLETE"];
const STATUSES: MemberStatus[] = ["ACTIVE", "PAST_DUE", "CANCELLED", "INACTIVE"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const plan = body?.plan as Plan | undefined;
  const status = body?.status as MemberStatus | undefined;

  if (plan && !PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await adminUpdateMember(params.id, { plan, status });
  if (!updated) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  return NextResponse.json({ ok: true, member: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (params.id === admin.id) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
  }
  await deleteMember(params.id);
  return NextResponse.json({ ok: true });
}
