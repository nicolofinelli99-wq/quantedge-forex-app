"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import clsx from "clsx";

export function SelfStatusToggle({ initialActive }: { initialActive: boolean }) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const res = await fetch("/api/member/self-toggle", { method: "POST" });
    const data = await res.json();
    setActive(data.status === "ACTIVE");
    startTransition(() => router.refresh());
  }

  return (
    <div className="rounded-[11px] border border-dashed border-warn/40 bg-warn/10 p-3.5">
      <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-bold tracking-wide text-warn">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        DEMO CONTROL
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-dim">Simulate payment failed</span>
        <button
          onClick={toggle}
          disabled={pending}
          className={clsx(
            "relative h-7 w-[52px] rounded-full border transition-colors",
            !active ? "border-danger/40 bg-danger/20" : "border-edge2 bg-surface2"
          )}
        >
          <span
            className={clsx(
              "absolute top-0.5 h-[22px] w-[22px] rounded-full transition-all",
              !active ? "left-[26px] bg-gradient-to-br from-danger to-[#ff8a5c]" : "left-0.5 bg-gradient-to-br from-accent to-accent3"
            )}
          />
        </button>
      </div>
    </div>
  );
}
