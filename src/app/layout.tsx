import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BE4 Trading — Forex Strategy Subscriptions",
  description:
    "Written swing forex strategies across major and minor currency pairs — full reasoning, key levels and risk plan, backed by manual backtest history and delivered straight to your private dashboard.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BE4 Trading — Data. Strategy. Edge.",
    description:
      "Written swing forex strategies across major and minor currency pairs, delivered straight to your private dashboard.",
    images: ["/be4-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink font-body antialiased">{children}</body>
    </html>
  );
}
