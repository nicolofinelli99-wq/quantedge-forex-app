"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MemberStatus } from "@/lib/data";

export function RevokeButton({ id, status }: { id: string; status: MemberStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function act(action: "revoke" | "restore") {
    setLoading(true);
    await fetch(`/api/subscribers/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    router.refresh();
  }

  if (status === "PAST_DUE") {
    return (
      <button
        onClick={() => act("restore")}
        disabled={loading}
        className="rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-2 text-[13px] font-semibold text-accent disabled:opacity-50"
      >
        Restore
      </button>
    );
  }
  if (status === "CANCELLED" || status === "INACTIVE") {
    return <span className="text-[12px] text-faint">—</span>;
  }
  return (
    <button
      onClick={() => act("revoke")}
      disabled={loading}
      className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2 text-[13px] font-semibold text-danger disabled:opacity-50"
    >
      Revoke
    </button>
  );
}
