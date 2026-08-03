"use client";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { PLAN_PRICE, Plan, BillingCycle } from "@/lib/data";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = (params.get("plan") as Plan) ?? "PREMIUM";
  const cycle = (params.get("cycle") as BillingCycle) ?? "MONTHLY";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pm, setPm] = useState<"card" | "paypal" | "crypto">("card");
  const [stage, setStage] = useState<"idle" | "processing" | "success">("idle");
  const [error, setError] = useState("");

  const price = PLAN_PRICE[plan] ?? PLAN_PRICE.PREMIUM;
  const amount = cycle === "YEARLY" ? price.yearly : price.monthly;

  const canSubmit = useMemo(() => name.trim().length > 1 && /\S+@\S+\.\S+/.test(email), [name, email]);

  async function handlePay() {
    if (!canSubmit || stage !== "idle") return;
    setError("");
    setStage("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, plan, billingCycle: cycle }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      setTimeout(() => {
        setStage("success");
        setTimeout(() => router.push("/dashboard"), 1300);
      }, 900);
    } catch (e) {
      setStage("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[18px] border border-edge bg-surface md:grid-cols-[1fr_1.1fr]">
        <div className="border-b border-edge bg-surface2 p-9 md:border-b-0 md:border-r">
          <Link href="/#pricing" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-dim hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to plans
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent3 text-lg font-extrabold text-[#04150f]">
              Q
            </div>
            <div>
              <div className="text-[17px] font-bold">{plan.charAt(0) + plan.slice(1).toLowerCase()} Plan</div>
              <div className="text-[12.5px] text-faint">Billed {cycle === "YEARLY" ? "yearly" : "monthly"}</div>
            </div>
          </div>
          <div className="flex justify-between border-b border-dashed border-edge py-2.5 text-[14px] text-dim">
            <span>Subscription price</span>
            <span className="font-mono-num">${amount.toLocaleString("en-US")}.00</span>
          </div>
          <div className="flex justify-between py-2.5 pt-4 text-[16px] font-bold">
            <span>Total due today</span>
            <span className="font-mono-num">${amount.toLocaleString("en-US")}.00</span>
          </div>
          <div className="mt-6 border-t border-edge pt-5 text-xs leading-relaxed text-faint">
            Auto-renews every billing cycle. Cancel anytime from your dashboard. If a renewal
            payment fails, dashboard access is paused automatically until payment succeeds.
          </div>
        </div>

        <div className="p-9">
          <h3 className="mb-5 text-lg">Payment details</h3>
          <div className="mb-5 flex gap-2">
            {(["card", "paypal", "crypto"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPm(m)}
                className={clsx(
                  "flex-1 rounded-[10px] border px-2 py-3 text-center text-[12.5px] font-semibold capitalize",
                  pm === m ? "border-accent bg-accent/10 text-accent" : "border-edge2 text-dim"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {pm === "card" && (
            <div className="mb-4 space-y-3">
              <Field label="Card number" placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry" placeholder="MM/YY" />
                <Field label="CVV" placeholder="•••" />
              </div>
            </div>
          )}
          {pm === "paypal" && (
            <div className="mb-4 rounded-lg border border-edge2 bg-bg2 py-6 text-center text-[13.5px] text-dim">
              You&apos;ll be redirected to PayPal to complete this payment securely.
            </div>
          )}
          {pm === "crypto" && (
            <div className="mb-4 space-y-2">
              <Field label="Pay with USDT (TRC20)" defaultValue="TXn9k...placeholder...4mZq" readOnly mono />
              <p className="text-[11.5px] text-faint">
                Send the exact amount shown, then click Pay — confirmation is automatic once the transaction clears.
              </p>
            </div>
          )}

          <Field label="Full name" placeholder="Jane Trader" value={name} onChange={setName} />
          <Field label="Email" placeholder="you@email.com" value={email} onChange={setEmail} type="email" />

          {error && <p className="mb-3 text-[12.5px] text-danger">{error}</p>}

          <button
            onClick={handlePay}
            disabled={!canSubmit || stage !== "idle"}
            className="mt-2 w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#04150f] shadow-[0_10px_30px_-8px_rgba(0,229,160,0.5)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Pay ${amount.toLocaleString("en-US")}.00 Securely
          </button>
          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-faint">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Payments processed securely by Stripe · PCI-DSS compliant
          </div>
        </div>

        {stage !== "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#080b12]/95 text-center backdrop-blur-sm">
            {stage === "processing" ? (
              <>
                <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-edge2 border-t-accent" />
                <div className="font-semibold">Processing your payment…</div>
                <div className="text-[12.5px] text-faint">Do not close this window.</div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent3">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#04150f" strokeWidth={2}>
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-lg font-bold">Payment successful</div>
                <div className="text-[13px] text-dim">Redirecting you to your dashboard…</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  defaultValue,
  readOnly,
  mono,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  readOnly?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[12.5px] text-faint">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(
          "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none focus:border-accent",
          mono && "font-mono-num"
        )}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
