import { getAdminStats, countStrategies } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const strategyCount = await countStrategies();

  const planRows: { key: "RESEARCH" | "STRATEGY" | "COMPLETE"; label: string; color: string }[] = [
    { key: "RESEARCH", label: "Research", color: "bg-accent3" },
    { key: "STRATEGY", label: "Strategy", color: "bg-accent" },
    { key: "COMPLETE", label: "Complete", color: "bg-[#c7bcff]" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Overview</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">A quick look at how the desk is performing — live from the database.</div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total subscribers" value={stats.total.toLocaleString("en-US")} />
        <Stat label="Monthly recurring revenue" value={`$${stats.mrr.toLocaleString("en-US")}`} />
        <Stat label="Payment failed" value={String(stats.pastDue)} danger={stats.pastDue > 0} />
        <Stat label="Published strategies" value={String(strategyCount)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5.5">
          <h3 className="mb-4 text-[16px]">Illustrative growth curve</h3>
          <PerformanceChart />
          <p className="mt-2.5 text-[11px] text-faint">Demo sparkline — connect real MRR history for production.</p>
        </Card>
        <Card className="p-5.5">
          <h3 className="mb-4 text-[16px]">Plan breakdown</h3>
          {planRows.map((row) => (
            <div key={row.key} className="flex items-center gap-2.5 border-b border-edge py-2.5 text-[13px] last:border-none">
              <span className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
              <span className="flex-1">{row.label}</span>
              <span className="font-mono-num">{stats.byPlan[row.key] ?? 0}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <Card className="p-5">
      <div className={`font-mono-num text-2xl font-bold ${danger ? "text-danger" : ""}`}>{value}</div>
      <div className="mt-1 text-[12.5px] text-faint">{label}</div>
    </Card>
  );
}
