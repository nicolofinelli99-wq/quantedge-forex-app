import { NextRequest, NextResponse } from "next/server";
import { setMemberStatus } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action } = (await req.json()) as { action: "revoke" | "restore" };
  const status = action === "revoke" ? "PAST_DUE" : "ACTIVE";
  const updated = await setMemberStatus(params.id, status);
  return NextResponse.json({ ok: true, member: updated });
}
