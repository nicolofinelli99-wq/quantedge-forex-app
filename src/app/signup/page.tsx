"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ParticleBackground } from "@/components/ParticleBackground";
import { PLAN_PRICE, Plan, BillingCycle } from "@/lib/plans";

const inputClass =
  "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

function planLabel(plan: string): string {
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}

function SignupInner() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = params.get("plan") as Plan | null;
  const cycle = (params.get("cycle") as BillingCycle) ?? "MONTHLY";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<Record<Plan, { monthly: number; yearly: number }>>(PLAN_PRICE);

  useEffect(() => {
    fetch("/api/plan-prices")
      .then((r) => r.json())
      .then((data) => {
        if (data?.prices) setPrices(data.prices);
      })
      .catch(() => {});
  }, []);

  const price = plan ? prices[plan] : null;
  const amount = price ? (cycle === "YEARLY" ? price.yearly : price.monthly) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        setError(signupData.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      if (plan) {
        const checkoutRes = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, cycle }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutRes.ok && checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
        // Payments not configured yet — account is still created, just no plan attached.
        router.push("/dashboard");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <ParticleBackground />
      <Card className="relative z-10 w-full max-w-md px-8 py-10">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-6 w-auto" />
        </Link>
        <h1 className="mb-2 text-center text-2xl">Create your account</h1>
        {plan && amount !== null ? (
          <p className="mb-7 text-center text-[13.5px] text-dim">
            You&apos;re signing up for the <b className="text-ink">{planLabel(plan)}</b> plan — $
            {amount} / {cycle === "YEARLY" ? "year" : "month"}. Enter your details, then continue to secure payment.
          </p>
        ) : (
          <p className="mb-7 text-center text-[13.5px] text-dim">
            Create your dashboard account — you can choose a plan right after.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12.5px] text-faint">Full name</label>
            <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Trader" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] text-faint">Email</label>
            <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] text-faint">Password</label>
            <input
              required
              type="password"
              minLength={8}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-[12.5px] text-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? "Creating account…" : plan ? "Continue to payment" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-faint">
          Already have an account?{" "}
          <Link href="/login" className="text-accent3 hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}
