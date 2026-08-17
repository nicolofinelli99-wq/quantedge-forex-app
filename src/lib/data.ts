import { sql } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";
import { Plan, MemberStatus, Role, BillingCycle, PLAN_RANK, PLAN_PRICE } from "@/lib/plans";
import { hashToken } from "@/lib/auth";

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
  password_hash: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
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
  const rows = await sql<Member[]>`select * from members where lower(email) = lower(${email}) limit 1`;
  return rows[0] ?? null;
}

export async function getMemberByStripeCustomerId(customerId: string): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`select * from members where stripe_customer_id = ${customerId} limit 1`;
  return rows[0] ?? null;
}

export async function getMemberByStripeSubscriptionId(subscriptionId: string): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`select * from members where stripe_subscription_id = ${subscriptionId} limit 1`;
  return rows[0] ?? null;
}

/** Registration: create a brand-new member with a password, no active plan yet
 *  (status INACTIVE until they complete a Stripe checkout). */
export async function createMemberWithPassword(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<Member> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    insert into members (name, email, role, plan, status, billing_cycle, password_hash)
    values (${input.name}, ${input.email}, 'CLIENT', 'RESEARCH', 'INACTIVE', 'MONTHLY', ${input.passwordHash})
    returning *
  `;
  return rows[0];
}

export async function setMemberPassword(memberId: string, passwordHash: string): Promise<void> {
  await ensureSchema();
  await sql`update members set password_hash = ${passwordHash}, updated_at = now() where id = ${memberId}`;
}

/** Called from the Stripe webhook once a checkout session completes successfully. */
export async function activateMemberFromCheckout(input: {
  memberId: string;
  plan: Plan;
  billingCycle: BillingCycle;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}): Promise<Member | null> {
  await ensureSchema();
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + (input.billingCycle === "YEARLY" ? 365 : 30));
  const rows = await sql<Member[]>`
    update members set
      plan = ${input.plan},
      billing_cycle = ${input.billingCycle},
      status = 'ACTIVE',
      stripe_customer_id = ${input.stripeCustomerId},
      stripe_subscription_id = ${input.stripeSubscriptionId},
      next_billing_at = ${nextBilling},
      updated_at = now()
    where id = ${input.memberId}
    returning *
  `;
  return rows[0] ?? null;
}

export async function setMemberStripeCustomerId(memberId: string, stripeCustomerId: string): Promise<void> {
  await ensureSchema();
  await sql`update members set stripe_customer_id = ${stripeCustomerId}, updated_at = now() where id = ${memberId}`;
}

export async function markMemberActiveRenewal(stripeCustomerId: string): Promise<Member | null> {
  await ensureSchema();
  const nextBilling = new Date();
  const [member] = await sql<Member[]>`select * from members where stripe_customer_id = ${stripeCustomerId} limit 1`;
  if (!member) return null;
  nextBilling.setDate(nextBilling.getDate() + (member.billing_cycle === "YEARLY" ? 365 : 30));
  const rows = await sql<Member[]>`
    update members set status = 'ACTIVE', next_billing_at = ${nextBilling}, updated_at = now()
    where stripe_customer_id = ${stripeCustomerId}
    returning *
  `;
  return rows[0] ?? null;
}

export async function markMemberPastDueByCustomerId(stripeCustomerId: string): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    update members set status = 'PAST_DUE', updated_at = now()
    where stripe_customer_id = ${stripeCustomerId}
    returning *
  `;
  return rows[0] ?? null;
}

export async function markMemberCancelledBySubscriptionId(stripeSubscriptionId: string): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    update members set status = 'CANCELLED', updated_at = now()
    where stripe_subscription_id = ${stripeSubscriptionId}
    returning *
  `;
  return rows[0] ?? null;
}

export async function syncMemberPlanBySubscriptionId(
  stripeSubscriptionId: string,
  plan: Plan,
  billingCycle: BillingCycle
): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    update members set plan = ${plan}, billing_cycle = ${billingCycle}, updated_at = now()
    where stripe_subscription_id = ${stripeSubscriptionId}
    returning *
  `;
  return rows[0] ?? null;
}

// ---- Password reset tokens ----

export async function createPasswordResetToken(memberId: string, rawToken: string): Promise<void> {
  await ensureSchema();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await sql`
    insert into password_reset_tokens (member_id, token_hash, expires_at)
    values (${memberId}, ${hashToken(rawToken)}, ${expiresAt})
  `;
}

/** Verifies + burns a reset token. Returns the member id if valid, else null. */
export async function consumePasswordResetToken(rawToken: string): Promise<string | null> {
  await ensureSchema();
  const tokenHash = hashToken(rawToken);
  const rows = await sql<{ id: string; member_id: string }[]>`
    select id, member_id from password_reset_tokens
    where token_hash = ${tokenHash} and used_at is null and expires_at > now()
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  await sql`update password_reset_tokens set used_at = now() where id = ${row.id}`;
  return row.member_id;
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
    select plan, count(*)::text as count from members where role = 'CLIENT' and status = 'ACTIVE' group by plan
  `;
  const [{ past_due }] = await sql<{ past_due: string }[]>`
    select count(*)::text as past_due from members where role = 'CLIENT' and status = 'PAST_DUE'
  `;
  const prices = await getPlanPrices();
  const mrr = byPlan.reduce((sum, row) => {
    const price = prices[row.plan]?.monthly ?? 0;
    return sum + price * Number(row.count);
  }, 0);
  return {
    total: Number(total),
    byPlan: Object.fromEntries(byPlan.map((r) => [r.plan, Number(r.count)])) as Record<Plan, number>,
    pastDue: Number(past_due),
    mrr,
  };
}

// ---- Editable plan pricing (DB-backed, falls back to the code defaults above) ----

export async function getPlanPrices(): Promise<Record<Plan, { monthly: number; yearly: number }>> {
  await ensureSchema();
  const rows = await sql<{ plan: Plan; monthly: number; yearly: number }[]>`
    select plan, monthly, yearly from plan_prices
  `;
  const result: Record<Plan, { monthly: number; yearly: number }> = { ...PLAN_PRICE };
  for (const r of rows) {
    result[r.plan] = { monthly: r.monthly, yearly: r.yearly };
  }
  return result;
}

export async function updatePlanPrice(plan: Plan, monthly: number, yearly: number): Promise<void> {
  await ensureSchema();
  await sql`
    insert into plan_prices (plan, monthly, yearly, updated_at)
    values (${plan}, ${monthly}, ${yearly}, now())
    on conflict (plan) do update set monthly = excluded.monthly, yearly = excluded.yearly, updated_at = now()
  `;
}

// ---- Admin member management ----

export async function adminUpdateMember(
  id: string,
  input: { plan?: Plan; status?: MemberStatus }
): Promise<Member | null> {
  await ensureSchema();
  const rows = await sql<Member[]>`
    update members set
      plan = coalesce(${input.plan ?? null}, plan),
      status = coalesce(${input.status ?? null}, status),
      updated_at = now()
    where id = ${id} and role = 'CLIENT'
    returning *
  `;
  return rows[0] ?? null;
}

export async function deleteMember(id: string): Promise<void> {
  await ensureSchema();
  await sql`delete from members where id = ${id} and role = 'CLIENT'`;
}

/** Admin manually activates/creates a subscriber — e.g. a client who paid by bank
 *  transfer before a payment processor was connected. Upserts by email; if the
 *  member already exists (e.g. signed up but never paid), this just activates them. */
export async function createManualMember(input: {
  name: string;
  email: string;
  plan: Plan;
  billingCycle: BillingCycle;
  status?: MemberStatus;
}): Promise<Member> {
  await ensureSchema();
  const status = input.status ?? "ACTIVE";
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + (input.billingCycle === "YEARLY" ? 365 : 30));
  const rows = await sql<Member[]>`
    insert into members (name, email, role, plan, status, billing_cycle, next_billing_at)
    values (${input.name}, ${input.email}, 'CLIENT', ${input.plan}, ${status}, ${input.billingCycle}, ${status === "ACTIVE" ? nextBilling : null})
    on conflict (email) do update set
      plan = excluded.plan,
      status = excluded.status,
      billing_cycle = excluded.billing_cycle,
      next_billing_at = excluded.next_billing_at,
      updated_at = now()
    returning *
  `;
  return rows[0];
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
    select * from strategies where min_plan = 'RESEARCH' order by published_at desc limit 1
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


export async function getStrategyById(id: string): Promise<Strategy | null> {
  await ensureSchema();
  const rows = await sql<Strategy[]>`select * from strategies where id = ${id} limit 1`;
  return rows[0] ?? null;
}

export async function updateStrategy(
  id: string,
  input: {
    title: string;
    instrument?: string;
    type: string;
    bias?: string;
    excerpt: string;
    body: string;
    minPlan: Plan;
  }
): Promise<Strategy | null> {
  await ensureSchema();
  const rows = await sql<Strategy[]>`
    update strategies set
      title = ${input.title},
      instrument = ${input.instrument ?? null},
      type = ${input.type},
      bias = ${input.bias ?? null},
      excerpt = ${input.excerpt},
      body = ${input.body},
      min_plan = ${input.minPlan}
    where id = ${id}
    returning *
  `;
  return rows[0] ?? null;
}

export async function deleteStrategy(id: string): Promise<void> {
  await ensureSchema();
  await sql`delete from strategies where id = ${id}`;
}
