"use client";
import { motion } from "framer-motion";

const points = [0, 4, 3, 8, 12, 10, 17, 15, 22];

function toPath(vals: number[], w: number, h: number) {
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const step = w / (vals.length - 1);
  return vals
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function PerformanceChart() {
  const w = 320;
  const h = 120;
  const linePath = toPath(points, w, h);
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5a0" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#00e5a0" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="rgba(255,255,255,.06)" strokeWidth={1} />
      ))}
      <motion.path
        d={areaPath}
        fill="url(#perfFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#00e5a0"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}
