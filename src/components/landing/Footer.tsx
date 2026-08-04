export function Footer() {
  return (
    <footer className="border-t border-edge px-6 pb-8 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-head text-lg font-bold">
              <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
              BE4 Trading
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-faint">
              Strategies built for precision.
            </p>
          </div>
          <div>
            <h5 className="mb-4 text-xs uppercase tracking-wide text-faint">Product</h5>
            <ul className="space-y-2.5 text-[14px] text-dim">
              <li><a href="#pricing" className="hover:text-ink">Plans</a></li>
              <li><a href="#compare" className="hover:text-ink">Compare plans</a></li>
              <li><a href="#sample" className="hover:text-ink">Sample strategy</a></li>
              <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs uppercase tracking-wide text-faint">Company</h5>
            <ul className="space-y-2.5 text-[14px] text-dim">
              <li><a href="/login" className="hover:text-ink">Sign in</a></li>
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
          <b className="text-dim">Risk disclosure:</b> Trading foreign exchange on margin carries a
          high level of risk and may not be suitable for all investors. Past performance, including
          backtested results, is not indicative of future results. BE4 Trading publishes market
          analysis and educational trading strategies for informational purposes only — nothing here
          constitutes personalized financial advice.
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge pt-6 text-[12.5px] text-faint">
          <span>© 2026 BE4 Trading. All rights reserved.</span>
          <span>Made for traders, everywhere</span>
        </div>
      </div>
    </footer>
  );
}
