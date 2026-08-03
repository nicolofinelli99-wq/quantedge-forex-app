"use client";
import { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const faqs = [
  {
    q: "How will I receive the strategies?",
    a: "Every strategy is a written note posted to your private dashboard the moment it's published, with an optional alert on Telegram or WhatsApp depending on your plan.",
  },
  {
    q: "What payment methods are supported?",
    a: "Credit/debit cards, PayPal and major cryptocurrencies, processed securely through Stripe.",
  },
  {
    q: "What happens if a payment fails or I don't renew?",
    a: "Dashboard access is automatically paused until payment succeeds. Your history and settings are kept, and access resumes within minutes of a successful charge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — no lock-in. Cancel from your dashboard and keep access until the end of your current billing cycle.",
  },
  {
    q: "Is this regulated financial advice?",
    a: "Placeholder — to be finalized with a compliance review. Content should be framed as educational/informational written analysis, not personalized investment advice; forex trading is leveraged, carries a high level of risk, and may not be suitable for all investors.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Questions
          </div>
          <h2 className="text-[clamp(28px,4vw,42px)]">Frequently asked questions</h2>
        </Reveal>
        <Reveal>
          <Card className="px-6.5">
            {faqs.map((item, i) => (
              <div key={item.q} className="border-b border-edge last:border-none">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between py-5.5 text-left text-[15px] font-semibold"
                >
                  {item.q}
                  <svg
                    viewBox="0 0 24 24"
                    className={clsx("h-[18px] w-[18px] flex-shrink-0 text-faint transition-transform", open === i && "rotate-45")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === i ? 220 : 0 }}
                >
                  <p className="pb-5.5 text-[14px] leading-relaxed text-dim">{item.a}</p>
                </div>
              </div>
            ))}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
