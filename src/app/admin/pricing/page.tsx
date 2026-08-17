import { getPlanPrices } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { PricingEditor } from "@/components/admin/PricingEditor";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const prices = await getPlanPrices();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[23px]">Pricing</h1>
        <div className="mt-0.5 text-[13.5px] text-faint">
          Change what&apos;s shown on the site and charged to new signups — takes effect immediately, no
          deploy needed.
        </div>
      </div>

      <Card className="mb-5 p-5.5">
        <PricingEditor prices={prices} />
      </Card>

      <div className="flex gap-3 rounded-xl border border-edge bg-white/[0.02] p-4 text-[12.5px] leading-relaxed text-dim">
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-accent3" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          These numbers control what&apos;s displayed on the landing page, checkout and dashboard. Once a
          real payment processor (Stripe, Paddle, etc.) is connected, make sure the amount you set here
          matches the Price/Product configured on their side — the processor is what actually charges the
          card, this is just the number shown to customers. Existing subscribers keep the price they signed
          up at; changing this only affects new signups and the displayed price going forward.
        </div>
      </div>
    </div>
  );
}
