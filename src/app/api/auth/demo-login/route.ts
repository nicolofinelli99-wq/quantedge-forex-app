import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/data";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
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
  res.cookies.set(SESSION_COOKIE, memberId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
