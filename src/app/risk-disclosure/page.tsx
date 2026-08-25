import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata = { title: "Risk Disclosure — BE4 Trading" };

export default function RiskDisclosurePage() {
  return (
    <LegalPage title="Risk Disclosure" updated="August 2026">
      <p>
        This Risk Disclosure applies to all content published through BE4 Trading, a service of{" "}
        <b className="text-ink">Gritti C&amp;C Shpk</b> (NIPT M61614111O, Rruga Beqir Luga, Pasari i
        Ri, Tirana, Albania).
      </p>

      <LegalSection title="1. General risk warning">
        <p>
          Trading foreign exchange, commodities, and other margined financial instruments carries a
          high level of risk and may not be suitable for all investors. The high degree of leverage
          available in these markets can work against you as well as for you, and you can lose more
          than your initial deposit.
        </p>
      </LegalSection>

      <LegalSection title="2. Past and backtested performance">
        <p>
          Any performance figures shown, including backtested or simulated results (such as the
          calculator on our marketing pages), are historical and/or hypothetical in nature. Backtested
          results are prepared with the benefit of hindsight and do not represent actual trading —
          they do not account for factors such as slippage, liquidity constraints, or changing market
          conditions that a live account would experience. Past performance, whether real or
          backtested, is not indicative of future results.
        </p>
      </LegalSection>

      <LegalSection title="3. No financial advice">
        <p>
          BE4 Trading publishes market analysis and educational trading strategies for informational
          purposes only. We are not a broker, investment adviser, or licensed financial institution,
          and nothing published through the service constitutes personalized financial, investment,
          legal, or tax advice, or a recommendation to buy, sell, or hold any financial instrument.
          You are solely responsible for your own trading decisions, and should consider seeking
          independent financial advice before acting on any information published through the
          service.
        </p>
      </LegalSection>

      <LegalSection title="4. Your responsibility">
        <p>
          You should only trade with money you can afford to lose, and should fully understand the
          risks involved before trading. By using the service, you acknowledge that you are trading
          at your own risk and that Gritti C&amp;C Shpk is not liable for any trading losses incurred
          in connection with content published through the service.
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
