"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "creator" | "trader";

export function OnboardingClient() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    // Demo users bypass onboarding → routed into trader terminal
    if (typeof document !== "undefined" && document.cookie.includes("demo_mode=true")) {
      router.replace("/terminal");
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [ready, authenticated, router]);

  async function chooseRole(role: Role) {
    if (submitting) return;
    setSubmitting(role);
    setError(null);
    try {
      const res = await fetch("/api/me/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "failed" }));
        throw new Error(msg || "failed to save role");
      }
      router.replace("/terminal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-term-dim">
        <div className="flex flex-col items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 border-2 border-term-green/30 border-t-term-green rounded-full animate-spin" />
          <span className="tracking-[0.3em] text-xs uppercase">configuring terminal…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-term-bg flex flex-col items-center justify-center p-4 animate-fadeIn selection:bg-term-green/20 relative">
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] border border-term-green rounded-full opacity-5" />
        <div className="w-[900px] h-[900px] border border-term-green rounded-full opacity-[0.03] absolute" />
      </div>

      <div className="z-10 w-full max-w-3xl space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-block px-4 py-1 mb-4 border border-term-green shadow-[0_0_15px_rgba(57,255,136,0.3)] bg-term-green/10 text-term-green text-[10px] uppercase tracking-[0.3em]">
            Final step
          </div>
          <h2 className="text-2xl md:text-3xl text-white tracking-[0.2em] font-mono">
            CHOOSE YOUR <span className="text-term-green font-bold">ROLE</span>
          </h2>
          <p className="text-term-dim text-xs tracking-[0.15em] pt-2">
            This sets your default terminal view. You can toggle later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => chooseRole("creator")}
            disabled={!!submitting}
            className="panel relative group overflow-hidden border border-term-green/30 hover:border-term-green bg-term-panel/80 backdrop-blur-xl p-8 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(57,255,136,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="text-8xl text-term-green font-bold">01</div>
            </div>
            <div className="text-term-green mb-3 pb-3 border-b border-term-border/50 text-[10px] tracking-[0.2em] uppercase">
              Creator
            </div>
            <h3 className="text-xl font-bold text-white mb-2">I launched a token</h3>
            <p className="text-term-dim text-sm leading-relaxed mb-5">
              Track revenue, analyze holder health, and get ML-powered timing insights for your Bags.fm creator token.
            </p>
            <div className="flex items-center gap-2 text-term-green text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              <span>{submitting === "creator" ? "Saving…" : "Enter Creator Dashboard"}</span>
              <span>→</span>
            </div>
          </button>

          <button
            onClick={() => chooseRole("trader")}
            disabled={!!submitting}
            className="panel relative group overflow-hidden border border-term-cyan/30 hover:border-term-cyan bg-term-panel/80 backdrop-blur-xl p-8 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="text-8xl text-term-cyan font-bold">02</div>
            </div>
            <div className="text-term-cyan mb-3 pb-3 border-b border-term-border/50 text-[10px] tracking-[0.2em] uppercase">
              Fan / Trader
            </div>
            <h3 className="text-xl font-bold text-white mb-2">I buy tokens</h3>
            <p className="text-term-dim text-sm leading-relaxed mb-5">
              Real-time transaction feeds, whale alerts, buy/sell pressure signals, and in-terminal swaps.
            </p>
            <div className="flex items-center gap-2 text-term-cyan text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              <span>{submitting === "trader" ? "Saving…" : "Enter Trader Terminal"}</span>
              <span>→</span>
            </div>
          </button>
        </div>

        {error && (
          <p className="text-center text-red-400 text-xs tracking-widest uppercase">{error}</p>
        )}
      </div>
    </div>
  );
}
