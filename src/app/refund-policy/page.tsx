import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata = { title: "Refund Policy — BE4 Trading" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updated="August 2026">
      <p>
        This Refund Policy applies to subscriptions purchased through BE4 Trading, a service of{" "}
        <b className="text-ink">Gritti C&amp;C Shpk</b> (NIPT M61614111O, Rruga Beqir Luga, Pasari i
        Ri, Tirana, Albania).
      </p>

      <LegalSection title="1. Subscription nature">
        <p>
          Plans are recurring subscriptions billed monthly or yearly. By subscribing, you authorize
          automatic renewal at the end of each billing period until you cancel. Cancelling stops
          future renewals but does not automatically refund the period already paid for — you keep
          access until the end of that period.
        </p>
      </LegalSection>

      <LegalSection title="2. Requesting a refund">
        <p>
          Because subscriptions grant immediate access to published research and strategy content,
          refunds are not guaranteed. That said, we review refund requests on a case-by-case basis,
          including for: accidental duplicate charges, technical issues that prevented you from
          accessing the service, or a request made shortly after your first payment.
        </p>
        <p>
          To request a refund, contact us at{" "}
          <a href="mailto:support@be4trading.com" className="text-accent hover:underline">support@be4trading.com</a>{" "}
          with your account email and the reason for your request. We aim to respond within 5
          business days.
        </p>
      </LegalSection>

      <LegalSection title="3. How refunds are processed">
        <p>
          Payments are processed by Paddle.com Market Ltd, our payment provider and merchant of
          record. Approved refunds are issued by Paddle to your original payment method and may take
          several business days to appear on your statement, depending on your bank or card issuer.
        </p>
      </LegalSection>

      <LegalSection title="4. Cancellation is not a refund request">
        <p>
          Cancelling your subscription from your dashboard only stops future billing — it does not by
          itself trigger a refund for the current period. If you also want a refund for the current
          period, contact us separately using the details above.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact">
        <p>
          Gritti C&amp;C Shpk — Rruga Beqir Luga, Pasari i Ri, Tirana, Albania — NIPT M61614111O.
          <br />
          Email: <a href="mailto:support@be4trading.com" className="text-accent hover:underline">support@be4trading.com</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
