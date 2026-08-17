"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Strategy } from "@/lib/data";

type Mode = "create" | "edit";

export function PublishForm({ mode = "create", strategy }: { mode?: Mode; strategy?: Strategy }) {
  const router = useRouter();
  const [title, setTitle] = useState(strategy?.title ?? "");
  const [instrument, setInstrument] = useState(strategy?.instrument ?? "");
  const [type, setType] = useState(strategy?.type ?? "Intraday");
  const [bias, setBias] = useState(strategy?.bias ?? "BUY");
  const [excerpt, setExcerpt] = useState(strategy?.excerpt ?? "");
  const [fullBody, setFullBody] = useState(strategy?.body ?? "");
  const [minPlan, setMinPlan] = useState(strategy?.min_plan ?? "RESEARCH");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setDone(false);
    setError("");

    const url = mode === "edit" ? `/api/strategies/${strategy!.id}` : "/api/strategies";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, instrument, type, bias, excerpt, fullBody, minPlan }),
    });
    setSubmitting(false);

    if (res.ok) {
      if (mode === "edit") {
        router.push("/admin/publish");
        router.refresh();
        return;
      }
      setTitle("");
      setInstrument("");
      setExcerpt("");
      setFullBody("");
      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Title</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. EUR/USD — Fading the London Open Spike" />
      </div>
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Pair / instrument</label>
        <input className={inputClass} value={instrument} onChange={(e) => setInstrument(e.target.value)} placeholder="e.g. EUR/USD" />
      </div>
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Type</label>
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {["Intraday", "Swing", "Scalp", "Positional", "Metals"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Bias</label>
        <select className={inputClass} value={bias} onChange={(e) => setBias(e.target.value)}>
          <option>BUY</option>
          <option>SELL</option>
          <option>NEUTRAL</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Minimum plan required</label>
        <select className={inputClass} value={minPlan} onChange={(e) => setMinPlan(e.target.value as typeof minPlan)}>
          <option value="RESEARCH">Research (all members)</option>
          <option value="STRATEGY">Strategy+</option>
          <option value="COMPLETE">Complete only</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Short excerpt (shown as teaser)</label>
        <textarea required className={inputClass + " min-h-[70px] resize-y"} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences that hook the reader…" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-2 block text-[12.5px] font-medium text-dim">Full strategy write-up</label>
        <textarea required className={inputClass + " min-h-[160px] resize-y"} value={fullBody} onChange={(e) => setFullBody(e.target.value)} placeholder="Write the full analysis: context, reasoning, key levels and risk plan…" />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3 text-[14.5px] font-semibold text-[#04150f] disabled:opacity-60"
        >
          {submitting ? (mode === "edit" ? "Saving…" : "Publishing…") : mode === "edit" ? "Save changes" : "Publish to dashboard"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={() => router.push("/admin/publish")}
            className="rounded-xl border border-edge2 bg-white/[0.02] px-6 py-3 text-[14.5px] font-semibold text-ink hover:bg-white/[0.06]"
          >
            Cancel
          </button>
        )}
        {done && <span className="text-[13px] text-accent">✓ Published — now live on member dashboards</span>}
        {error && <span className="text-[13px] text-danger">{error}</span>}
      </div>
    </form>
  );
}
