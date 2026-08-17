"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan, BillingCycle } from "@/lib/plans";

const inputClass =
  "w-full rounded-[10px] border border-edge2 bg-bg2 px-3 py-2.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

export function AddSubscriberForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<Plan>("STRATEGY");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, plan, billingCycle }),
    });
    setSubmitting(false);
    if (res.ok) {
      setName("");
      setEmail("");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not add subscriber.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-[10px] border border-edge2 bg-white/[0.02] px-4 py-2.5 text-[13px] font-semibold text-ink hover:bg-white/[0.06]"
      >
        + Add subscriber manually
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[14px] border border-edge2 bg-white/[0.02] p-4.5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[13.5px] font-semibold">Add a subscriber manually</div>
        <button type="button" onClick={() => setOpen(false)} className="text-[12px] text-faint hover:text-ink">Cancel</button>
      </div>
      <p className="mb-4 text-[12px] leading-relaxed text-faint">
        For customers who paid outside the site (bank transfer, cash, invoice, etc.) — this activates their
        dashboard access immediately. They set their own password later via &quot;Forgot password&quot; using
        this email.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input required className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="email" className={inputClass} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className={inputClass} value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
          <option value="RESEARCH">Research</option>
          <option value="STRATEGY">Strategy</option>
          <option value="COMPLETE">Complete</option>
        </select>
        <select className={inputClass} value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-gradient-to-br from-accent to-accent3 px-5 py-2.5 text-[13px] font-semibold text-[#04150f] disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Activate subscriber"}
        </button>
        {done && <span className="text-[12.5px] text-accent">✓ Added</span>}
        {error && <span className="text-[12px] text-danger">{error}</span>}
      </div>
    </form>
  );
}
