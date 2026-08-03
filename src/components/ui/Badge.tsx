import clsx from "clsx";
import { ReactNode } from "react";

type Tone = "green" | "red" | "amber" | "grey" | "purple";

const tones: Record<Tone, string> = {
  green: "text-accent bg-accent/10 border-accent/25",
  red: "text-danger bg-danger/10 border-danger/25",
  amber: "text-warn bg-warn/10 border-warn/25",
  grey: "text-faint bg-white/5 border-edge",
  purple: "text-[#c7bcff] bg-[#7b6cff]/15 border-[#7b6cff]/30",
};

export function Badge({ tone = "grey", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
