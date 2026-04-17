export interface AuraBreakdown {
  holderHealth: number;   // 0-30  — based on gini (lower gini = better)
  buyPressure: number;    // 0-25  — 24h buy vs sell
  volumeMomentum: number; // 0-20  — volume spike multiplier
  whaleRisk: number;      // 0-15  — fewer whales = safer
  growth: number;         // 0-10  — new holders 24h
}

export interface AuraScore {
  mint: string;
  symbol: string;
  name: string;
  score: number;          // 0-100
  tier: AuraTier;
  breakdown: AuraBreakdown;
  signals: {
    gini: number;
    buyPressurePct: number;
    volumeSpike: number;
    whaleCount: number;
    newHolders24h: number;
    price: number;
    priceChange24h: number;
    marketCap: number;
    totalHolders: number;
  };
  generatedAt: string;
}

export type AuraTier =
  | "GOD_TIER"
  | "HIGH_AURA"
  | "BASED"
  | "MID"
  | "LOW_AURA"
  | "NO_AURA";

export function tierFor(score: number): AuraTier {
  if (score >= 90) return "GOD_TIER";
  if (score >= 75) return "HIGH_AURA";
  if (score >= 60) return "BASED";
  if (score >= 40) return "MID";
  if (score >= 20) return "LOW_AURA";
  return "NO_AURA";
}

export const TIER_LABEL: Record<AuraTier, string> = {
  GOD_TIER: "GOD TIER",
  HIGH_AURA: "HIGH AURA",
  BASED: "BASED",
  MID: "MID",
  LOW_AURA: "LOW AURA",
  NO_AURA: "NO AURA",
};

export const TIER_COLOR: Record<AuraTier, string> = {
  GOD_TIER: "#ffb020",   // amber
  HIGH_AURA: "#39ff88",  // green
  BASED: "#22d3ee",      // cyan
  MID: "#d1f5d3",        // text
  LOW_AURA: "#5b7a5f",   // dim
  NO_AURA: "#ff4d6d",    // red
};

interface ComputeInput {
  gini: number;
  buyPressurePct: number;
  volumeSpike: number;
  whaleCount: number;
  newHolders24h: number;
}

export function computeAura(input: ComputeInput): {
  score: number;
  tier: AuraTier;
  breakdown: AuraBreakdown;
} {
  const holderHealth = clamp((1 - clamp(input.gini, 0, 1)) * 30, 0, 30);
  const buyPressure = clamp((input.buyPressurePct - 30) * 0.83, 0, 25);
  const volumeMomentum = clamp(Math.min(input.volumeSpike, 5) * 4, 0, 20);
  const whaleRisk = clamp(15 - input.whaleCount, 0, 15);
  const growth = clamp(Math.log10(1 + Math.max(0, input.newHolders24h)) * 2.5, 0, 10);

  const raw = holderHealth + buyPressure + volumeMomentum + whaleRisk + growth;
  const score = Math.round(clamp(raw, 0, 100));

  return {
    score,
    tier: tierFor(score),
    breakdown: {
      holderHealth: Math.round(holderHealth * 10) / 10,
      buyPressure: Math.round(buyPressure * 10) / 10,
      volumeMomentum: Math.round(volumeMomentum * 10) / 10,
      whaleRisk: Math.round(whaleRisk * 10) / 10,
      growth: Math.round(growth * 10) / 10,
    },
  };
}

function clamp(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}
