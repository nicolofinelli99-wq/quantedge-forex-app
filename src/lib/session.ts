import { cookies } from "next/headers";
import crypto from "node:crypto";

export const SESSION_COOKIE = "qe_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Dev-only fallback so the app doesn't hard-crash without the var set locally.
    // In production this MUST be set (Vercel env var) or sessions are forgeable.
    return "dev-insecure-session-secret-set-SESSION_SECRET-env-var";
  }
  return secret;
}

function sign(memberId: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(memberId).digest("hex");
  return `${memberId}.${sig}`;
}

function unsign(value: string): string | null {
  const idx = value.lastIndexOf(".");
  if (idx === -1) return null;
  const memberId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(memberId).digest("hex");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  return memberId;
}

/** Read the current member id from the (signature-verified) session cookie. */
export function getSessionMemberId(): string | undefined {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return undefined;
  return unsign(raw) ?? undefined;
}

/** Build the signed cookie value to store for a given member id. */
export function sessionCookieValue(memberId: string): string {
  return sign(memberId);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};
