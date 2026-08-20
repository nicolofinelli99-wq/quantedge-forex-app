"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { BACKTEST_STRATEGIES, BACKTEST_YEARS, averageR } from "@/lib/backtest";

function formatUSD(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

export function ROICalculator() {
  const [deposit, setDeposit] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");

  const depositNum = Math.max(0, Number(deposit) || 0);
  const riskNum = Math.max(0, Number(riskPct) || 0);
  const riskUnit = depositNum * (riskNum / 100); // dollar value of 1R

  const rows = useMemo(() => {
    return BACKTEST_YEARS.map((year) => ({
      year,
      values: BACKTEST_STRATEGIES.map((s) => {
        const r = s.yearlyR.find((y) => y.year === year)?.r ?? 0;
        return r * riskUnit;
      }),
    }));
  }, [riskUnit]);

  const averages = BACKTEST_STRATEGIES.map((s) => averageR(s) * riskUnit);
  const drawdowns = BACKTEST_STRATEGIES.map((s) => s.maxDrawdownR * riskUnit);

  const inputClass =
    "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent hover:border-white/25 font-mono-num";

  return (
    <section id="calculator" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Backtested results
          </div>
          <h2 className="mb-3 text-[clamp(28px,4vw,42px)]">See what the numbers mean for you</h2>
          <p className="text-dim">
            5.5 years of backtested results, translated into real dollars based on your deposit and risk per
            trade.
          </p>
        </Reveal>

        <Reveal>
          <Card className="mb-6 grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-dim">Starting deposit (USD)</label>
              <div className="flex items-center gap-2">
                <span className="text-dim">$</span>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="10000"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-dim">Risk per trade (%)</label>
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step={0.1}
                  value={riskPct}
                  onChange={(e) => setRiskPct(e.target.value)}
                  placeholder="1"
                />
                <span className="text-dim">%</span>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="overflow-x-auto p-5.5">
            <table className="w-full min-w-[560px] border-collapse text-[13.8px]">
              <thead>
                <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wide text-faint">
                  <th className="py-2.5 pr-3">Year</th>
                  {BACKTEST_STRATEGIES.map((s) => (
                    <th key={s.key} className="py-2.5 pr-3 text-right">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.year} className="border-b border-edge">
                    <td className="py-3 pr-3 text-dim">{row.year}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3 pr-3 text-right font-mono-num text-accent">{formatUSD(v)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-edge bg-white/[0.02] font-semibold">
                  <td className="py-3 pr-3">Average / year</td>
                  {averages.map((v, i) => (
                    <td key={i} className="py-3 pr-3 text-right font-mono-num">{formatUSD(v)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-3 text-dim">Max drawdown</td>
                  {drawdowns.map((v, i) => (
                    <td key={i} className="py-3 pr-3 text-right font-mono-num text-danger">{formatUSD(v)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Card>
        </Reveal>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-faint">
          Figures are calculated from backtested historical results (2021–2025) at your chosen risk per trade,
          assuming a fixed risk amount based on your starting deposit. Past and backtested performance is not
          indicative of future results — trading forex carries risk of loss.
        </p>
      </div>
    </section>
  );
}
