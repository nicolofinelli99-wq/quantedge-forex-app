import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getMemberById, getPlanPrices } from "@/lib/data";
import { getSessionMemberId } from "@/lib/session";
import { Plan, BillingCycle } from "@/lib/plans";
import { ContinueToPayment } from "@/components/checkout/ContinueToPayment";

function planLabel(plan: string): string {
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string; cycle?: string; cancelled?: string };
}) {
  const plan = (searchParams.plan as Plan) || "STRATEGY";
  const cycle = (searchParams.cycle as BillingCycle) || "MONTHLY";

  const memberId = getSessionMemberId();
  const member = await getMemberById(memberId);

  if (!member) {
    redirect(`/signup?plan=${plan}&cycle=${cycle}`);
  }

  const prices = await getPlanPrices();
  const price = prices[plan];
  const amount = cycle === "YEARLY" ? price.yearly : price.monthly;

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <Card className="w-full max-w-md px-9 py-10">
        <Link href="/#pricing" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-dim hover:text-ink">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to plans
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <img src="/be4-mark.png" alt="" className="h-11 w-11 rounded-xl border border-edge2 bg-surface2 p-2" />
          <div>
            <div className="text-[17px] font-bold">{planLabel(plan)} Plan</div>
            <div className="text-[12.5px] text-faint">Billed {cycle === "YEARLY" ? "yearly" : "monthly"}</div>
          </div>
        </div>

        <div className="mb-6 flex justify-between border-b border-dashed border-edge py-2.5 text-[14px] text-dim">
          <span>Subscription price</span>
          <span className="font-mono-num">${amount.toLocaleString("en-US")}.00</span>
        </div>

        {searchParams.cancelled && (
          <p className="mb-4 rounded-lg border border-warn/30 bg-warn/10 px-3.5 py-2.5 text-[12.5px] text-warn">
            Checkout was cancelled — no charge was made. Ready when you are.
          </p>
        )}

        <ContinueToPayment plan={plan} cycle={cycle} />

        <p className="mt-5 text-center text-[11.5px] text-faint">
          You&apos;ll be redirected to Stripe&apos;s secure hosted checkout. Auto-renews every billing
          cycle — cancel anytime from your dashboard.
        </p>
      </Card>
    </div>
  );
}
