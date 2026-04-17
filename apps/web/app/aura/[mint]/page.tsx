import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { AuraScore } from "@/lib/aura";
import { TIER_COLOR, TIER_LABEL } from "@/lib/aura";
import { AuraShareActions } from "@/components/AuraShareActions";
import { AuraCheckInput } from "@/components/AuraCheckInput";

export const dynamic = "force-dynamic";

async function fetchAura(mint: string): Promise<AuraScore | null> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  try {
    const res = await fetch(`${proto}://${host}/api/aura/${mint}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as AuraScore;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const aura = await fetchAura(mint);
  const title = aura
    ? `${aura.symbol} · AURA ${aura.score}/100 — ${TIER_LABEL[aura.tier]}`
    : "AURA SCORE — Terminal";
  const desc = aura
    ? `${aura.name} scored ${aura.score}/100 on AURA. Holder gini ${aura.signals.gini}, buy pressure ${aura.signals.buyPressurePct}%, ${aura.signals.totalHolders.toLocaleString()} holders.`
    : "Real-time aura score for any Bags.fm creator token.";

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${proto}://${host}/api/og/${mint}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${aura?.symbol ?? "Token"} Aura Score`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function AuraPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  if (!mint || mint.length < 32) notFound();

  const aura = await fetchAura(mint);
  if (!aura) notFound();

  const color = TIER_COLOR[aura.tier];
  const tier = TIER_LABEL[aura.tier];

  return (
    <main className="min-h-screen bg-term-bg selection:bg-term-green/20 relative overflow-x-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center opacity-30">
        <div
          className="w-[800px] h-[800px] blur-[160px] rounded-full mix-blend-screen animate-pulse"
          style={{ backgroundColor: `${color}33`, animationDuration: "5s" }}
        />
      </div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] z-[1]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-term-border/30">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-term-green animate-pulse" />
          <span className="text-term-green text-xs tracking-[0.35em] font-bold">AURA</span>
        </Link>
        <Link
          href="/signup"
          className="border border-term-green/50 hover:border-term-green text-term-green hover:bg-term-green/10 text-[11px] tracking-[0.25em] uppercase px-4 py-1.5 transition-all"
        >
          Get Your Own →
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-10">
        {/* Hero score card */}
        <div
          className="panel p-8 md:p-12 relative overflow-hidden animate-fadeIn"
          style={{ borderColor: `${color}40` }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full pointer-events-none"
            style={{ backgroundColor: `${color}30` }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <div
                className="inline-block px-3 py-1 border text-[10px] tracking-[0.3em] uppercase font-bold"
                style={{ borderColor: `${color}80`, color }}
              >
                {tier}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                ${aura.symbol}
              </h1>
              <p className="text-term-dim text-sm font-mono break-all">
                {aura.name}
              </p>
              <p className="text-term-dim/60 text-[10px] font-mono break-all pt-1">
                {aura.mint}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="text-[7rem] md:text-[9rem] font-bold leading-none tabular-nums tracking-tighter drop-shadow-[0_0_30px_currentColor]"
                style={{ color }}
              >
                {aura.score}
              </div>
              <div className="text-term-dim text-[10px] tracking-[0.3em] uppercase -mt-2">
                / 100 AURA
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="panel p-6 space-y-4 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-term-dim text-[10px] tracking-[0.3em] uppercase">
            Score Breakdown
          </h2>
          <div className="space-y-3">
            <BreakdownRow label="Holder Health" value={aura.breakdown.holderHealth} max={30} hint={`Gini ${aura.signals.gini}`} color={color} />
            <BreakdownRow label="Buy Pressure" value={aura.breakdown.buyPressure} max={25} hint={`${aura.signals.buyPressurePct}% buys`} color={color} />
            <BreakdownRow label="Volume Momentum" value={aura.breakdown.volumeMomentum} max={20} hint={`${aura.signals.volumeSpike}× spike`} color={color} />
            <BreakdownRow label="Whale Risk" value={aura.breakdown.whaleRisk} max={15} hint={`${aura.signals.whaleCount} whales`} color={color} />
            <BreakdownRow label="Growth" value={aura.breakdown.growth} max={10} hint={`+${aura.signals.newHolders24h} new 24h`} color={color} />
          </div>
        </div>

        {/* Market snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <Stat label="Price" value={`$${formatNum(aura.signals.price)}`} />
          <Stat
            label="24h"
            value={`${aura.signals.priceChange24h > 0 ? "+" : ""}${aura.signals.priceChange24h.toFixed(1)}%`}
            positive={aura.signals.priceChange24h > 0}
          />
          <Stat label="Market Cap" value={`$${shortNum(aura.signals.marketCap)}`} />
          <Stat label="Holders" value={shortNum(aura.signals.totalHolders)} />
        </div>

        {/* Share CTA */}
        <AuraShareActions mint={aura.mint} symbol={aura.symbol} score={aura.score} tier={tier} />

        {/* Viral loop: Check your own token */}
        <div className="panel p-8 border-term-cyan/20 text-center space-y-5 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <div className="space-y-2">
            <p className="text-term-cyan text-sm tracking-[0.2em] uppercase font-bold">
              Is your token&apos;s aura higher?
            </p>
            <p className="text-term-dim text-xs">
              Check any Bags.fm creator token — paste a mint address and find out instantly.
            </p>
          </div>
          <AuraCheckInput />
        </div>

        <p className="text-center text-term-dim/50 text-[10px] tracking-widest uppercase">
          Generated {new Date(aura.generatedAt).toUTCString()} · Recomputed every 60s
        </p>
      </div>
    </main>
  );
}

function BreakdownRow({
  label,
  value,
  max,
  hint,
  color,
}: {
  label: string;
  value: number;
  max: number;
  hint: string;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-term-text tracking-wide">{label}</span>
        <span className="text-term-dim font-mono tabular-nums">
          {value.toFixed(1)} / {max}
          <span className="ml-2 text-term-dim/60">{hint}</span>
        </span>
      </div>
      <div className="h-1.5 bg-term-border/50 rounded-sm overflow-hidden">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="panel p-3 text-center">
      <div className="text-term-dim text-[9px] tracking-[0.25em] uppercase mb-1">{label}</div>
      <div
        className={`text-sm font-bold tabular-nums ${
          positive === true ? "text-term-green" : positive === false ? "text-term-red" : "text-term-text"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (n < 0.001) return n.toExponential(2);
  if (n < 1) return n.toFixed(4);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function shortNum(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}
