import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata = { title: "Terms of Use — BE4 Trading" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="August 2026">
      <p>
        These Terms of Use (&quot;Terms&quot;) govern access to and use of the website and services
        operated under the brand <b className="text-ink">BE4 Trading</b> (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;), a service of{" "}
        <b className="text-ink">Gritti C&amp;C Shpk</b>, a company registered in Albania (NIPT
        M61614111O), with registered address at Rruga Beqir Luga, Pasari i Ri, Tirana, Albania. By
        creating an account, subscribing to a plan, or otherwise using the service, you agree to
        these Terms. If you do not agree, do not use the service.
      </p>

      <LegalSection title="1. What we offer">
        <p>
          BE4 Trading provides subscription access to written market research, trade setups, and
          educational content covering the forex, commodities, and related markets. Content is
          published to a member dashboard on a recurring basis and is intended for informational and
          educational purposes only.
        </p>
        <p>
          <b className="text-ink">We are not a broker, investment adviser, or licensed financial
          institution.</b> Nothing published through the service constitutes personalized financial,
          investment, legal, or tax advice, and no content should be construed as a recommendation to
          buy, sell, or hold any financial instrument. You are solely responsible for your own trading
          and investment decisions.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and accounts">
        <p>
          You must be at least 18 years old and legally able to enter into a binding contract in your
          jurisdiction to use the service. You are responsible for maintaining the confidentiality of
          your account credentials and for all activity under your account. Notify us immediately of
          any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="3. Subscriptions and billing">
        <p>
          Plans are billed on a recurring basis (monthly or yearly, as selected at checkout) and
          automatically renew until cancelled. Payment processing is handled by our payment provider
          (currently Paddle.com Market Ltd, acting as our reseller and merchant of record), whose own
          terms also apply to your payment. Prices are shown in USD and may be updated from time to
          time; changes apply to future billing cycles, not to a cycle already paid for.
        </p>
        <p>
          You may cancel your subscription at any time from your dashboard. Cancellation stops future
          renewals; you retain access until the end of the billing period already paid for. See our{" "}
          <a href="/refund-policy" className="text-accent hover:underline">Refund Policy</a> for
          details on refunds.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>
          You agree not to: share your account or republish, resell, or redistribute paid content
          outside your own use; scrape, copy, or systematically extract content from the service;
          use the service for any unlawful purpose; or attempt to interfere with the security or
          proper functioning of the service.
        </p>
      </LegalSection>

      <LegalSection title="5. Intellectual property">
        <p>
          All content published through the service — including strategy write-ups, reports, and
          site design — is owned by or licensed to Gritti C&amp;C Shpk and is protected by
          intellectual property law. Your subscription grants a limited, non-transferable, personal
          license to view this content for your own use — it does not transfer ownership of any
          content to you.
        </p>
      </LegalSection>

      <LegalSection title="6. Risk disclosure">
        <p>
          Trading foreign exchange and related instruments on margin carries a high level of risk and
          may not be suitable for all investors. Past performance, including backtested or simulated
          results, is not indicative of future results. See our full{" "}
          <a href="/risk-disclosure" className="text-accent hover:underline">Risk Disclosure</a> page.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers and limitation of liability">
        <p>
          The service is provided &quot;as is&quot; without warranties of any kind, express or
          implied. To the maximum extent permitted by law, Gritti C&amp;C Shpk shall not be liable
          for any indirect, incidental, or consequential damages, including trading losses, arising
          from your use of the service or reliance on any content published through it.
        </p>
      </LegalSection>

      <LegalSection title="8. Termination">
        <p>
          We may suspend or terminate access to the service for breach of these Terms, non-payment,
          or misuse. You may stop using the service and cancel your subscription at any time.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will be reflected by an
          updated &quot;Last updated&quot; date on this page. Continued use of the service after a
          change constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing law">
        <p>
          These Terms are governed by the laws of the Republic of Albania, without regard to
          conflict-of-law principles, unless otherwise required by applicable local consumer
          protection law in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Gritti C&amp;C Shpk — Rruga Beqir Luga, Pasari i Ri, Tirana, Albania — NIPT M61614111O.
          <br />
          Email: <a href="mailto:support@be4trading.com" className="text-accent hover:underline">support@be4trading.com</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
