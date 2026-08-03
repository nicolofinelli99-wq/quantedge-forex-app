// Pure constants/types shared by both server and client code.
// IMPORTANT: this file must stay free of any server-only imports (no "@/lib/db",
// no "postgres" package) so client components can safely import it without
// pulling Node-only dependencies into the browser bundle.

export type Plan = "BASIC" | "PREMIUM" | "ULTIMATE";
export type MemberStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED";
export type Role = "CLIENT" | "ADMIN";
export type BillingCycle = "MONTHLY" | "YEARLY";

export const PLAN_RANK: Record<Plan, number> = {
  BASIC: 0,
  PREMIUM: 1,
  ULTIMATE: 2,
};

export const PLAN_PRICE: Record<Plan, { monthly: number; yearly: number }> = {
  BASIC: { monthly: 49, yearly: 499 },
  PREMIUM: { monthly: 99, yearly: 999 },
  ULTIMATE: { monthly: 199, yearly: 1999 },
};
