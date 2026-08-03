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
        accent: "#00e5a0",
        accent2: "#7b6cff",
        accent3: "#00c2ff",
        danger: "#ff4d6d",
        warn: "#ffb020",
      },
      fontFamily: {
        head: ["var(--font-head)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grad-1": "linear-gradient(135deg,#00e5a0,#00c2ff)",
        "grad-2": "linear-gradient(135deg,#7b6cff,#00c2ff)",
      },
    },
  },
  plugins: [],
};
export default config;
