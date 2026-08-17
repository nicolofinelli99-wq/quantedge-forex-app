"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ParticleBackground } from "@/components/ParticleBackground";

const inputClass =
  "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    setDone(true);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <ParticleBackground />
      <Card className="relative z-10 w-full max-w-md px-8 py-10 text-center">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-6 w-auto" />
        </Link>

        {done ? (
          <>
            <h1 className="mb-2 text-2xl">Check your email</h1>
            <p className="mb-8 text-[13.5px] text-dim">
              If an account exists for <b className="text-ink">{email}</b>, a password reset link is on its way.
              The link expires in 1 hour.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-2xl">Reset your password</h1>
            <p className="mb-8 text-[13.5px] text-dim">
              Enter the email on your account and we&apos;ll send you a link to set a new password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="mb-1.5 block text-[12.5px] text-faint">Email</label>
                <input
                  required
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-[12px] text-faint">
          <Link href="/login" className="text-accent3 hover:underline">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}
