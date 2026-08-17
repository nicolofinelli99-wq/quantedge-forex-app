"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan, MemberStatus } from "@/lib/plans";

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: "RESEARCH", label: "Research" },
  { value: "STRATEGY", label: "Strategy" },
  { value: "COMPLETE", label: "Complete" },
];

const STATUS_OPTIONS: { value: MemberStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAST_DUE", label: "Payment failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "INACTIVE", label: "No plan" },
];

const selectClass =
  "rounded-[8px] border border-edge2 bg-bg2 px-2 py-1.5 text-[12.5px] text-ink outline-none focus:border-accent";

export function MemberRowEditor({ id, plan, status }: { id: string; plan: Plan; status: MemberStatus }) {
  const router = useRouter();
  const [selPlan, setSelPlan] = useState<Plan>(plan);
  const [selStatus, setSelStatus] = useState<MemberStatus>(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = selPlan !== plan || selStatus !== status;

  async function save() {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/subscribers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selPlan, status: selStatus }),
    });
    setSaving(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save.");
    }
  }

  async function remove() {
    if (!confirm("Remove this subscriber permanently? This can't be undone.")) return;
    setSaving(true);
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    setSaving(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Could not delete.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select className={selectClass} value={selPlan} onChange={(e) => setSelPlan(e.target.value as Plan)} disabled={saving}>
        {PLAN_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select className={selectClass} value={selStatus} onChange={(e) => setSelStatus(e.target.value as MemberStatus)} disabled={saving}>
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          className="rounded-[8px] border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-[12px] font-semibold text-accent disabled:opacity-50"
        >
          {saving ? "…" : "Save"}
        </button>
      )}
      <button
        onClick={remove}
        disabled={saving}
        className="rounded-[8px] border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-[12px] font-semibold text-danger disabled:opacity-50"
        title="Delete subscriber"
      >
        Delete
      </button>
      {error && <span className="w-full text-[11px] text-danger">{error}</span>}
    </div>
  );
}
