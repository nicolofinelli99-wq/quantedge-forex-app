import Stripe from "stripe";
import { Plan, BillingCycle } from "@/lib/plans";

let _stripe: Stripe | null = null;

/** Throws a clear error if Stripe isn't configured yet — callers should catch and
 *  return a friendly "payments aren't set up yet" response rather than a 500. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) {
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

/** Maps our internal (plan, billing cycle) to the Stripe Price ID the client
 *  creates in their own Stripe dashboard once they connect their account. */
export const STRIPE_PRICE_ENV_KEYS: Record<Plan, Record<BillingCycle, string>> = {
  RESEARCH: { MONTHLY: "STRIPE_PRICE_RESEARCH_MONTHLY", YEARLY: "STRIPE_PRICE_RESEARCH_YEARLY" },
  STRATEGY: { MONTHLY: "STRIPE_PRICE_STRATEGY_MONTHLY", YEARLY: "STRIPE_PRICE_STRATEGY_YEARLY" },
  COMPLETE: { MONTHLY: "STRIPE_PRICE_COMPLETE_MONTHLY", YEARLY: "STRIPE_PRICE_COMPLETE_YEARLY" },
};

export function getPriceId(plan: Plan, cycle: BillingCycle): string | undefined {
  const envKey = STRIPE_PRICE_ENV_KEYS[plan][cycle];
  return process.env[envKey];
}

/** Reverse lookup used when syncing subscription changes made in the Stripe
 *  customer portal (upgrade/downgrade) back onto our own plan/cycle fields. */
export function planFromPriceId(priceId: string): { plan: Plan; cycle: BillingCycle } | null {
  for (const plan of Object.keys(STRIPE_PRICE_ENV_KEYS) as Plan[]) {
    for (const cycle of ["MONTHLY", "YEARLY"] as BillingCycle[]) {
      if (getPriceId(plan, cycle) === priceId) return { plan, cycle };
    }
  }
  return null;
}
