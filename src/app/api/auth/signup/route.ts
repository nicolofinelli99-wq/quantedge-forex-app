import { NextRequest, NextResponse } from "next/server";
import { createMemberWithPassword, getMemberByEmail, setMemberPassword } from "@/lib/data";
import { hashPassword, isValidEmail, isValidPassword } from "@/lib/auth";
import { SESSION_COOKIE, sessionCookieValue, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await getMemberByEmail(email);
  if (existing && existing.password_hash) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in instead." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  let memberId: string;
  if (existing) {
    // Rare edge case: a member row exists (e.g. from an older demo/manual flow) but
    // has never set a password. Attach the password to that existing account.
    await setMemberPassword(existing.id, passwordHash);
    memberId = existing.id;
  } else {
    const member = await createMemberWithPassword({ name, email, passwordHash });
    memberId = member.id;
  }

  const res = NextResponse.json({ ok: true, memberId });
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(memberId), SESSION_COOKIE_OPTIONS);
  return res;
}
