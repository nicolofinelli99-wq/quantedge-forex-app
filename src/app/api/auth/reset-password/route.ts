import { NextRequest, NextResponse } from "next/server";
import { consumePasswordResetToken, setMemberPassword } from "@/lib/data";
import { hashPassword, isValidPassword } from "@/lib/auth";
import { SESSION_COOKIE, sessionCookieValue, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ error: "Missing or invalid reset link." }, { status: 400 });
  }
  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const memberId = await consumePasswordResetToken(token);
  if (!memberId) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await setMemberPassword(memberId, passwordHash);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(memberId), SESSION_COOKIE_OPTIONS);
  return res;
}
