import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-edge bg-[#060910]/70 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          BE4 Trading
        </Link>
        <div className="hidden gap-8 text-[14.5px] font-medium text-dim md:flex">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <a href="#compare" className="hover:text-ink">Compare plans</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
        </div>
        <div className="flex items-center gap-3.5">
          <LinkButton href="/login" variant="ghost" size="sm">Sign in</LinkButton>
          <LinkButton href="#pricing" size="sm">Get Started</LinkButton>
        </div>
      </div>
    </nav>
  );
}
