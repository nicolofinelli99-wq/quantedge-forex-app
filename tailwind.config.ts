import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#060910",
        bg2: "#0a0f1a",
        surface: "#101828",
        surface2: "#16213a",
        edge: "rgba(255,255,255,.13)",
        edge2: "rgba(255,255,255,.22)",
        ink: "#eef1f8",
        dim: "#94a0b8",
        faint: "#6c7690",
        accent: "#d66aee",
        accent2: "#ae6af3",
        accent3: "#886af9",
        danger: "#ff4d6d",
        warn: "#ffb020",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "8.5": "2.125rem",
        "13": "3.25rem",
      },
      fontFamily: {
        head: ["var(--font-head)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grad-1": "linear-gradient(135deg,#d66aee,#886af9)",
        "grad-2": "linear-gradient(135deg,#ae6af3,#5c6bff)",
      },
    },
  },
  plugins: [],
};
export default config;
