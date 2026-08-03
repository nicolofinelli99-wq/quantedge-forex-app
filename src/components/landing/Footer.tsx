export function Footer() {
  return (
    <footer className="border-t border-edge px-6 pb-8 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-head text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent3 text-sm font-extrabold text-[#04150f]">
                Q
              </span>
              QuantEdge
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-faint">
              Written forex trading strategy subscriptions for traders worldwide. Placeholder brand
              name &amp; copy — swap in your real name, logo and voice.
            </p>
          </div>
          <div>
            <h5 className="mb-4 text-xs uppercase tracking-wide text-faint">Product</h5>
            <ul className="space-y-2.5 text-[14px] text-dim">
              <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
              <li><a href="#compare" className="hover:text-ink">Compare plans</a></li>
              <li><a href="#sample" className="hover:text-ink">Sample strategy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs uppercase tracking-wide text-faint">Company</h5>
            <ul className="space-y-2.5 text-[14px] text-dim">
              <li><a href="#" className="hover:text-ink">About</a></li>
              <li><a href="#" className="hover:text-ink">Contact</a></li>
              <li><a href="#" className="hover:text-ink">Telegram</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs uppercase tracking-wide text-faint">Legal</h5>
            <ul className="space-y-2.5 text-[14px] text-dim">
              <li><a href="#" className="hover:text-ink">Terms of use</a></li>
              <li><a href="#" className="hover:text-ink">Privacy policy</a></li>
              <li><a href="#" className="hover:text-ink">Refund policy</a></li>
              <li><a href="#" className="hover:text-ink">Risk disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="mb-7 rounded-xl border border-edge bg-white/[0.03] px-5 py-4.5 text-xs leading-relaxed text-faint">
          <b className="text-dim">Disclaimer (placeholder — review with a compliance advisor):</b> QuantEdge
          provides educational market commentary and is not a substitute for personalized, regulated
          financial advice. Forex trading is leveraged, carries a high level of risk, and is not
          suitable for all investors. Past performance and any illustrative results shown are not
          indicative of future returns.
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge pt-6 text-[12.5px] text-faint">
          <span>© 2026 QuantEdge. All rights reserved. (Placeholder)</span>
          <span>Made for traders, everywhere 🌍</span>
        </div>
      </div>
    </footer>
  );
}
