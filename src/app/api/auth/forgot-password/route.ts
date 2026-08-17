import { NextRequest, NextResponse } from "next/server";
import { getMemberByEmail, createPasswordResetToken } from "@/lib/data";
import { generateRawToken, isValidEmail } from "@/lib/auth";
import { sendEmail, passwordResetEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  // Always respond with the same generic message, whether or not the account
  // exists — this avoids leaking which emails are registered.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "If an account exists for that email, a reset link is on its way.",
  });

  if (!isValidEmail(email)) return genericResponse;

  const member = await getMemberByEmail(email);
  if (member && member.password_hash) {
    const rawToken = generateRawToken();
    await createPasswordResetToken(member.id, rawToken);
    const origin = req.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: member.email,
      subject: "Reset your BE4 Trading password",
      html: passwordResetEmailHtml(member.name, resetUrl),
    });
  }

  return genericResponse;
}
