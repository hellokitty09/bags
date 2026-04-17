"use client";

import { useQuery } from "@tanstack/react-query";
import { Panel } from "./Panel";
import { fmtNum, shortAddr } from "@/lib/utils";
import type { HolderAnalytics, HolderEntry } from "@creator-intel/shared";

interface HolderTreemapProps {
  mint: string;
}

const tierColor: Record<HolderEntry["tier"], string> = {
  whale: "bg-term-red/80 text-white",
  dolphin: "bg-term-amber/80 text-black",
  fish: "bg-term-cyan/70 text-black",
  shrimp: "bg-term-green/40 text-black",
};

export function HolderTreemap({ mint }: HolderTreemapProps) {
  const { data, isLoading } = useQuery<HolderAnalytics>({
    queryKey: ["holders", mint],
    queryFn: async () => {
      const r = await fetch(`/api/holders?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 60_000,
  });

  return (
    <Panel
      title="Holder Distribution"
      tag="HLD"
      right={data ? `${fmtNum(data.totalHolders)} holders` : "…"}
    >
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <Stat label="Top 10 share" value={fmt(data?.top10SharePct, "%")} />
        <Stat label="Whales" value={data ? String(data.whaleCount) : "—"} />
        <Stat label="Gini" value={fmt(data?.gini, "", 3)} />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {(data?.entries ?? Array.from({ length: 20 }, () => null))
          .slice(0, 20)
          .map((h, i) => (
            <HolderCell key={h?.wallet ?? i} entry={h} rank={i + 1} loading={isLoading} />
          ))}
      </div>
    </Panel>
  );
}

function HolderCell({
  entry,
  rank,
  loading,
}: {
  entry: HolderEntry | null;
  rank: number;
  loading?: boolean;
}) {
  if (!entry)
    return (
      <div
        className={`aspect-square rounded-sm bg-term-border/40 ${loading ? "animate-pulse" : ""}`}
      />
    );
  const h = Math.max(0.1, entry.sharePct);
  const scale = Math.min(1, Math.sqrt(h / 10));
  
  return (
    <div
      title={`${shortAddr(entry.wallet)} — ${entry.sharePct.toFixed(2)}%`}
      className={`relative aspect-square rounded-sm overflow-hidden ${tierColor[entry.tier]} transition-transform hover:scale-105 hover:z-10`}
      style={{ opacity: 0.5 + scale * 0.5 }}
    >
      <img 
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.wallet}`}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
      />
      <div className="absolute inset-x-0 bottom-0 p-1 bg-black/50 backdrop-blur-sm flex flex-col leading-tight text-[9px]">
        <span className="font-bold">#{rank}</span>
        <span className="opacity-90">{entry.sharePct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}

function fmt(n: number | undefined, suffix = "", digits = 1): string {
  if (n === undefined || !Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}${suffix}`;
}
