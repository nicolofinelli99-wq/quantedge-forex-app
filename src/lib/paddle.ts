import { Plan, BillingCycle } from "@/lib/plans";

/** Maps our internal (plan, billing cycle) to the Paddle Price ID the client
 *  creates in their own Paddle dashboard once they connect their account. */
export const PADDLE_PRICE_ENV_KEYS: Record<Plan, Record<BillingCycle, string>> = {
  RESEARCH: { MONTHLY: "PADDLE_PRICE_RESEARCH_MONTHLY", YEARLY: "PADDLE_PRICE_RESEARCH_YEARLY" },
  STRATEGY: { MONTHLY: "PADDLE_PRICE_STRATEGY_MONTHLY", YEARLY: "PADDLE_PRICE_STRATEGY_YEARLY" },
  COMPLETE: { MONTHLY: "PADDLE_PRICE_COMPLETE_MONTHLY", YEARLY: "PADDLE_PRICE_COMPLETE_YEARLY" },
};

export function getPaddlePriceId(plan: Plan, cycle: BillingCycle): string | undefined {
  const envKey = PADDLE_PRICE_ENV_KEYS[plan][cycle];
  return process.env[envKey];
}

/** Reverse lookup used when syncing subscription changes (upgrade/downgrade)
 *  back onto our own plan/cycle fields from a Paddle webhook payload. */
export function paddlePlanFromPriceId(priceId: string): { plan: Plan; cycle: BillingCycle } | null {
  for (const plan of Object.keys(PADDLE_PRICE_ENV_KEYS) as Plan[]) {
    for (const cycle of ["MONTHLY", "YEARLY"] as BillingCycle[]) {
      if (getPaddlePriceId(plan, cycle) === priceId) return { plan, cycle };
    }
  }
  return null;
}

/** The Paddle.js client-side token (safe to expose to the browser — it's scoped
 *  to only open checkouts, not to read/write account data). */
export function getPaddleClientToken(): string | undefined {
  return process.env.PADDLE_CLIENT_TOKEN;
}

/** "sandbox" while testing with a Paddle sandbox account, "production" once live.
 *  Defaults to production so a missing env var never silently leaves test mode on. */
export function getPaddleEnvironment(): "sandbox" | "production" {
  return process.env.PADDLE_ENVIRONMENT === "sandbox" ? "sandbox" : "production";
}

export function isPaddleConfigured(): boolean {
  return Boolean(getPaddleClientToken());
}

export function isPaddleWebhookConfigured(): boolean {
  return Boolean(process.env.PADDLE_WEBHOOK_SECRET_KEY);
}
