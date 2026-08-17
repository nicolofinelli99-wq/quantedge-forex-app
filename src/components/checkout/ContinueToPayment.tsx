"use client";
import { useState } from "react";
import { Plan, BillingCycle } from "@/lib/plans";

export function ContinueToPayment({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, cycle }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    setLoading(false);
    setError(data.error || "Payments aren't set up yet. Please check back soon.");
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? "Redirecting to secure payment…" : "Continue to secure payment"}
      </button>
      {error && <p className="mt-3 text-[12.5px] text-danger">{error}</p>}
    </div>
  );
}
