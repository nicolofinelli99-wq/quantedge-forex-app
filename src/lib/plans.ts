// Pure constants/types shared by both server and client code.
// IMPORTANT: this file must stay free of any server-only imports (no "@/lib/db",
// no "postgres" package) so client components can safely import it without
// pulling Node-only dependencies into the browser bundle.

export type Plan = "RESEARCH" | "STRATEGY" | "COMPLETE";
export type MemberStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED";
export type Role = "CLIENT" | "ADMIN";
export type BillingCycle = "MONTHLY" | "YEARLY";

export const PLAN_RANK: Record<Plan, number> = {
  RESEARCH: 0,
  STRATEGY: 1,
  COMPLETE: 2,
};

export const PLAN_PRICE: Record<Plan, { monthly: number; yearly: number }> = {
  RESEARCH: { monthly: 20, yearly: 200 },
  STRATEGY: { monthly: 40, yearly: 400 },
  COMPLETE: { monthly: 50, yearly: 500 },
};
