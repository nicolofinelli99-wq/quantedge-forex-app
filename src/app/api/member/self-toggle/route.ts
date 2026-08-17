import { NextResponse } from "next/server";
import { getMemberById, setMemberStatus } from "@/lib/data";
import { getSessionMemberId } from "@/lib/session";

export async function POST() {
  if (process.env.DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }
  const id = getSessionMemberId();
  const member = await getMemberById(id);
  if (!member || member.role !== "CLIENT") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const next = member.status === "ACTIVE" ? "PAST_DUE" : "ACTIVE";
  const updated = await setMemberStatus(member.id, next);
  return NextResponse.json({ status: updated?.status });
}
