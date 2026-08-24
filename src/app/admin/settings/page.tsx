import { Card } from "@/components/ui/Card";

const notes = [
  {
    title: "Pricing",
    body: "Editable from the Pricing tab — no code changes or redeploys needed. Update it there, not here.",
  },
  {
    title: "Payment gateway",
    body: "Paddle is the primary processor (Stripe isn't available for this client's bank country). Once PADDLE_CLIENT_TOKEN, PADDLE_WEBHOOK_SECRET_KEY, and the six PADDLE_PRICE_* price IDs are set in Vercel, checkout and billing management go live automatically — the Stripe integration is still in the codebase as a fallback and can be re-enabled by setting the Stripe env vars instead.",
  },
  {
    title: "Access control",
    body: "Each strategy is tagged by minimum plan (Research / Strategy / Complete). A member's dashboard only renders content at or below their active plan — enforced server-side in the database query, not just visually.",
  },
  {
    title: "Grace period",
    body: "Not yet implemented — a failed payment currently suspends access immediately via webhook. A grace window (e.g. 24h with retries) can be added once a processor is connected, if wanted.",
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
