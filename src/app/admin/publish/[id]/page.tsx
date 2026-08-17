import { notFound } from "next/navigation";
import { getStrategyById } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { PublishForm } from "@/components/admin/PublishForm";

export const dynamic = "force-dynamic";

export default async function EditStrategyPage({ params }: { params: { id: string } }) {
  const strategy = await getStrategyById(params.id);
  if (!strategy) notFound();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Edit Strategy</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">Changes go live on member dashboards immediately.</div>
      </div>
      <Card className="max-w-3xl p-5.5">
        <PublishForm mode="edit" strategy={strategy} />
      </Card>
    </div>
  );
}
