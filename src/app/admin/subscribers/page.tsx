import { listMembers } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RevokeButton } from "@/components/admin/RevokeButton";

export const dynamic = "force-dynamic";

const statusTone = { ACTIVE: "green", PAST_DUE: "red", CANCELLED: "grey" } as const;
const statusLabel = { ACTIVE: "Active", PAST_DUE: "Payment failed", CANCELLED: "Cancelled" } as const;

export default async function SubscribersPage() {
  const members = await listMembers();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Subscribers</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">{members.length} member{members.length === 1 ? "" : "s"} in the database.</div>
      </div>
      <Card className="overflow-x-auto p-5.5">
        <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wide text-faint">
              <th className="py-2.5 pr-3">Member</th>
              <th className="py-2.5 pr-3">Plan</th>
              <th className="py-2.5 pr-3">Status</th>
              <th className="py-2.5 pr-3">Next billing</th>
              <th className="py-2.5 pr-3">Actions</th>
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
                <td className="py-3.5 pr-3">{m.plan.charAt(0) + m.plan.slice(1).toLowerCase()}</td>
                <td className="py-3.5 pr-3">
                  <Badge tone={statusTone[m.status]}>{statusLabel[m.status]}</Badge>
                </td>
                <td className="py-3.5 pr-3 font-mono-num text-[12.5px]">
                  {m.status === "CANCELLED"
                    ? "—"
                    : m.next_billing_at
                    ? new Date(m.next_billing_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="py-3.5 pr-3">
                  <RevokeButton id={m.id} status={m.status} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-dim">No subscribers yet — checkout a plan from the landing page to create one.</td>
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
          In production, &quot;Payment failed&quot; status is set automatically by a Stripe webhook
          (<span className="font-mono-num">invoice.payment_failed</span> /{" "}
          <span className="font-mono-num">customer.subscription.updated</span>) — no manual action
          needed. The buttons here are for manual overrides and demoing the access-revocation flow.
        </div>
      </div>
    </div>
  );
}
