import { NextRequest, NextResponse } from "next/server";
import { getMemberByEmail } from "@/lib/data";
import { verifyPassword } from "@/lib/auth";
import { SESSION_COOKIE, sessionCookieValue, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const member = await getMemberByEmail(email);
  const ok = member ? await verifyPassword(password, member.password_hash) : false;

  if (!member || !ok) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: member.role });
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(member.id), SESSION_COOKIE_OPTIONS);
  return res;
}
