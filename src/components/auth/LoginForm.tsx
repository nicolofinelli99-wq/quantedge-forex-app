"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full rounded-[10px] border border-edge2 bg-bg2 px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent hover:border-white/25";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
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
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[12.5px] text-faint">Password</label>
          <Link href="/forgot-password" className="text-[12px] text-accent3 hover:underline">Forgot?</Link>
        </div>
        <input
          required
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      {error && <p className="text-[12.5px] text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
