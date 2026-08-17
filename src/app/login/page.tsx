import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ParticleBackground } from "@/components/ParticleBackground";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const demoMode = process.env.DEMO_MODE === "true";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <ParticleBackground />
      <Card className="relative z-10 w-full max-w-md px-8 py-10 text-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-6 w-auto" />
        </Link>
        <h1 className="mb-2 text-2xl">Sign in to your dashboard</h1>
        <p className="mb-8 text-[13.5px] text-dim">Welcome back — enter your details below.</p>

        <LoginForm />

        <p className="mt-6 text-[12px] text-faint">
          Don&apos;t have an account yet?{" "}
          <Link href="/#pricing" className="text-accent3 hover:underline">Choose a plan</Link>
        </p>

        {demoMode && (
          <div className="mt-8 border-t border-dashed border-warn/40 pt-6">
            <p className="mb-3 text-[10.5px] font-bold uppercase tracking-wide text-warn">Demo mode</p>
            <form action="/api/auth/demo-login" method="POST">
              <input type="hidden" name="role" value="admin" />
              <button className="w-full rounded-xl border border-edge2 bg-white/[0.02] px-6 py-3 text-[13.5px] font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-white/[0.06]">
                Continue as Desk Admin (demo)
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
