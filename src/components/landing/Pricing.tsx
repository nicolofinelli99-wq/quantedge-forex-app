"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { PLAN_PRICE } from "@/lib/plans";

const check = (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const plans = [
  {
    key: "BASIC" as const,
    name: "Basic",
    desc: "For traders who want daily direction without the noise.",
    features: [
      "Daily market outlook (London & NY sessions)",
      "2–3 written currency pair strategies / week",
      "Full reasoning, key levels & risk plan on every strategy",
      "Private Telegram community",
      "Weekly performance recap",
    ],
    featured: false,
  },
  {
    key: "PREMIUM" as const,
    name: "Premium",
    desc: "Full intraday + metals coverage for active traders.",
    features: [
      "Everything in Basic, plus:",
      "In-depth intraday strategy write-ups",
      "Gold & advanced pair strategy write-ups",
      "Live chart annotations & rationale",
      "Priority WhatsApp support",
      "Monthly live strategy Q&A",
    ],
    featured: true,
  },
  {
    key: "ULTIMATE" as const,
    name: "Ultimate",
    desc: "Direct access to the desk for serious, high-conviction trading.",
    features: [
      "Everything in Premium, plus:",
      "1-on-1 monthly strategy call",
      "Advanced multi-pair & metals strategies",
      "Personal trading plan review",
      "Early access to new strategies",
      "Direct WhatsApp line to the desk",
    ],
    featured: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Membership plans
          </div>
          <h2 className="mb-3 text-[clamp(28px,4vw,42px)]">Simple pricing, cancel anytime</h2>
          <p className="text-dim">All prices in USD. Upgrade, downgrade or cancel from your dashboard whenever you like.</p>
        </Reveal>

        <Reveal className="mb-12 flex items-center justify-center gap-3">
          <span className="text-[13.5px] text-dim">Monthly</span>
          <button
            onClick={() => setYearly((v) => !v)}
            className={clsx(
              "relative h-7 w-13 rounded-full border transition-colors",
              yearly ? "border-accent/40 bg-accent/20" : "border-edge2 bg-surface2"
            )}
            style={{ width: 52, height: 28 }}
          >
            <span
              className={clsx(
                "absolute top-0.5 h-[22px] w-[22px] rounded-full bg-gradient-to-br from-accent to-accent3 transition-all",
                yearly ? "left-[26px]" : "left-0.5"
              )}
            />
          </button>
          <span className="text-[13.5px] text-dim">Yearly</span>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">Save ~17%</span>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const price = PLAN_PRICE[plan.key];
            const amount = yearly ? price.yearly : price.monthly;
            return (
              <Reveal key={plan.key} delay={i * 0.08}>
                <Card
                  className={clsx(
                    "relative flex h-full flex-col px-7 py-9",
                    plan.featured &&
                      "border-accent/40 bg-gradient-to-b from-accent/[0.06] to-surface shadow-[0_30px_60px_-20px_rgba(0,229,160,0.25)] md:scale-[1.04]"
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent to-accent3 px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#04150f]">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="mb-1.5 font-head text-xl">{plan.name}</div>
                  <div className="mb-5 text-[13px] text-dim">{plan.desc}</div>
                  <div className="mb-1.5 flex items-baseline gap-1.5">
                    <span className="font-mono-num text-[38px] font-bold">${amount}</span>
                    <span className="text-[13.5px] text-faint">/ {yearly ? "year" : "month"}</span>
                  </div>
                  <div className="mb-6 text-xs text-faint">
                    {yearly ? `Billed $${price.yearly} / year` : " "}
                  </div>
                  <ul className="mb-7 flex-1 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 py-1 text-[13.8px] text-dim">
                        {check}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/checkout?plan=${plan.key}&cycle=${yearly ? "YEARLY" : "MONTHLY"}`}
                    className={clsx(
                      "inline-flex items-center justify-center rounded-xl px-6 py-3 text-[14.5px] font-semibold transition-all hover:-translate-y-0.5",
                      plan.featured
                        ? "bg-gradient-to-br from-accent to-accent3 text-[#04150f] shadow-[0_10px_30px_-8px_rgba(0,229,160,0.5)]"
                        : "border border-edge2 bg-white/[0.02] text-ink hover:bg-white/[0.06]"
                    )}
                  >
                    Choose {plan.name}
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
