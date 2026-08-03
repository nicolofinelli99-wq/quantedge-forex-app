"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { Strategy } from "@/lib/data";

const biasTone: Record<string, "green" | "red" | "grey"> = {
  BUY: "green",
  SELL: "red",
};

export function StrategyCard({ strategy, locked }: { strategy: Strategy; locked: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-3.5 overflow-hidden rounded-[13px] border border-edge2 bg-white/[0.035] p-4.5">
      <div className={locked ? "pointer-events-none blur-[5px] select-none" : ""}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="font-head text-[15.5px] font-semibold leading-snug">{strategy.title}</div>
          <div className="flex flex-shrink-0 gap-1.5">
            {strategy.bias && <Badge tone={biasTone[strategy.bias] ?? "grey"}>{strategy.bias} BIAS</Badge>}
            <Badge tone="purple">{strategy.type}</Badge>
          </div>
        </div>
        <p className="mb-1 text-[13.5px] leading-relaxed text-dim">{strategy.excerpt}</p>
        {open && (
          <div className="mt-2.5 whitespace-pre-line border-t border-dashed border-edge pt-3 text-[13.5px] leading-relaxed text-dim">
            {strategy.body}
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent3"
        >
          {open ? "Show less" : "Read full strategy"}
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="mt-2.5 flex justify-between text-xs text-faint">
          <span>{new Date(strategy.published_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          <span>By {strategy.author}</span>
        </div>
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#060910]/40">
          <Badge tone="amber">🔒 Requires {strategy.min_plan.charAt(0) + strategy.min_plan.slice(1).toLowerCase()}+</Badge>
        </div>
      )}
    </div>
  );
}
