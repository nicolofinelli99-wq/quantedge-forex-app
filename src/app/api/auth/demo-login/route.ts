import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/data";
import { SESSION_COOKIE, sessionCookieValue, SESSION_COOKIE_OPTIONS } from "@/lib/session";

// Demo-only one-click logins for showing the product before real payments are
// connected. Set DEMO_MODE=false (or remove the env var) in Vercel before
// launch to disable this endpoint entirely.
export async function POST(req: NextRequest) {
  if (process.env.DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Demo login is disabled." }, { status: 404 });
  }

  const form = await req.formData();
  const role = form.get("role");
  await ensureSchema();

  let memberId: string;

  if (role === "admin") {
    const rows = await sql<{ id: string }[]>`
      insert into members (name, email, role, plan, status)
      values ('Samuele Gritti', 'admin@quantedge.demo', 'ADMIN', 'COMPLETE', 'ACTIVE')
      on conflict (email) do update set role = 'ADMIN', name = 'Samuele Gritti'
      returning id
    `;
    memberId = rows[0].id;
  } else {
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);
    const rows = await sql<{ id: string }[]>`
      insert into members (name, email, role, plan, status, billing_cycle, next_billing_at)
      values ('Nicolo F.', 'demo.client@quantedge.demo', 'CLIENT', 'STRATEGY', 'ACTIVE', 'MONTHLY', ${nextBilling})
      on conflict (email) do update set status = 'ACTIVE'
      returning id
    `;
    memberId = rows[0].id;
  }

  const dest = role === "admin" ? "/admin" : "/dashboard";
  const res = NextResponse.redirect(new URL(dest, req.url));
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(memberId), SESSION_COOKIE_OPTIONS);
  return res;
}
