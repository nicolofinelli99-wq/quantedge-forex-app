import { listStrategiesForAdmin } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PublishForm } from "@/components/admin/PublishForm";

export const dynamic = "force-dynamic";

export default async function PublishPage() {
  const strategies = await listStrategiesForAdmin();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Publish Strategy</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">Written strategies, saved straight to the database.</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-5.5">
          <h3 className="mb-4 text-[16px]">Publish a new strategy</h3>
          <PublishForm />
        </Card>
        <Card className="p-5.5">
          <h3 className="mb-4 text-[16px]">Recently published ({strategies.length})</h3>
          <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {strategies.map((s) => (
              <div key={s.id} className="rounded-[12px] border border-edge bg-white/[0.015] p-3.5">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="text-[13.5px] font-semibold leading-snug">{s.title}</div>
                  <Badge tone="purple">{s.type}</Badge>
                </div>
                <p className="mb-1.5 line-clamp-2 text-[12.5px] text-dim">{s.excerpt}</p>
                <div className="flex justify-between text-[11px] text-faint">
                  <span>{new Date(s.published_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  <span>Min plan: {s.min_plan}</span>
                </div>
              </div>
            ))}
            {strategies.length === 0 && <p className="text-[13.5px] text-dim">Nothing published yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
