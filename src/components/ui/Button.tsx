import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-accent to-accent3 text-[#04150f] shadow-[0_10px_30px_-8px_rgba(0,229,160,0.5)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-6px_rgba(0,229,160,0.6)]",
  outline:
    "border border-edge2 text-ink bg-white/[0.02] hover:bg-white/[0.06] hover:-translate-y-0.5",
  ghost: "text-dim hover:text-ink",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[14.5px]",
  sm: "px-3.5 py-2 text-[13px] rounded-lg",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
