import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";

// Kill-switch: set SITE_PAUSED=true in Vercel to blackout the entire public
// site (homepage, checkout, login, dashboard, admin) behind a simple "we're
// paused" page, without touching any code, data, or deployment. Flip
// SITE_PAUSED back to false (and redeploy) to bring everything back exactly
// as it was — nothing is deleted.
//
// SITE_PAUSE_BYPASS lets the site owner keep working while it's paused:
// visiting any URL with ?bypass=<that secret> sets a cookie that skips the
// paused page for that browser (e.g. https://be4trading.com/admin?bypass=...).
const BYPASS_COOKIE = "be4_pause_bypass";

const PAUSED_HTML = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>BE4 Trading</title>
<style>
  html,body{margin:0;height:100%;background:#0b0f17;color:#eef1f6;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
  .wrap{min-height:100%;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;}
  .card{max-width:480px;}
  h1{font-size:22px;margin:0 0 12px;font-weight:600;}
  p{font-size:15px;line-height:1.6;color:#9aa4b2;margin:0;}
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>BE4 Trading è momentaneamente in pausa</h1>
      <p>Il servizio è temporaneamente sospeso. Torneremo a breve.</p>
    </div>
  </div>
</body>
</html>`;

export function middleware(req: NextRequest) {
  const paused = process.env.SITE_PAUSED === "true";

  if (paused) {
    const bypassSecret = process.env.SITE_PAUSE_BYPASS;
    const bypassParam = req.nextUrl.searchParams.get("bypass");

    if (bypassSecret && bypassParam === bypassSecret) {
      const url = new URL(req.nextUrl.pathname, req.url);
      const res = NextResponse.redirect(url);
      res.cookies.set(BYPASS_COOKIE, bypassSecret, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    const hasBypassCookie = Boolean(bypassSecret) && req.cookies.get(BYPASS_COOKIE)?.value === bypassSecret;

    if (!hasBypassCookie && !req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(PAUSED_HTML, {
        status: 503,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const needsAuth = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin");
  if (needsAuth && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
