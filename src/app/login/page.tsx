import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <ParticleBackground />
      <Card className="relative z-10 w-full max-w-md px-8 py-10 text-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          BE4 Trading
        </Link>
        <h1 className="mb-2 text-2xl">Sign in to your dashboard</h1>
        <p className="mb-8 text-[13.5px] text-dim">
          This prototype uses one-click demo logins backed by a real database — no password needed.
        </p>

        <form action="/api/auth/demo-login" method="POST" className="mb-3">
          <input type="hidden" name="role" value="client" />
          <button className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5">
            Continue as Demo Client (Premium)
          </button>
        </form>
        <form action="/api/auth/demo-login" method="POST" className="mb-8">
          <input type="hidden" name="role" value="admin" />
          <button className="w-full rounded-xl border border-edge2 bg-white/[0.02] px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-white/[0.06]">
            Continue as Desk Admin
          </button>
        </form>

        <p className="text-[12px] text-faint">
          Subscribed already? Check out a plan on the{" "}
          <Link href="/#pricing" className="text-accent3 hover:underline">landing page</Link> to
          create your own member record.
        </p>
      </Card>
    </div>
  );
}
