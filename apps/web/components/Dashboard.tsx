"use client";

import { useEffect, useState } from "react";
import { TickerBar } from "./terminal/TickerBar";
import { HolderTreemap } from "./terminal/HolderTreemap";
import { RevenueSparkline } from "./terminal/RevenueSparkline";
import { MarketSignals } from "./terminal/MarketSignals";
import { ActivityFeed } from "./terminal/ActivityFeed";
import { InsightCard } from "./terminal/InsightCard";
import { SwapPanel } from "./terminal/SwapPanel";
import { LaunchPanel } from "./terminal/LaunchPanel";
import { TokenSwitcher } from "./TokenSwitcher";

type Mode = "creator" | "trader";

export function Dashboard() {
  const [mint, setMint] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("TOKEN");
  const [mode, setMode] = useState<Mode>("creator");
  const [isDemo, setIsDemo] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const demo =
      typeof document !== "undefined" &&
      document.cookie.split(";").some((c) => c.trim().startsWith("demo_mode=true"));
    setIsDemo(demo);

    if (demo) {
      setMode("trader");
      setRoleLoaded(true);
      return;
    }

    fetch("/api/me/role", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.role === "trader" || data?.role === "creator") {
          setMode(data.role);
        }
      })
      .catch(() => {})
      .finally(() => setRoleLoaded(true));
  }, []);

  async function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    if (isDemo) return; // demo users can't persist
    try {
      await fetch("/api/me/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
    } catch {
      // best-effort; UI already switched
    }
  }

  if (!roleLoaded) {
    return (
      <div className="min-h-screen grid place-items-center text-term-dim">
        <div className="flex flex-col items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 border-2 border-term-green/30 border-t-term-green rounded-full animate-spin" />
          <span className="tracking-[0.3em] text-xs uppercase">loading terminal…</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6 flex flex-col gap-4 animate-fadeIn">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-term-border/50">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <h1 className={`${mode === "creator" ? "text-term-green" : "text-term-cyan"} tracking-[0.3em] text-sm font-bold flex items-center gap-3`}>
            <span className={`inline-block w-2 h-2 rounded-full ${mode === "creator" ? "bg-term-green shadow-[0_0_8px_rgba(57,255,136,0.5)]" : "bg-term-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)]"}`} />
            <span className="hidden md:inline">
               {mode === "creator" ? "AURA // BASED OWNER DASH" : "AURA // TRENCH TERMINAL"}
            </span>
            <span className="md:hidden">
               {mode === "creator" ? "AURA OWN" : "AURA TRD"}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border border-term-border/50 text-[10px] uppercase tracking-widest overflow-hidden">
            <button
              onClick={() => switchMode("creator")}
              className={`px-3 py-1.5 font-bold transition-colors ${mode === "creator" ? "bg-term-green/20 text-term-green" : "text-term-dim hover:bg-term-green/10 hover:text-term-green"}`}
            >
              Creator
            </button>
            <button
              onClick={() => switchMode("trader")}
              className={`px-3 py-1.5 font-bold transition-colors ${mode === "trader" ? "bg-term-cyan/20 text-term-cyan" : "text-term-dim hover:bg-term-cyan/10 hover:text-term-cyan"}`}
            >
              Fan
            </button>
          </div>
          <TokenSwitcher
            value={mint}
            onChange={(m, s) => {
              setMint(m);
              setSymbol(s);
            }}
          />
        </div>
      </header>

      {mint ? (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <TickerBar mint={mint} symbol={symbol} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 flex flex-col gap-4 transition-all duration-300">
              {mode === "creator" && (
                <div className="animate-fadeIn">
                  <RevenueSparkline mint={mint} />
                </div>
              )}
              <MarketSignals mint={mint} />
              <HolderTreemap mint={mint} />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 transition-all duration-300">
              {mode === "creator" ? (
                <div className="animate-fadeIn">
                  <InsightCard mint={mint} />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <SwapPanel mint={mint} symbol={symbol} />
                </div>
              )}
              <div className={mode === "trader" ? "flex-1 min-h-[600px]" : ""}>
                <ActivityFeed mint={mint} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center animate-fadeIn">
          {mode === "creator" ? (
            isDemo ? (
              <div className="panel p-10 max-w-lg text-center space-y-4 border-term-amber/30">
                <div className="text-term-amber text-3xl mb-2">⟐</div>
                <p className="text-term-amber text-xs tracking-[0.25em] uppercase">Demo Mode</p>
                <p className="text-term-dim text-sm leading-relaxed">
                  Launching tokens is disabled in demo. Sign up to register and monitor your own creator token.
                </p>
              </div>
            ) : (
              <LaunchPanel
                onSuccess={(m, s) => {
                  setMint(m);
                  setSymbol(s);
                }}
              />
            )
          ) : (
            <div className="panel p-10 max-w-lg text-center space-y-4 border-term-cyan/10">
              <div className="text-term-cyan text-3xl mb-2">⟐</div>
              <p className="text-term-dim text-sm leading-relaxed">
                Select a token to load the trader terminal.
              </p>
              <p className="text-term-dim/50 text-xs">
                Click <span className="text-term-cyan">+ link token</span> above to get started.
              </p>
            </div>
          )}
        </div>
      )}

      <footer className="text-[10px] text-term-dim text-right tracking-widest pt-2 border-t border-term-border/30">
        BAGS × BIRDEYE × HELIUS × PRIVY · v0.1.0
      </footer>
    </main>
  );
}
