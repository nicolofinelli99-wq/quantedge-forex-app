import { Card } from "@/components/ui/Card";

const notes = [
  {
    title: "Payment gateway",
    body: "Stripe (placeholder — connect your real account). Subscriptions API handles recurring billing; webhooks auto-suspend or restore dashboard access on payment success/failure.",
  },
  {
    title: "Access control",
    body: "Each strategy is tagged by minimum plan (Basic / Premium / Ultimate). A member's dashboard only renders content at or below their active plan — enforced server-side in the database query, not just visually.",
  },
  {
    title: "Grace period",
    body: "Placeholder rule — e.g. a 24-hour grace window with retry attempts before full revocation, to reduce accidental lockouts from a single failed card charge.",
  },
  {
    title: "Database",
    body: "Postgres, queried directly with parameterized SQL — no ORM binary dependency, fast cold starts on serverless functions.",
  },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Settings</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">Platform architecture notes for this prototype.</div>
      </div>
      <Card className="divide-y divide-edge p-5.5">
        {notes.map((n) => (
          <div key={n.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent3" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-[13px] leading-relaxed text-dim">
              <b className="text-ink">{n.title}:</b> {n.body}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
