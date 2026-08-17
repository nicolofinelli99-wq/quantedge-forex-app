import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";

export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
