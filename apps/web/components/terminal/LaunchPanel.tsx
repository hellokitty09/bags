"use client";

import { useState } from "react";

interface LaunchPanelProps {
  onSuccess: (mint: string, symbol: string) => void;
}

type Step = 1 | 2 | 3;

export function LaunchPanel({ onSuccess }: LaunchPanelProps) {
  const [mint, setMint] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [launchOpened, setLaunchOpened] = useState(false);

  function handleOpenBags() {
    window.open(
      "https://bags.fm/launch",
      "bags_launch",
      "width=480,height=720,menubar=no,toolbar=no,location=no,status=no",
    );
    setLaunchOpened(true);
    setCurrentStep(2);
  }

  async function handleMonitor() {
    const trimmed = mint.trim();
    if (!trimmed || trimmed.length < 32) {
      setErrorMsg("Enter a valid Solana mint address (32+ chars).");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setCurrentStep(3);

    try {
      // Register token in DB
      const tokenRes = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mint: trimmed }),
      });

      if (!tokenRes.ok) {
        const { error } = await tokenRes.json();
        throw new Error(error ?? "Failed to register token");
      }

      const { token } = await tokenRes.json();

      // Register Helius webhook
      await fetch("/api/webhooks/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mint: trimmed }),
      });
      // Webhook registration failure is non-fatal — token still monitored via polling

      onSuccess(trimmed, token?.symbol ?? "TOKEN");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      setCurrentStep(2);
    }
  }

  return (
    <div className="panel p-8 max-w-2xl w-full space-y-8 border-term-green/10">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono">
        <StepBadge step={1} current={currentStep} label="Launch" />
        <span className="text-term-border mx-1">→</span>
        <StepBadge step={2} current={currentStep} label="Paste Mint" />
        <span className="text-term-border mx-1">→</span>
        <StepBadge step={3} current={currentStep} label="Monitor" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Launch on Bags */}
        <div className="space-y-4 relative">
          <div className="flex items-center gap-2">
            <span className="text-term-green text-xs tracking-[0.3em] uppercase border-b border-term-border/30 pb-1 font-bold">
              Step 1
            </span>
            <span className="text-term-dim text-[10px] tracking-wide">
              New to Bags?
            </span>
          </div>
          <p className="text-term-dim text-sm leading-relaxed">
            Launch your creator token on Bags.fm — it takes 60 seconds. We&apos;ll open it in a new window so you don&apos;t lose your place.
          </p>
          <button
            onClick={handleOpenBags}
            className={`w-full flex items-center justify-center gap-3 px-5 py-4 border text-xs tracking-widest uppercase transition-all duration-300 group ${
              launchOpened
                ? "border-term-green/30 text-term-green/60 bg-term-green/5"
                : "border-term-green/50 hover:border-term-green text-term-green hover:shadow-[0_0_20px_rgba(57,255,136,0.25)] hover:bg-term-green/10"
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚀</span>
            <span>{launchOpened ? "Launched? →" : "Launch on Bags.fm"}</span>
            <span className="text-term-dim text-[10px]">↗</span>
          </button>
          {launchOpened && (
            <div className="flex items-center gap-2 text-[10px] text-term-green/70 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-term-green animate-pulse" />
              <span>Bags.fm opened — come back here when you&apos;re done</span>
            </div>
          )}
        </div>

        {/* Right: Paste Mint */}
        <div className="space-y-4 relative">
          <div className="flex items-center gap-2">
            <span className="text-term-cyan text-xs tracking-[0.3em] uppercase border-b border-term-border/30 pb-1 font-bold">
              Step 2
            </span>
            <span className="text-term-dim text-[10px] tracking-wide">
              Already launched?
            </span>
          </div>
          <p className="text-term-dim text-sm leading-relaxed">
            Paste your token mint address — we&apos;ll wire up real-time webhooks and load your dashboard in 3 seconds.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={mint}
              onChange={(e) => { setMint(e.target.value); setStatus("idle"); setErrorMsg(""); }}
              placeholder="Paste mint address..."
              className="flex-1 bg-term-bg border border-term-border/50 focus:border-term-cyan text-white text-xs px-3 py-3 outline-none placeholder:text-term-dim/40 font-mono transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleMonitor()}
            />
            <button
              onClick={handleMonitor}
              disabled={status === "loading"}
              className="px-5 py-3 bg-term-cyan/10 border border-term-cyan/50 hover:border-term-cyan text-term-cyan text-xs tracking-widest uppercase transition-all duration-200 hover:bg-term-cyan/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap font-bold"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-term-cyan/40 border-t-term-cyan rounded-full animate-spin" />
                  Wiring…
                </span>
              ) : (
                "Monitor →"
              )}
            </button>
          </div>
          {status === "error" && (
            <p className="text-red-400 text-xs animate-fadeIn">{errorMsg}</p>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-term-dim/40 text-[10px] tracking-widest uppercase border-t border-term-border/20 pt-4">
        Your token data streams via Helius webhooks · Dashboard loads in ~3s
      </div>
    </div>
  );
}

function StepBadge({ step, current, label }: { step: Step; current: Step; label: string }) {
  const isActive = step === current;
  const isDone = step < current;

  return (
    <span
      className={`px-3 py-1 border transition-all duration-300 ${
        isActive
          ? "border-term-green text-term-green bg-term-green/10 shadow-[0_0_10px_rgba(57,255,136,0.2)]"
          : isDone
            ? "border-term-green/30 text-term-green/60 bg-term-green/5"
            : "border-term-border/30 text-term-dim/40"
      }`}
    >
      {isDone ? "✓ " : ""}{label}
    </span>
  );
}
