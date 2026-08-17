import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

/** Random URL-safe token to email to the user (password reset link, etc). */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Only the hash of the token is ever stored in the database. */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function isValidEmail(email: string): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}
