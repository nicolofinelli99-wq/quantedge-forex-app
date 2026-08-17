"use client";
import { useState } from "react";

export function ManageBillingButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    setLoading(false);
    setError(data.error || "Could not open billing portal.");
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={className ?? "w-full rounded-[10px] border border-edge2 bg-white/[0.02] px-3.5 py-2.5 text-[12.5px] font-semibold text-ink hover:bg-white/[0.06] disabled:opacity-60"}
      >
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error && <p className="mt-2 text-[11.5px] text-danger">{error}</p>}
    </div>
  );
}
