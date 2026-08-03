"use client";
import { usePathname } from "next/navigation";
import { SideLink } from "@/components/AppShell";

const nav = [
  { href: "/admin", label: "Overview", icon: <GridIcon /> },
  { href: "/admin/publish", label: "Publish Strategy", icon: <PenIcon /> },
  { href: "/admin/subscribers", label: "Subscribers", icon: <UsersIcon /> },
  { href: "/admin/revenue", label: "Revenue", icon: <CoinIcon /> },
  { href: "/admin/settings", label: "Settings", icon: <GearIcon /> },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  return (
    <>
      <div className="mb-8 flex items-center gap-2.5 px-1.5 font-head text-lg font-bold">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent3 text-sm font-extrabold text-[#04150f]">
          Q
        </span>
        QuantEdge
      </div>
      <div className="mb-2 px-3 text-[10.5px] uppercase tracking-wide text-faint">Manage</div>
      <nav className="flex-1">
        {nav.map((item) => (
          <SideLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} />
        ))}
      </nav>
      <div className="mt-4 border-t border-edge pt-4">
        <div className="mb-3 flex items-center gap-2.5 rounded-[11px] bg-surface2 px-3.5 py-2.5">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent3 text-[11px] font-bold text-[#0a0518]">
            {adminName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="text-[13px] font-semibold">{adminName}</div>
            <div className="text-[11px] text-faint">Desk Admin</div>
          </div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="w-full rounded-[10px] px-3 py-2 text-left text-[12.5px] text-faint hover:text-ink">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" strokeLinecap="round" />
      <path d="M17 8.5a3.5 3.5 0 1 1 0 0Z" /><path d="M21.5 20c0-2.6-1.8-4.7-4-5.6" strokeLinecap="round" />
    </svg>
  );
}
function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
