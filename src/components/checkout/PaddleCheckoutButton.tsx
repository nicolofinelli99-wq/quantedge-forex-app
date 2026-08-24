"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plan, BillingCycle } from "@/lib/plans";

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: "sandbox" | "production") => void };
      Initialize: (opts: { token: string; eventCallback?: (event: { name: string }) => void }) => void;
      Checkout: { open: (opts: Record<string, unknown>) => void };
    };
  }
}

let paddleScriptPromise: Promise<void> | null = null;

function loadPaddleScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Paddle) return Promise.resolve();
  if (paddleScriptPromise) return paddleScriptPromise;
  paddleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paddle.js"));
    document.head.appendChild(script);
  });
  return paddleScriptPromise;
}

export function PaddleCheckoutButton({
  plan,
  cycle,
  priceId,
  clientToken,
  environment,
  memberId,
  email,
}: {
  plan: Plan;
  cycle: BillingCycle;
  priceId?: string;
  clientToken: string;
  environment: "sandbox" | "production";
  memberId: string;
  email: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPaddleScript()
      .then(() => {
        if (cancelled || !window.Paddle) return;
        if (environment === "sandbox") window.Paddle.Environment.set("sandbox");
        window.Paddle.Initialize({
          token: clientToken,
          eventCallback: (event) => {
            if (event.name === "checkout.completed") {
              router.push("/dashboard?checkout=success");
            }
          },
        });
        setReady(true);
      })
      .catch(() => setError("Could not load the secure payment form. Please try again."));
    return () => {
      cancelled = true;
    };
  }, [clientToken, environment, router]);

  function handleClick() {
    setError("");
    if (!priceId) {
      setError(`No Paddle price configured for ${plan} / ${cycle} yet.`);
      return;
    }
    if (!ready || !window.Paddle) {
      setError("Payment form is still loading — try again in a moment.");
      return;
    }
    setLoading(true);
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email },
      customData: { memberId, plan, cycle },
    });
    // The overlay handles its own loading state; release ours once it's had a
    // moment to appear so the button isn't stuck disabled if the user closes it.
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-br from-accent to-accent3 px-6 py-3.5 text-[14.5px] font-semibold text-[#12071f] shadow-[0_10px_30px_-8px_rgba(214,106,238,0.45)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? "Opening secure payment…" : "Continue to secure payment"}
      </button>
      {error && <p className="mt-3 text-[12.5px] text-danger">{error}</p>}
    </div>
  );
}
