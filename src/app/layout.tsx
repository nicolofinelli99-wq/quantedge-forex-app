import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantEdge — Forex Strategy Subscriptions",
  description:
    "Written forex trading strategies across major and minor currency pairs, delivered to your private dashboard.",
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
