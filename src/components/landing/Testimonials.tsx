import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  { initials: "RS", name: "Ryan S.", loc: "London" },
  { initials: "PK", name: "Priya K.", loc: "Dubai" },
  { initials: "AM", name: "Arjun M.", loc: "Singapore" },
];

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Members say
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)]">Trusted by traders around the world</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <Card className="h-full px-6.5 py-6.5">
                <p className="mb-4.5 text-[14.5px] italic text-dim">
                  &ldquo;Sample placeholder testimonial — swap for a real, verifiable member quote before launch.&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent3 text-[13px] font-bold text-[#0a0518]">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold">{t.name}</div>
                    <div className="text-[11.5px] text-faint">{t.loc}</div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-xl text-center text-[11.5px] text-faint">
          Illustrative testimonials only. Real testimonials and any performance claims should follow
          applicable financial-promotion and advertising regulations in your target markets.
        </p>
      </div>
    </section>
  );
}
