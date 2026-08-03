import { sql } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";
import { Plan, MemberStatus, Role, BillingCycle, PLAN_RANK, PLAN_PRICE } from "@/lib/plans";

export type { Plan, MemberStatus, Role, BillingCycle };
export { PLAN_RANK, PLAN_PRICE };

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  status: MemberStatus;
  billing_cycle: BillingCycle;
  next_billing_at: Date | null;
  created_at: Date;
}

export interface Strategy {
  id: string;
  title: string;
  instrument: string | null;
  type: string;
  bias: string | null;
  excerpt: string;
  body: string;
  min_plan: Plan;
  author: string;
  published_at: Date;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const file = path.join(process.cwd(), "src", "lib", "schema.sql");
      const statements = fs
        .readFileSync(file, "utf8")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) {
        await sql.unsafe(stmt);
      }
    })();
  }
  return schemaReady;
}

export async function getMemberById(id: string | undefined): Promise<Member | null> {
  if (!id) return null;
  await ensureSchema();
  const rows = await sql<Member[]>`select * from members where id = ${id} limit 1`;
  return rows[0] ?? null;
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`select * from members where email = ${email} limit 1`;
  return rows[0] ?? null;
}

export async function createOrUpdateMemberFromCheckout(input: {
  name: string;
  email: string;
  plan: Plan;
  billingCycle: BillingCycle;
}): Promise<Member> {
  await ensureSchema();
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + (input.billingCycle === "YEARLY" ? 365 : 30));
  const rows = await sql<Member[]>`
    insert into members (name, email, role, plan, status, billing_cycle, next_billing_at)
    values (${input.name}, ${input.email}, 'CLIENT', ${input.plan}, 'ACTIVE', ${input.billingCycle}, ${nextBilling})
    on conflict (email) do update set
      name = excluded.name,
      plan = excluded.plan,
      status = 'ACTIVE',
      billing_cycle = excluded.billing_cycle,
      next_billing_at = excluded.next_billing_at,
      updated_at = now()
    returning *
  `;
  return rows[0];
}

export async function listMembers(): Promise<Member[]> {
  await ensureSchema();
  return sql<Member[]>`select * from members where role = 'CLIENT' order by created_at desc`;
}

export async function setMemberStatus(id: string, status: MemberStatus): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    update members set status = ${status}, updated_at = now() where id = ${id} returning *
  `;
  return rows[0] ?? null;
}

export async function getAdminStats() {
  await ensureSchema();
  const [{ total }] = await sql<{ total: string }[]>`select count(*)::text as total from members where role = 'CLIENT'`;
  const byPlan = await sql<{ plan: Plan; count: string }[]>`
    select plan, count(*)::text as count from members where role = 'CLIENT' group by plan
  `;
  const [{ past_due }] = await sql<{ past_due: string }[]>`
    select count(*)::text as past_due from members where role = 'CLIENT' and status = 'PAST_DUE'
  `;
  const mrr = byPlan.reduce((sum, row) => {
    const price = PLAN_PRICE[row.plan]?.monthly ?? 0;
    return sum + price * Number(row.count);
  }, 0);
  return {
    total: Number(total),
    byPlan: Object.fromEntries(byPlan.map((r) => [r.plan, Number(r.count)])) as Record<Plan, number>,
    pastDue: Number(past_due),
    mrr,
  };
}

export async function listStrategiesForAdmin(): Promise<Strategy[]> {
  await ensureSchema();
  return sql<Strategy[]>`select * from strategies order by published_at desc`;
}

export async function listStrategiesForMember(member: Member | null): Promise<{ strategy: Strategy; locked: boolean }[]> {
  await ensureSchema();
  const all = await sql<Strategy[]>`select * from strategies order by published_at desc limit 20`;
  const memberRank = member ? PLAN_RANK[member.plan] : -1;
  const memberBlocked = member ? member.status !== "ACTIVE" : false;
  return all.map((strategy) => {
    const withinPlan = memberRank >= PLAN_RANK[strategy.min_plan];
    const locked = !member || memberBlocked || !withinPlan;
    return { strategy, locked };
  });
}

export async function getPublicSampleStrategy(): Promise<Strategy | null> {
  await ensureSchema();
  const rows = await sql<Strategy[]>`
    select * from strategies where min_plan = 'BASIC' order by published_at desc limit 1
  `;
  return rows[0] ?? null;
}

export async function createStrategy(input: {
  title: string;
  instrument?: string;
  type: string;
  bias?: string;
  excerpt: string;
  body: string;
  minPlan: Plan;
}): Promise<Strategy> {
  await ensureSchema();
  const rows = await sql<Strategy[]>`
    insert into strategies (title, instrument, type, bias, excerpt, body, min_plan)
    values (${input.title}, ${input.instrument ?? null}, ${input.type}, ${input.bias ?? null}, ${input.excerpt}, ${input.body}, ${input.minPlan})
    returning *
  `;
  return rows[0];
}

export async function countStrategies(): Promise<number> {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`select count(*)::text as count from strategies`;
  return Number(count);
}
