import { NextRequest, NextResponse } from "next/server";
import { updateStrategy, deleteStrategy } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";
import { Plan } from "@/lib/plans";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const { title, instrument, type, bias, excerpt, fullBody, minPlan } = (body ?? {}) as {
    title: string;
    instrument?: string;
    type: string;
    bias?: string;
    excerpt: string;
    fullBody: string;
    minPlan: Plan;
  };

  if (!title || !type || !excerpt || !fullBody) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const strategy = await updateStrategy(params.id, {
    title,
    instrument,
    type,
    bias,
    excerpt,
    body: fullBody,
    minPlan: minPlan ?? "RESEARCH",
  });

  if (!strategy) return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
  return NextResponse.json({ ok: true, strategy });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await deleteStrategy(params.id);
  return NextResponse.json({ ok: true });
}
