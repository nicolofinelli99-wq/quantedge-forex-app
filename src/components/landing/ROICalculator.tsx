"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { BACKTEST_STRATEGIES, BACKTEST_YEARS, averageR } from "@/lib/backtest";

function formatUSD(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

const DEPOSIT_PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];

const PLAN_STYLE: Record<string, { badge: string; accent: string }> = {
  "Strategy A": { badge: "text-accent3 bg-accent3/10 border-accent3/25", accent: "text-accent3" },
  "Strategy B": { badge: "text-accent bg-accent/10 border-accent/25", accent: "text-accent" },
  "Strategy C": { badge: "text-[#ecd9ff] bg-accent2/15 border-accent2/30", accent: "text-[#e2d3ff]" },
};

export function ROICalculator() {
  const [deposit, setDeposit] = useState("10000");
  const [riskPct, setRiskPct] = useState(1);

  const depositNum = Math.max(0, Number(deposit) || 0);
  const riskUnit = depositNum * (riskPct / 100); // dollar value of 1R

  const perStrategy = useMemo(() => {
    return BACKTEST_STRATEGIES.map((s) => {
      const byYear = BACKTEST_YEARS.map((year) => {
        const r = s.yearlyR.find((y) => y.year === year)?.r ?? 0;
        return { year, amount: r * riskUnit };
      });
      return {
        strategy: s,
        byYear,
        average: averageR(s) * riskUnit,
        drawdown: s.maxDrawdownR * riskUnit,
      };
    });
  }, [riskUnit]);

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
            5.5 years of backtested results (2021–2025), translated into real dollars based on your deposit
            and risk per trade.
          </p>
        </Reveal>

        <Reveal>
          <Card className="mb-8 grid gap-7 p-7 sm:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-[12.5px] font-medium text-dim">Starting deposit (USD)</label>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg text-dim">$</span>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="10000"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEPOSIT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDeposit(String(p))}
                    className={clsx(
                      "rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                      Number(deposit) === p
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-edge2 text-faint hover:border-white/25 hover:text-dim"
                    )}
                  >
                    ${p.toLocaleString("en-US")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <label className="text-[12.5px] font-medium text-dim">Risk per trade</label>
                <span className="font-mono-num text-lg font-bold text-accent">{riskPct.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.25}
                value={riskPct}
                onChange={(e) => setRiskPct(Number(e.target.value))}
                className="w-full accent-[#d66aee]"
              />
              <div className="mt-2 flex justify-between text-[11px] text-faint">
                <span>0.25% (conservative)</span>
                <span>3% (aggressive)</span>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-faint">
                1R = <span className="font-mono-num text-dim">{formatUSD(riskUnit)}</span> — the dollar amount
                risked on a single trade at this deposit and risk level.
              </p>
            </div>
          </Card>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {perStrategy.map(({ strategy, byYear, average, drawdown }, i) => {
            const style = PLAN_STYLE[strategy.name] ?? PLAN_STYLE["Strategy A"];
            return (
              <Reveal key={strategy.key} delay={i * 0.08}>
                <Card className="relative flex h-full flex-col p-6">
                  <span className={clsx("mb-4 inline-flex w-fit items-center rounded-full border px-3 py-1 text-[12px] font-semibold", style.badge)}>
                    {strategy.name}
                  </span>

                  <div className="mb-1 font-mono-num text-[32px] font-bold leading-none">{formatUSD(average)}</div>
                  <div className="mb-5 text-[12.5px] text-faint">average per year, backtested</div>

                  <div className="mb-5 space-y-1.5 border-t border-edge pt-4">
                    {byYear.map(({ year, amount }) => (
                      <div key={year} className="flex items-center justify-between text-[13px]">
                        <span className="text-dim">{year}</span>
                        <span className={clsx("font-mono-num", style.accent)}>{formatUSD(amount)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between rounded-[10px] border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-[12.5px]">
                    <span className="text-dim">Max drawdown</span>
                    <span className="font-mono-num font-semibold text-danger">{formatUSD(drawdown)}</span>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-faint">
          Figures are calculated from backtested historical results (2021–2025) at your chosen risk per trade,
          assuming a fixed risk amount based on your starting deposit. Past and backtested performance is not
          indicative of future results — trading forex carries risk of loss.
        </p>
      </div>
    </section>
  );
}
