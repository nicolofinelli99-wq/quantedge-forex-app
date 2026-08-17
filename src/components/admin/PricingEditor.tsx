"use client";
import { useState } from "react";
import { Plan } from "@/lib/plans";

const LABEL: Record<Plan, string> = { RESEARCH: "Research", STRATEGY: "Strategy", COMPLETE: "Complete" };
const PLANS: Plan[] = ["RESEARCH", "STRATEGY", "COMPLETE"];

export function PricingEditor({ prices }: { prices: Record<Plan, { monthly: number; yearly: number }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PLANS.map((p) => (
        <PlanRow key={p} plan={p} initial={prices[p]} />
      ))}
    </div>
  );
}

function PlanRow({ plan, initial }: { plan: Plan; initial: { monthly: number; yearly: number } }) {
  const [monthly, setMonthly] = useState(String(initial.monthly));
  const [yearly, setYearly] = useState(String(initial.yearly));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, monthly: Number(monthly), yearly: Number(yearly) }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not save.");
      }
    } catch {
      setError("Could not save — check your connection.");
    }
    setSaving(false);
  }

  const inputClass =
    "w-full rounded-[10px] border border-edge2 bg-bg2 px-3 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-accent hover:border-white/25 font-mono-num";

  return (
    <div className="rounded-[14px] border border-edge2 bg-white/[0.02] p-4.5">
      <div className="mb-3.5 text-[14.5px] font-semibold">{LABEL[plan]}</div>
      <label className="mb-1.5 block text-[11.5px] text-faint">Monthly price (USD)</label>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-dim">$</span>
        <input className={inputClass} type="number" min={1} value={monthly} onChange={(e) => setMonthly(e.target.value)} />
      </div>
      <label className="mb-1.5 block text-[11.5px] text-faint">Yearly price (USD)</label>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-dim">$</span>
        <input className={inputClass} type="number" min={1} value={yearly} onChange={(e) => setYearly(e.target.value)} />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="w-full rounded-[10px] bg-gradient-to-br from-accent to-accent3 px-4 py-2.5 text-[13px] font-semibold text-[#04150f] disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save price"}
      </button>
      {error && <p className="mt-2 text-[11.5px] text-danger">{error}</p>}
    </div>
  );
}
