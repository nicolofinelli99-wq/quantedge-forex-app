// Pure constants/types shared by both server and client code.
// IMPORTANT: this file must stay free of any server-only imports (no "@/lib/db",
// no "postgres" package) so client components can safely import it without
// pulling Node-only dependencies into the browser bundle.

export type Plan = "RESEARCH" | "STRATEGY" | "COMPLETE";
// INACTIVE = signed up but has never completed a successful payment yet.
export type MemberStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED" | "INACTIVE";
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

export const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: "Subscription Active",
  PAST_DUE: "Payment Failed",
  CANCELLED: "Subscription Cancelled",
  INACTIVE: "No Active Plan",
};
