"use client";

import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { Panel } from "./Panel";
import { fmtNum, fmtPct } from "@/lib/utils";
import type { MarketSignal } from "@creator-intel/shared";

interface Props {
  mint: string;
}

export function MarketSignals({ mint }: Props) {
  const { data } = useQuery<{ signal: MarketSignal }>({
    queryKey: ["signals", mint, "signal"],
    queryFn: async () => {
      const r = await fetch(`/api/signals?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 20_000,
  });

  const s = data?.signal;
  const candles = s?.ohlcv ?? [];

  const alertTone =
    s?.priceAlert === "pump"
      ? "text-term-green"
      : s?.priceAlert === "dump"
        ? "text-term-red"
        : "text-term-dim";

  return (
    <Panel
      title="Market Signals"
      tag="MKT"
      right={
        s ? (
          <span className={alertTone}>
            {s.priceAlert.toUpperCase()}
            {s.volumeSpike > 2 ? " · VOL 2×" : ""}
          </span>
        ) : (
          "…"
        )
      }
    >
      <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
        <Bar
          label="Buy pressure"
          pct={s?.buyPressurePct ?? 0}
          color="bg-term-green"
        />
        <Bar
          label="Sell pressure"
          pct={s?.sellPressurePct ?? 0}
          color="bg-term-red"
        />
        <div className="metric">
          <span className="metric-label">Volume spike</span>
          <span className="metric-value">
            {s ? `${s.volumeSpike.toFixed(2)}×` : "—"}
          </span>
        </div>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={candles}>
            <YAxis hide domain={["auto", "auto"]} />
            <Line
              type="monotone"
              dataKey="c"
              stroke="#22d3ee"
              strokeWidth={1.25}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="metric">
      <span className="metric-label">
        {label} · {fmtPct(pct, 1)}
      </span>
      <div className="h-2 bg-term-border rounded-sm overflow-hidden mt-1">
        <div className={color} style={{ width: `${Math.min(100, pct)}%`, height: "100%" }} />
      </div>
    </div>
  );
}
