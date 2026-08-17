"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteStrategyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this strategy permanently? It will disappear from every member's dashboard.")) return;
    setLoading(true);
    await fetch(`/api/strategies/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-[11.5px] font-semibold text-danger disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
