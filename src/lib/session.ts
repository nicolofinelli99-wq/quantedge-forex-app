import { cookies } from "next/headers";

export const SESSION_COOKIE = "qe_session";

export function getSessionMemberId(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}
