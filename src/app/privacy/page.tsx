import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy — BE4 Trading" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 2026">
      <p>
        This Privacy Policy explains how <b className="text-ink">Gritti C&amp;C Shpk</b> (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;), registered in Albania (NIPT M61614111O), with registered
        address at Rruga Beqir Luga, Pasari i Ri, Tirana, Albania, collects, uses, and protects your
        personal data when you use the BE4 Trading website and member dashboard (the
        &quot;service&quot;). We act as the data controller for the personal data described below.
      </p>

      <LegalSection title="1. Information we collect">
        <p>
          <b className="text-ink">Account information:</b> name, email address, and password (stored
          as a salted hash — we never store your plaintext password).
        </p>
        <p>
          <b className="text-ink">Subscription and billing information:</b> your selected plan,
          billing cycle, and subscription status. Payment card details are entered directly into our
          payment provider&apos;s secure checkout and are never transmitted to or stored on our
          servers — we only receive a customer/subscription reference and payment status.
        </p>
        <p>
          <b className="text-ink">Usage information:</b> basic technical data such as IP address and
          browser type, collected automatically for security and to keep the service running
          reliably.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <p>
          We use your information to: create and manage your account; process subscription payments
          and renewals; deliver strategy content to your dashboard; send transactional emails (welcome,
          payment receipts, payment-failed notices, password resets); respond to support requests; and
          maintain the security and integrity of the service.
        </p>
        <p>We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection title="3. Who we share data with">
        <p>
          We share limited data with third-party service providers strictly to operate the service:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li><b className="text-ink">Payment processing</b> — Paddle.com Market Ltd, our payment
            processor and merchant of record, handles checkout, billing, and payment data.</li>
          <li><b className="text-ink">Transactional email</b> — Resend, used to deliver account and
            billing emails.</li>
          <li><b className="text-ink">Hosting and infrastructure</b> — Vercel (application hosting)
            and our database provider, used to run the service and store account data.</li>
        </ul>
        <p>
          These providers process data on our behalf under their own privacy and security terms. We
          do not share your data with third parties for their own marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="4. Data retention">
        <p>
          We retain account and billing data for as long as your account is active, and for a
          reasonable period afterward to comply with legal, tax, and accounting obligations, resolve
          disputes, and enforce our agreements. You may request deletion of your account as described
          below.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          We use a minimal, session-based cookie to keep you signed in. We do not use third-party
          advertising or tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>
          Depending on your location, you may have the right to access, correct, export, or delete
          your personal data, or to object to certain processing. To exercise any of these rights,
          contact us at the email below and we will respond within a reasonable time.
        </p>
      </LegalSection>

      <LegalSection title="7. International transfers">
        <p>
          Our service providers may process data outside of Albania, including in the European Union
          and the United States. Where this occurs, we rely on our providers&apos; own contractual
          and security safeguards for cross-border data transfers.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be reflected by
          an updated &quot;Last updated&quot; date on this page.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          Gritti C&amp;C Shpk — Rruga Beqir Luga, Pasari i Ri, Tirana, Albania — NIPT M61614111O.
          <br />
          Email: <a href="mailto:support@be4trading.com" className="text-accent hover:underline">support@be4trading.com</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
