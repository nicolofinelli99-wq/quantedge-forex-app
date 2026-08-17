import { listMembers } from "@/lib/data";
import { STATUS_LABEL } from "@/lib/plans";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MemberRowEditor } from "@/components/admin/MemberRowEditor";
import { AddSubscriberForm } from "@/components/admin/AddSubscriberForm";

export const dynamic = "force-dynamic";

const statusTone = { ACTIVE: "green", PAST_DUE: "red", CANCELLED: "grey", INACTIVE: "amber" } as const;

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const all = await listMembers();
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const members = q
    ? all.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    : all;

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[23px]">Subscribers</h1>
          <div className="mt-0.5 text-[13.5px] text-faint">
            {all.length} member{all.length === 1 ? "" : "s"} in the database
            {q ? ` — ${members.length} matching "${q}"` : ""}.
          </div>
        </div>
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search name or email…"
            className="w-[220px] rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-faint focus:border-accent"
          />
          <button type="submit" className="rounded-[10px] border border-edge2 bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-ink hover:bg-white/[0.06]">
            Search
          </button>
        </form>
      </div>

      <div className="mb-5">
        <AddSubscriberForm />
      </div>

      <Card className="overflow-x-auto p-5.5">
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wide text-faint">
              <th className="py-2.5 pr-3">Member</th>
              <th className="py-2.5 pr-3">Status</th>
              <th className="py-2.5 pr-3">Next billing</th>
              <th className="py-2.5 pr-3">Plan &amp; status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-edge last:border-none">
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent3 text-[12px] font-bold text-[#0a0518]">
                      {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-[12px] text-faint">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-3">
                  <Badge tone={statusTone[m.status]}>{STATUS_LABEL[m.status]}</Badge>
                </td>
                <td className="py-3.5 pr-3 font-mono-num text-[12.5px]">
                  {m.status === "CANCELLED"
                    ? "—"
                    : m.next_billing_at
                    ? new Date(m.next_billing_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="py-3.5 pr-3">
                  <MemberRowEditor id={m.id} plan={m.plan} status={m.status} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-dim">
                  {q ? "No subscribers match your search." : "No subscribers yet — checkout a plan from the landing page to create one, or add one manually above."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex gap-3 rounded-xl border border-edge bg-white/[0.02] p-4 text-[12.5px] leading-relaxed text-dim">
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-accent3" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          Once a payment processor is connected, plan and status updates from real payments/cancellations
          happen automatically via webhook — you only need the controls above for manual overrides (comp
          accounts, bank-transfer customers, support fixes).
        </div>
      </div>
    </div>
  );
}
