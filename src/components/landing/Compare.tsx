import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const check = (
  <svg viewBox="0 0 24 24" className="mx-auto h-[18px] w-[18px] text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const dash = <span className="text-faint">—</span>;

const rows: [string, React.ReactNode, React.ReactNode, React.ReactNode][] = [
  ["Weekly COT Report", check, check, check],
  ["Monthly macro report", check, check, check],
  ["Swing analysis & key levels", check, check, check],
  ["Long-term position updates", check, check, check],
  ["Ready-to-use strategies", dash, check, check],
  ["Backtest history", dash, check, check],
  ["Video & written breakdowns", dash, check, check],
  ["Support", "Community", "Priority WhatsApp", "Priority WhatsApp"],
];

export function Compare() {
  return (
    <section id="compare" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Side by side
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)]">Compare every feature</h2>
        </Reveal>
        <Reveal>
          <Card className="overflow-x-auto px-6 py-2">
            <table className="w-full border-collapse text-[13.8px]">
              <thead>
                <tr>
                  <th className="px-4 py-3.5 text-left font-head text-[14px]">Feature</th>
                  <th className="px-4 py-3.5 font-head text-[14px]">Research</th>
                  <th className="px-4 py-3.5 font-head text-[14px]">Strategy</th>
                  <th className="px-4 py-3.5 font-head text-[14px]">Complete</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, b, p, u]) => (
                  <tr key={label} className="border-t border-edge hover:bg-white/[0.02]">
                    <td className="px-4 py-3.5 text-dim">{label}</td>
                    <td className="px-4 py-3.5 text-center">{b}</td>
                    <td className="px-4 py-3.5 text-center">{p}</td>
                    <td className="px-4 py-3.5 text-center">{u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
