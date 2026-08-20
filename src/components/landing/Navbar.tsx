"use client";
import { useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#calculator", label: "Calculator" },
  { href: "#pricing", label: "Pricing" },
  { href: "#compare", label: "Compare plans" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-edge bg-[#060910]/70 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-head text-lg font-bold" onClick={() => setOpen(false)}>
          <img src="/be4-mark.png" alt="" className="h-7 w-auto md:h-8" />
          <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-4.5 w-auto md:h-6" />
        </Link>
        <div className="hidden gap-8 text-[14.5px] font-medium text-dim md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink">{l.label}</a>
          ))}
        </div>
        <div className="hidden items-center gap-3.5 md:flex">
          <LinkButton href="/login" variant="ghost" size="sm">Sign in</LinkButton>
          <LinkButton href="#pricing" size="sm">Get Started</LinkButton>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-edge text-ink md:hidden"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-edge bg-[#060910] px-6 py-5 md:hidden">
          <div className="mb-5 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-2.5 py-2.5 text-[15px] font-medium text-dim hover:bg-white/[0.04] hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <LinkButton href="/login" variant="outline" onClick={() => setOpen(false)}>Sign in</LinkButton>
            <LinkButton href="#pricing" onClick={() => setOpen(false)}>Get Started</LinkButton>
          </div>
        </div>
      )}
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
