"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Panel } from "./Panel";
import { fmtUsd } from "@/lib/utils";
import type { RevenueSummary } from "@creator-intel/shared";

interface RevenueSparklineProps {
  mint: string;
}

export function RevenueSparkline({ mint }: RevenueSparklineProps) {
  const { data } = useQuery<RevenueSummary>({
    queryKey: ["revenue", mint],
    queryFn: async () => {
      const r = await fetch(`/api/revenue?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 60_000,
  });

  const series = data?.series ?? [];

  return (
    <Panel
      title="Creator Fee Revenue"
      tag="REV"
      right={data ? `${series.length} pts` : "…"}
    >
      <div className="grid grid-cols-4 gap-3 mb-3 text-xs">
        <Stat label="Total" value={data ? fmtUsd(data.totalFeeUsd) : "—"} />
        <Stat label="24h" value={data ? fmtUsd(data.fee24hUsd) : "—"} />
        <Stat label="7d" value={data ? fmtUsd(data.fee7dUsd) : "—"} />
        <Stat
          label="30d proj."
          value={data ? fmtUsd(data.projected30dUsd) : "—"}
        />
      </div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39ff88" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#39ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              cursor={{ stroke: "#5b7a5f", strokeDasharray: 2 }}
              contentStyle={{
                background: "#0a0e0a",
                border: "1px solid #1f2a1f",
                fontSize: 11,
              }}
              labelFormatter={(v) => new Date(v as string).toLocaleString()}
              formatter={(v: number) => [fmtUsd(v), "fee"]}
            />
            <Area
              type="monotone"
              dataKey="feeUsd"
              stroke="#39ff88"
              strokeWidth={1.5}
              fill="url(#rev)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value tabular-nums">{value}</span>
    </div>
  );
}
