import { NextRequest, NextResponse } from "next/server";
import { countStrategies, createStrategy, ensureSchema, createOrUpdateMemberFromCheckout } from "@/lib/data";
import { sql } from "@/lib/db";

const SAMPLE_STRATEGIES = [
  {
    title: "EUR/USD — Fading the London Open Spike",
    instrument: "EUR/USD",
    type: "Intraday",
    bias: "SELL",
    minPlan: "RESEARCH" as const,
    excerpt:
      "Price tends to overextend in the first 30 minutes of the London session before reverting toward the Asian range. Here's how we're positioning around today's open, with our confirmation triggers and invalidation level.",
    body: `The Asian session left EUR/USD compressed in a tight 25-pip range between 1.0828 and 1.0853, with volume drying up into the London handover — a classic setup for a liquidity grab at the open.

Our base case: watch for a false break above 1.0853 in the first 30 minutes of London trading, followed by a rejection back inside the range. A clean close back below 1.0845 on the 15-minute chart is our trigger to look for shorts, targeting the 1.0810 area with a tight invalidation above 1.0865.

If price instead breaks and holds above 1.0865 with volume, we stand aside — that would suggest a genuine trend day rather than a fade, and we'll reassess with an updated note.`,
  },
  {
    title: "GBP/JPY Swing — Riding the Policy Divergence",
    instrument: "GBP/JPY",
    type: "Swing",
    bias: "BUY",
    minPlan: "RESEARCH" as const,
    excerpt:
      "The BoE-BoJ policy gap continues to support GBP/JPY on pullbacks. We're mapping out a multi-day swing plan around the recent structure, with staggered entries and a trailing risk plan.",
    body: `GBP/JPY has respected the rising trendline off the June low three times now, each bounce coinciding with a fresh leg higher. With the Bank of Japan still reluctant to tighten meaningfully and the BoE holding a firmer stance, the broader macro backdrop keeps favoring GBP/JPY strength on dips.

Our plan: scale into longs on a retest of the 187.50-188.20 zone, with a hard invalidation on a daily close below 186.40. First target sits at the recent swing high near 191.80, with a trailing stop moved to breakeven once price clears 189.50.

We'll size this smaller than an intraday trade given the multi-day hold — this is a positioning play, not a scalp.`,
  },
  {
    title: "Gold (XAU/USD) — Playing the Range Ahead of NFP",
    instrument: "XAU/USD",
    type: "Metals",
    bias: "NEUTRAL",
    minPlan: "COMPLETE" as const,
    excerpt:
      "Gold has coiled into a tightening range ahead of Friday's Non-Farm Payrolls print. Rather than guessing the number, here's our plan for both breakout scenarios.",
    body: `XAU/USD has been consolidating between 2,325 and 2,378 for the past week, with volatility compressing noticeably into Friday's NFP release — a setup we like to trade reactively rather than predictively.

Scenario A (strong NFP / risk-off unwind): a break and hourly close below 2,325 opens the door to 2,290, with stops above 2,345.

Scenario B (soft NFP / dovish repricing): a break and hourly close above 2,378 targets 2,420, with stops below 2,358.

We will not be pre-positioning ahead of the release — this note is your playbook for the 30 minutes after the number drops, not a signal to act on right now.`,
  },
  {
    title: "USD/JPY — Intervention Watch Above 160",
    instrument: "USD/JPY",
    type: "Positional",
    bias: "SELL",
    minPlan: "STRATEGY" as const,
    excerpt:
      "USD/JPY is grinding back toward levels that have triggered verbal and actual intervention before. We're not fighting the trend, but we are sizing down and watching the tape closely.",
    body: `Historically, moves above 160.00 on USD/JPY have drawn increasingly direct language from Japanese officials, and on two prior occasions actual intervention followed within days.

Our approach here is asymmetric: we're not shorting into strength pre-emptively, but we have alerts set from 160.20 upward, and we'll look to fade any sharp, high-volume reversal candle on the 1-hour chart as a probable intervention signature, targeting a move back toward 157.50.

Position sizing on this one is intentionally conservative — intervention-driven moves are fast and can gap through normal stop levels.`,
  },
];

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureSchema();

  await sql`update strategies set author = 'BE4 Trading Desk' where author = 'QuantEdge Desk'`;

  // One-off migration: old plan names -> new pricing plan names (client pricing update, Aug 2026)
  await sql`
    update members set plan = case plan
      when 'BASIC' then 'RESEARCH'
      when 'PREMIUM' then 'STRATEGY'
      when 'ULTIMATE' then 'COMPLETE'
      else plan
    end
    where plan in ('BASIC', 'PREMIUM', 'ULTIMATE')
  `;
  await sql`
    update strategies set min_plan = case min_plan
      when 'BASIC' then 'RESEARCH'
      when 'PREMIUM' then 'STRATEGY'
      when 'ULTIMATE' then 'COMPLETE'
      else min_plan
    end
    where min_plan in ('BASIC', 'PREMIUM', 'ULTIMATE')
  `;

  const existing = await countStrategies();
  if (existing === 0) {
    for (const s of SAMPLE_STRATEGIES) {
      await createStrategy(s);
    }
  }

  // Seed a couple of illustrative subscriber rows so the admin panel isn't empty.
  await sql`
    insert into members (name, email, role, plan, status, billing_cycle, next_billing_at)
    values
      ('Ryan Sanders', 'ryan.s@example.com', 'CLIENT', 'STRATEGY', 'ACTIVE', 'MONTHLY', now() + interval '12 days'),
      ('Priya Kapoor', 'priya.k@example.com', 'CLIENT', 'COMPLETE', 'ACTIVE', 'MONTHLY', now() + interval '30 days'),
      ('Arjun Mehta', 'arjun.m@example.com', 'CLIENT', 'RESEARCH', 'PAST_DUE', 'MONTHLY', now() - interval '2 days')
    on conflict (email) do nothing
  `;

  return NextResponse.json({ ok: true, seededStrategies: existing === 0 ? SAMPLE_STRATEGIES.length : 0 });
}
