"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [instrument, setInstrument] = useState("");
  const [type, setType] = useState("Intraday");
  const [bias, setBias] = useState("BUY");
  const [excerpt, setExcerpt] = useState("");
  const [fullBody, setFullBody] = useState("");
  const [minPlan, setMinPlan] = useState("BASIC");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setDone(false);
    const res = await fetch("/api/strategies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, instrument, type, bias, excerpt, fullBody, minPlan }),
    });
    setSubmitting(false);
    if (res.ok) {
      setTitle("");
      setInstrument("");
      setExcerpt("");
      setFullBody("");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="grid gap-3.5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[12.5px] text-faint">Title</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. EUR/USD — Fading the London Open Spike" />
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] text-faint">Pair / instrument</label>
        <input className={inputClass} value={instrument} onChange={(e) => setInstrument(e.target.value)} placeholder="e.g. EUR/USD" />
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] text-faint">Type</label>
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {["Intraday", "Swing", "Scalp", "Positional", "Metals"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] text-faint">Bias</label>
        <select className={inputClass} value={bias} onChange={(e) => setBias(e.target.value)}>
          <option>BUY</option>
          <option>SELL</option>
          <option>NEUTRAL</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[12.5px] text-faint">Minimum plan required</label>
        <select className={inputClass} value={minPlan} onChange={(e) => setMinPlan(e.target.value)}>
          <option value="BASIC">Basic (all members)</option>
          <option value="PREMIUM">Premium+</option>
          <option value="ULTIMATE">Ultimate only</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[12.5px] text-faint">Short excerpt (shown as teaser)</label>
        <textarea required className={inputClass + " min-h-[70px] resize-y"} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences that hook the reader…" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[12.5px] text-faint">Full strategy write-up</label>
        <textarea required className={inputClass + " min-h-[160px] resize-y"} value={fullBody} onChange={(e) => setFullBody(e.target.value)} placeholder="Write the full analysis: context, reasoning, key levels and risk plan…" />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3 text-[14.5px] font-semibold text-[#04150f] disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish to dashboard"}
        </button>
        {done && <span className="text-[13px] text-accent">✓ Published — now live on member dashboards</span>}
      </div>
    </form>
  );
}
