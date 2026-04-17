"use client";

import { useQuery } from "@tanstack/react-query";
import { fmtPct, fmtUsd } from "@/lib/utils";
import type { TokenOverview } from "@creator-intel/shared";

interface TickerBarProps {
  mint: string;
  symbol: string;
}

export function TickerBar({ mint, symbol }: TickerBarProps) {
  const { data, isLoading } = useQuery<{
    overview: TokenOverview;
  }>({
    queryKey: ["signals", mint],
    queryFn: async () => {
      const r = await fetch(`/api/signals?mint=${mint}`);
      if (!r.ok) throw new Error("failed");
      return r.json();
    },
    refetchInterval: 15_000,
  });

  const o = data?.overview;
  const up = (o?.priceChange24h ?? 0) >= 0;

  return (
    <div className="panel flex items-center gap-6 px-4 py-2 text-sm tabular-nums overflow-x-auto">
      <span className="text-term-green font-bold tracking-widest">${symbol}</span>
      <span className="text-term-dim text-xs">{mint.slice(0, 8)}…</span>
      <Item label="PRICE" value={o ? fmtUsd(o.price) : "—"} loading={isLoading} />
      <Item
        label="24H"
        value={o ? fmtPct(o.priceChange24h) : "—"}
        tone={up ? "up" : "down"}
      />
      <Item
        label="VOL 24H"
        value={o ? fmtUsd(o.volume24h, { compact: true }) : "—"}
      />
      <Item
        label="MCAP"
        value={o ? fmtUsd(o.marketCap, { compact: true }) : "—"}
      />
      <Item label="HOLDERS" value={o ? o.holders.toLocaleString() : "—"} />
      <span className="ml-auto text-term-dim text-xs">
        <span className="caret" />
      </span>
    </div>
  );
}

function Item({
  label,
  value,
  tone,
  loading,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
  loading?: boolean;
}) {
  const color =
    tone === "up" ? "text-term-green" : tone === "down" ? "text-term-red" : "text-term-text";
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.18em] text-term-dim">
        {label}
      </span>
      <span className={`${color} ${loading ? "opacity-60" : ""}`}>{value}</span>
    </span>
  );
}
