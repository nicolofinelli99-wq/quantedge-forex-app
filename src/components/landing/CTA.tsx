import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="rounded-3xl border border-edge2 bg-gradient-to-br from-accent/10 to-accent2/10 px-10 py-16 text-center">
            <h2 className="mb-3.5 text-[clamp(26px,4vw,38px)]">Ready to trade with an edge?</h2>
            <p className="mb-7 text-dim">Join the desk and read today&apos;s strategy the moment you sign up.</p>
            <LinkButton href="#pricing">View Plans</LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
