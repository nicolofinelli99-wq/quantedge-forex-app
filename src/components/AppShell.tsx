"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[250px] flex-shrink-0 flex-col border-r border-edge bg-bg2 px-4.5 py-6 md:flex">
        {sidebar}
      </aside>

      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-edge bg-bg2/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2.5 font-head text-base font-bold">
          <img src="/be4-mark.png" alt="" className="h-6.5 w-auto" />
          BE4 Trading
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-edge text-ink"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 flex h-full w-[84%] max-w-[300px] flex-col overflow-y-auto border-r border-edge bg-bg2 px-4.5 py-6 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 px-6 pb-16 pt-[76px] md:px-9 md:pt-7">{children}</main>
    </div>
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

const linkClass = (active?: boolean) =>
  "mb-0.5 flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[14px] font-medium " +
  (active ? "bg-white/[0.06] text-ink" : "text-dim hover:bg-white/[0.03] hover:text-ink");

export function SideLink({ icon, label, active, href }: { icon: ReactNode; label: string; active?: boolean; href?: string }) {
  if (href) {
    return (
      <Link href={href} className={linkClass(active)}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <div className={linkClass(active)}>
      {icon}
      {label}
    </div>
  );
}
