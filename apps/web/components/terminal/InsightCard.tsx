"use client";

import { useQuery } from "@tanstack/react-query";
import { Panel } from "./Panel";

interface RegimeInfo {
  regime: string;
  confidence: number;
  description: string;
}

interface EnrichedInsight {
  mint: string;
  bestWindows: Array<{
    dayOfWeek: number;
    hourUtc: number;
    score: number;
    baselineMultiplier: number;
  }>;
  summary: string;
  regime: RegimeInfo;
  signals: {
    buyPressurePct: number;
    sellPressurePct: number;
    volumeSpike: number;
    priceAlert: string;
    whaleCount: number;
    topHolderPct: number;
  };
  narrative: string;
  generatedAt: string;
}

interface Props {
  mint: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const REGIME_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  breakout: { emoji: "🚀", color: "text-term-green", label: "BREAKOUT" },
  accumulation: { emoji: "📈", color: "text-term-cyan", label: "ACCUMULATION" },
  distribution: { emoji: "📉", color: "text-term-red", label: "DISTRIBUTION" },
  consolidation: { emoji: "⏸️", color: "text-term-amber", label: "CONSOLIDATION" },
  dormant: { emoji: "💤", color: "text-term-dim", label: "DORMANT" },
};

export function InsightCard({ mint }: Props) {
  const { data, isLoading } = useQuery<EnrichedInsight>({
    queryKey: ["insights", mint],
    queryFn: async () => {
      const r = await fetch(`/api/insights?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 15 * 60_000,
  });

  return (
    <Panel
      title="AI Intelligence Briefing"
      tag="AI"
      right={data ? new Date(data.generatedAt).toLocaleTimeString() : "…"}
    >
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-term-border/30 rounded w-3/4" />
          <div className="h-3 bg-term-border/20 rounded w-1/2" />
          <div className="h-20 bg-term-border/10 rounded" />
        </div>
      )}
      {data && (
        <div className="space-y-4">
          {/* Regime Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{REGIME_CONFIG[data.regime.regime]?.emoji ?? "📊"}</span>
              <span className={`text-xs font-bold tracking-[0.25em] uppercase ${REGIME_CONFIG[data.regime.regime]?.color ?? "text-term-dim"}`}>
                {REGIME_CONFIG[data.regime.regime]?.label ?? data.regime.regime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 bg-term-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-term-green rounded-full transition-all duration-700"
                  style={{ width: `${data.regime.confidence * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-term-dim tabular-nums">
                {(data.regime.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Signal Grid */}
          <div className="grid grid-cols-3 gap-2">
            <SignalPill
              label="BUY"
              value={`${data.signals.buyPressurePct.toFixed(0)}%`}
              positive={data.signals.buyPressurePct > 55}
              negative={data.signals.buyPressurePct < 40}
            />
            <SignalPill
              label="VOL"
              value={`${data.signals.volumeSpike.toFixed(1)}×`}
              positive={data.signals.volumeSpike > 2}
              negative={false}
            />
            <SignalPill
              label="WHALES"
              value={String(data.signals.whaleCount)}
              positive={false}
              negative={data.signals.whaleCount > 5}
            />
          </div>

          {/* Whale concentration bar */}
          {data.signals.whaleCount > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] tracking-widest">
                <span className="text-term-dim">TOP HOLDER CONCENTRATION</span>
                <span className={data.signals.topHolderPct > 30 ? "text-term-red" : "text-term-green"}>
                  {data.signals.topHolderPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1 bg-term-border/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    data.signals.topHolderPct > 30 ? "bg-term-red" : "bg-term-green"
                  }`}
                  style={{ width: `${Math.min(100, data.signals.topHolderPct)}%` }}
                />
              </div>
            </div>
          )}

          {/* Timing Heatmap Mini */}
          {data.bestWindows.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[9px] text-term-dim tracking-widest">
                OPTIMAL POST WINDOWS
              </div>
              <div className="space-y-1">
                {data.bestWindows.map((w, i) => (
                  <div
                    key={`${w.dayOfWeek}-${w.hourUtc}`}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[10px] text-term-dim w-4 tabular-nums">
                      #{i + 1}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-term-text w-14 font-mono">
                        {DAYS[w.dayOfWeek]} {String(w.hourUtc).padStart(2, "0")}:00
                      </span>
                      <div className="flex-1 h-2 bg-term-border/20 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-term-green/60 rounded-sm"
                          style={{
                            width: `${Math.min(100, (w.baselineMultiplier / (data.bestWindows[0]?.baselineMultiplier || 1)) * 100)}%`,
                            boxShadow: "0 0 6px rgba(57,255,136,0.3)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-term-cyan tabular-nums w-10 text-right">
                        {w.baselineMultiplier.toFixed(1)}×
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Narrative */}
          <div className="bg-term-bg/60 border border-term-border/30 p-3 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-term-green animate-pulse" />
              <span className="text-[9px] text-term-green tracking-[0.3em] font-bold">
                AI BRIEFING
              </span>
            </div>
            {data.narrative.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-term-text text-xs leading-relaxed font-mono">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Price alert badge */}
          {data.signals.priceAlert !== "none" && (
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-xs tracking-widest uppercase ${
                data.signals.priceAlert === "pump"
                  ? "border-term-green/40 bg-term-green/5 text-term-green"
                  : "border-term-red/40 bg-term-red/5 text-term-red"
              }`}
            >
              <span className="animate-pulse">
                {data.signals.priceAlert === "pump" ? "🟢" : "🔴"}
              </span>
              <span>
                Price alert: {data.signals.priceAlert === "pump" ? "PUMP DETECTED" : "DUMP WARNING"}
              </span>
            </div>
          )}
        </div>
      )}
      {!isLoading && !data && (
        <p className="text-term-dim text-xs">
          Insight unavailable — ensure ML service is running and tx history
          exists.
        </p>
      )}
    </Panel>
  );
}

function SignalPill({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive: boolean;
  negative: boolean;
}) {
  const color = positive
    ? "border-term-green/30 text-term-green"
    : negative
      ? "border-term-red/30 text-term-red"
      : "border-term-border/50 text-term-text";

  return (
    <div className={`border rounded-sm p-2 text-center ${color}`}>
      <div className="text-[8px] tracking-[0.2em] text-term-dim uppercase mb-0.5">
        {label}
      </div>
      <div className="text-sm font-bold tabular-nums">{value}</div>
    </div>
  );
}
