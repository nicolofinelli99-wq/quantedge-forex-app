"use client";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const stats = [
  { num: "12,400+", label: "Active subscribers*" },
  { num: "3", label: "Strategies published weekly*" },
  { num: "4.8/5", label: "Avg. member rating*" },
];

export function Hero() {
  return (
    <header className="relative overflow-hidden px-6 pb-24 pt-28 text-center">
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,106,238,0.18),transparent_60%)] blur-3xl" />
      <ParticleBackground />
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_#d66aee]" />
          Live for Forex Majors, Minors &amp; Metals · Desk updated weekly
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(38px,6vw,68px)]"
        >
          Trade the global forex market with{" "}
          <span className="grad-text">strategies built for precision.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-dim"
        >
          In-depth, written swing strategies across major and minor currency pairs — full
          reasoning, key levels and risk plan, backed by manual backtest history and delivered
          straight to your private dashboard the moment they&apos;re published.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap justify-center gap-3.5"
        >
          <LinkButton href="#pricing">
            View Plans
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LinkButton>
          <LinkButton href="#sample" variant="outline">
            Read a Sample Strategy
          </LinkButton>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 text-[12.5px] text-faint"
        >
          Active subscribers trading with an edge
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-3.5"
        >
          {stats.map((s) => (
            <Card key={s.label} className="min-w-[150px] px-6 py-4 text-left">
              <div className="font-mono-num text-2xl font-semibold">{s.num}</div>
              <div className="mt-0.5 text-[12.5px] text-faint">{s.label}</div>
            </Card>
          ))}
        </motion.div>
        <p className="mt-4 text-[11.5px] text-faint">
          *Placeholder metrics for demo — replace with real, verifiable figures before launch.
        </p>
      </div>
    </header>
  );
}
