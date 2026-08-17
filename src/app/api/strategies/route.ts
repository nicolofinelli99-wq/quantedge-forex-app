import { NextRequest, NextResponse } from "next/server";
import { createStrategy, Plan } from "@/lib/data";
import { requireAdminMember } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  const admin = await requireAdminMember();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, instrument, type, bias, excerpt, fullBody, minPlan } = body as {
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

  const strategy = await createStrategy({
    title,
    instrument,
    type,
    bias,
    excerpt,
    body: fullBody,
    minPlan: minPlan ?? "RESEARCH",
  });

  return NextResponse.json({ ok: true, strategy });
}
