import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { n: "01", title: "Choose your plan", body: "Basic, Premium or Ultimate — pick the depth of coverage that fits how you trade." },
  { n: "02", title: "Pay securely", body: "Checkout in seconds. Auto-renews on your billing cycle, cancel anytime." },
  { n: "03", title: "Instant dashboard access", body: "Your private members' area unlocks immediately after checkout." },
  { n: "04", title: "Read weekly strategies", body: "New write-ups appear on your feed the moment the desk publishes them, complete with the historical track record behind each setup." },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Simple by design
          </div>
          <h2 className="mb-3 text-[clamp(28px,4vw,42px)]">From sign-up to your first strategy in minutes</h2>
          <p className="text-dim">No app download, no friction — everything runs in your browser dashboard.</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <Card className="h-full px-6 py-7">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-accent2 to-accent3 font-mono text-sm font-bold text-[#0a0518]">
                  {s.n}
                </div>
                <h4 className="mb-2 text-[16px]">{s.title}</h4>
                <p className="text-[13.5px] text-dim">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
