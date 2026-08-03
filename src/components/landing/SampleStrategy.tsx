import { getPublicSampleStrategy } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

export async function SampleStrategy() {
  const strategy = await getPublicSampleStrategy();

  return (
    <section id="sample" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Today&apos;s desk
          </div>
          <h2 className="mb-3 text-[clamp(28px,4vw,42px)]">A peek at what members read</h2>
          <p className="text-dim">Full written reasoning, key levels and risk plan — unlocked instantly once you subscribe.</p>
        </Reveal>
        <Reveal className="mx-auto max-w-xl">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none p-8 blur-[6px] opacity-55">
              {strategy ? (
                <>
                  <Badge tone="purple" className="mb-3">{strategy.instrument ?? "Majors"} · {strategy.type}</Badge>
                  <div className="mb-2 font-head text-lg font-semibold">{strategy.title}</div>
                  <p className="text-[14px] leading-relaxed text-dim">{strategy.excerpt}</p>
                </>
              ) : (
                <>
                  <Badge tone="purple" className="mb-3">Majors · Intraday</Badge>
                  <div className="mb-2 font-head text-lg font-semibold">EUR/USD — Fading the London Open Spike</div>
                  <p className="text-[14px] leading-relaxed text-dim">
                    Price tends to overextend in the first 30 minutes of the London session before
                    reverting toward the Asian range. Here&apos;s how we&apos;re positioning around
                    today&apos;s open, with our confirmation triggers and invalidation level.
                  </p>
                </>
              )}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-gradient-to-b from-[#060910]/20 to-[#060910]/90 p-6 text-center">
              <div className="flex h-13 w-13 items-center justify-center rounded-full border border-edge2 bg-white/5 p-3.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="4" y="11" width="16" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-semibold">Unlock today&apos;s full strategy write-up</div>
              <LinkButton href="#pricing" size="sm">Choose a Plan</LinkButton>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
