import { getAdminStats, getPlanPrices } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const stats = await getAdminStats();
  const prices = await getPlanPrices();
  const plans = ["RESEARCH", "STRATEGY", "COMPLETE"] as const;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Revenue</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">Live monthly recurring revenue, computed from active subscribers.</div>
      </div>
      <Card className="mb-5 p-5.5">
        <div className="mb-1 font-mono-num text-3xl font-bold">${stats.mrr.toLocaleString("en-US")}</div>
        <div className="mb-5 text-[12.5px] text-faint">Estimated MRR across {stats.total} active-plan subscribers</div>
        <PerformanceChart />
      </Card>
      <Card className="overflow-x-auto p-5.5">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wide text-faint">
              <th className="py-2.5 pr-3">Plan</th>
              <th className="py-2.5 pr-3">Subscribers</th>
              <th className="py-2.5 pr-3">Price / mo</th>
              <th className="py-2.5 pr-3">Contribution</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => {
              const count = stats.byPlan[p] ?? 0;
              const price = prices[p].monthly;
              return (
                <tr key={p} className="border-b border-edge last:border-none">
                  <td className="py-3 pr-3">{p.charAt(0) + p.slice(1).toLowerCase()}</td>
                  <td className="py-3 pr-3 font-mono-num">{count}</td>
                  <td className="py-3 pr-3 font-mono-num">${price}</td>
                  <td className="py-3 pr-3 font-mono-num">${(count * price).toLocaleString("en-US")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
