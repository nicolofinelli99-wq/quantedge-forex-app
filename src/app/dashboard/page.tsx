import { redirect } from "next/navigation";
import { getMemberById, listStrategiesForMember } from "@/lib/data";
import { PLAN_PRICE } from "@/lib/plans";
import { getSessionMemberId } from "@/lib/session";
import { AppShell, SideLink } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StrategyCard } from "@/components/dashboard/StrategyCard";
import { SelfStatusToggle } from "@/components/dashboard/SelfStatusToggle";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const id = getSessionMemberId();
  const member = await getMemberById(id);

  if (!member) redirect("/login");
  if (member.role === "ADMIN") redirect("/admin");

  const feed = await listStrategiesForMember(member);
  const locked = member.status !== "ACTIVE";
  const planLabel = member.plan.charAt(0) + member.plan.slice(1).toLowerCase();

  return (
    <AppShell
      sidebar={
        <>
          <div className="mb-8 flex items-center gap-2.5 px-1.5 font-head text-lg font-bold">
            <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
            <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-5 w-auto" />
          </div>
          <nav className="flex-1">
            <SideLink active label="Overview" icon={<GridIcon />} />
            <SideLink label="Strategy Feed" icon={<TrendIcon />} />
            <SideLink label="Performance" icon={<ChartIcon />} />
            <SideLink label="My Plan" icon={<UserIcon />} />
            <SideLink label="Support" icon={<HelpIcon />} />
          </nav>
          <div className="mt-4 border-t border-edge pt-4">
            <div className="mb-3 flex items-center justify-between rounded-[11px] bg-surface2 px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent3 text-[11px] font-bold text-[#0a0518]">
                  {member.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{member.name}</div>
                  <div className="text-[11px] text-faint">{planLabel} member</div>
                </div>
              </div>
            </div>
            <SelfStatusToggle initialActive={member.status === "ACTIVE"} />
            <form action="/api/auth/logout" method="POST" className="mt-3">
              <button className="w-full rounded-[10px] px-3 py-2 text-left text-[12.5px] text-faint hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </>
      }
    >
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <h1 className="text-[23px]">Welcome back, {member.name.split(" ")[0]}</h1>
          <div className="mt-0.5 text-[13.5px] text-faint">Here&apos;s what the desk published today.</div>
        </div>
        <Badge tone={locked ? "red" : "green"}>
          ● {locked ? "Payment Failed" : "Subscription Active"}
        </Badge>
      </div>

      <div className="relative">
        <div className={locked ? "pointer-events-none blur-[4px] select-none" : ""}>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<UserIcon />} tone="green" value={planLabel} label="Current plan" />
            <StatCard
              icon={<CalendarIcon />}
              tone="blue"
              value={member.next_billing_at ? new Date(member.next_billing_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
              label="Next billing date"
            />
            <StatCard
              icon={<CoinIcon />}
              tone="purple"
              value={`$${member.billing_cycle === "YEARLY" ? PLAN_PRICE[member.plan].yearly : PLAN_PRICE[member.plan].monthly}`}
              label={member.billing_cycle === "YEARLY" ? "Billed yearly" : "Billed monthly"}
            />
            <StatCard icon={<TrendIcon />} tone="amber" value={String(feed.length)} label="Strategies available" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Card className="p-5.5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[16px]">Today&apos;s strategy feed</h3>
              </div>
              {feed.length === 0 && (
                <p className="text-[13.5px] text-dim">No strategies published yet — check back soon.</p>
              )}
              {feed.map(({ strategy, locked: itemLocked }) => (
                <StrategyCard key={strategy.id} strategy={strategy} locked={itemLocked} />
              ))}
            </Card>

            <div className="space-y-5">
              <Card className="p-5.5">
                <h3 className="mb-4 text-[16px]">Performance</h3>
                <PerformanceChart />
                <p className="mt-2.5 text-[11px] text-faint">Illustrative only — replace with real, verifiable performance data.</p>
              </Card>
              <Card className="p-5.5">
                <h3 className="mb-4 text-[16px]">Announcements</h3>
                <Notice>Live Q&amp;A this Friday at 7 PM GMT — link in Telegram.</Notice>
                <Notice>New Gold (XAU/USD) playbook added to Complete resources.</Notice>
                <Notice last>Lower liquidity expected this week — US markets closed.</Notice>
              </Card>
            </div>
          </div>
        </div>

        {locked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#060910]/55 backdrop-blur-sm">
            <Card className="max-w-sm px-7 py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="4" y="11" width="16" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="mb-2 text-[17px]">Access suspended</h4>
              <p className="mb-5 text-[13.5px] leading-relaxed text-dim">
                Your last payment didn&apos;t go through. Renew now to keep reading daily strategies —
                your history and settings are safe.
              </p>
              <a
                href="/#pricing"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3 text-[14.5px] font-semibold text-[#04150f]"
              >
                Update Payment Method
              </a>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ icon, tone, value, label }: { icon: React.ReactNode; tone: "green" | "blue" | "purple" | "amber"; value: string; label: string }) {
  const toneMap = {
    green: "bg-accent/10 text-accent",
    blue: "bg-accent3/10 text-accent3",
    purple: "bg-accent2/15 text-[#c7bcff]",
    amber: "bg-warn/10 text-warn",
  } as const;
  return (
    <Card className="p-5">
      <div className={`mb-3.5 flex h-8.5 w-8.5 items-center justify-center rounded-[9px] ${toneMap[tone]}`}>{icon}</div>
      <div className="font-mono-num text-2xl font-bold">{value}</div>
      <div className="mt-1 text-[12.5px] text-faint">{label}</div>
    </Card>
  );
}

function Notice({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex gap-2.5 py-2.5 text-[13px] ${last ? "" : "border-b border-edge"}`}>
      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent3" />
      <div>{children}</div>
    </div>
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
function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 3v18h18" strokeLinecap="round" /><path d="M7 15l4-6 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2 3.5M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
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
