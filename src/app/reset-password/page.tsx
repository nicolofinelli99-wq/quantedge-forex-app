"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ParticleBackground } from "@/components/ParticleBackground";

const inputClass =
  "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <ParticleBackground />
      <Card className="relative z-10 w-full max-w-md px-8 py-10 text-center">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-head text-lg font-bold">
          <img src="/be4-mark.png" alt="" className="h-8 w-auto" />
          <img src="/be4-wordmark.png" alt="BE4 Trading" className="h-6 w-auto" />
        </Link>

        {!token ? (
          <>
            <h1 className="mb-2 text-2xl">Invalid link</h1>
            <p className="mb-6 text-[13.5px] text-dim">
              This password reset link is missing its token. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f]"
            >
              Request new link
            </Link>
          </>
        ) : done ? (
          <>
            <h1 className="mb-2 text-2xl">Password updated</h1>
            <p className="text-[13.5px] text-dim">Taking you to your dashboard…</p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-2xl">Choose a new password</h1>
            <p className="mb-8 text-[13.5px] text-dim">This link can only be used once.</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="mb-1.5 block text-[12.5px] text-faint">New password</label>
                <input
                  required
                  type="password"
                  minLength={8}
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              {error && <p className="text-[12.5px] text-danger">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
