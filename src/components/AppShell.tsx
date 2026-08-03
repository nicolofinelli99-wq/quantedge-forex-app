import { ReactNode } from "react";
import Link from "next/link";

export function AppShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[250px] flex-shrink-0 flex-col border-r border-edge bg-bg2 px-4.5 py-6 md:flex">
        {sidebar}
      </aside>
      <main className="min-w-0 flex-1 px-6 pb-16 pt-7 md:px-9">{children}</main>
    </div>
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
