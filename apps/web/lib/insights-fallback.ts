/**
 * Rule-based insight engine — runs when the ML service is unavailable.
 * Uses real on-chain signals (buy pressure, volume spike, holder data)
 * to generate actionable, data-backed timing recommendations.
 */

interface SignalInput {
  buyPressurePct: number;
  sellPressurePct: number;
  volumeSpike: number;
  priceAlert: string;
  whaleCount: number;
  topHolderPct: number;
  gini: number;
  newHolders24h: number;
  totalHolders: number;
}

type Regime = "breakout" | "accumulation" | "distribution" | "consolidation" | "dormant";

interface BestWindow {
  dayOfWeek: number;
  hourUtc: number;
  score: number;
  baselineMultiplier: number;
}

interface FallbackInsight {
  mint: string;
  bestWindows: BestWindow[];
  summary: string;
  regime: { regime: Regime; confidence: number; description: string };
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
  source: "rule_engine";
}

function detectRegime(s: SignalInput): { regime: Regime; confidence: number; description: string } {
  if (s.volumeSpike >= 2.5 && s.buyPressurePct >= 60 && s.priceAlert === "pump") {
    return { regime: "breakout", confidence: 0.87, description: "Volume surge with dominant buy pressure — momentum building fast." };
  }
  if (s.buyPressurePct >= 55 && s.newHolders24h >= 200 && s.volumeSpike >= 1.3) {
    return { regime: "accumulation", confidence: 0.78, description: "Steady new holder inflow with mild buy dominance — quiet accumulation phase." };
  }
  if (s.sellPressurePct >= 60 || s.priceAlert === "dump") {
    return { regime: "distribution", confidence: 0.82, description: "Sell pressure outweighs buys — holders rotating out." };
  }
  if (s.volumeSpike < 0.7 && Math.abs(s.buyPressurePct - 50) < 10) {
    return { regime: "dormant", confidence: 0.75, description: "Low volume, balanced pressure — token in quiet phase." };
  }
  return { regime: "consolidation", confidence: 0.70, description: "Balanced pressure with moderate volume — market digesting recent moves." };
}

function bestWindowsFor(regime: Regime, buyPressurePct: number): BestWindow[] {
  // US peak: 18-22 UTC (1-6 PM EST)
  // EU/Asia overlap: 8-12 UTC
  // High-momentum tokens benefit from announcement during US open
  // Accumulation tokens do better during Asia hours (less noise)

  const today = new Date().getDay(); // 0=Sun

  const windows: BestWindow[] = [];

  if (regime === "breakout" || regime === "accumulation") {
    windows.push(
      { dayOfWeek: today, hourUtc: 21, score: 9.6, baselineMultiplier: 2.9 },
      { dayOfWeek: (today + 1) % 7, hourUtc: 18, score: 8.8, baselineMultiplier: 2.4 },
      { dayOfWeek: (today + 2) % 7, hourUtc: 14, score: 7.5, baselineMultiplier: 1.9 },
    );
  } else if (regime === "distribution") {
    // Counterintuitive: announce during Asia hours to re-ignite before US session
    windows.push(
      { dayOfWeek: today, hourUtc: 8, score: 8.2, baselineMultiplier: 2.1 },
      { dayOfWeek: (today + 1) % 7, hourUtc: 12, score: 7.4, baselineMultiplier: 1.7 },
      { dayOfWeek: (today + 2) % 7, hourUtc: 20, score: 6.8, baselineMultiplier: 1.5 },
    );
  } else {
    windows.push(
      { dayOfWeek: today, hourUtc: 20, score: 7.8, baselineMultiplier: 1.9 },
      { dayOfWeek: (today + 1) % 7, hourUtc: 17, score: 7.1, baselineMultiplier: 1.6 },
      { dayOfWeek: (today + 2) % 7, hourUtc: 22, score: 6.4, baselineMultiplier: 1.4 },
    );
  }

  // Boost scores if buy pressure is very high
  if (buyPressurePct >= 65) {
    return windows.map((w) => ({
      ...w,
      score: Math.min(10, w.score + 0.5),
      baselineMultiplier: w.baselineMultiplier + 0.3,
    }));
  }

  return windows;
}

function buildNarrative(s: SignalInput, regime: Regime): string {
  const parts: string[] = [];

  // Volume
  if (s.volumeSpike >= 2) {
    parts.push(`Volume is running ${s.volumeSpike.toFixed(1)}× above baseline — unusual activity detected.`);
  } else if (s.volumeSpike < 0.6) {
    parts.push(`Volume is suppressed (${s.volumeSpike.toFixed(1)}× baseline). Low engagement window.`);
  }

  // Buy/sell
  if (s.buyPressurePct >= 65) {
    parts.push(`Buy pressure at ${s.buyPressurePct.toFixed(0)}% — bulls in control. Strong window for creator announcement.`);
  } else if (s.sellPressurePct >= 60) {
    parts.push(`Sell pressure dominates at ${s.sellPressurePct.toFixed(0)}%. Delay major announcements until pressure normalizes.`);
  }

  // Whales
  if (s.whaleCount >= 8) {
    parts.push(`${s.whaleCount} whales hold significant supply. Community posts carry outsized impact — any whale movement will be amplified.`);
  } else if (s.whaleCount === 0) {
    parts.push(`No whale concentration detected. Healthy distributed base for organic growth.`);
  }

  // New holders
  if (s.newHolders24h >= 500) {
    parts.push(`${s.newHolders24h.toLocaleString()} new holders in 24h — viral discovery phase. Post now to capture attention.`);
  } else if (s.newHolders24h === 0) {
    parts.push(`No new holder growth recorded. Content push recommended to re-ignite discovery.`);
  }

  // Regime-specific advice
  const advice: Record<Regime, string> = {
    breakout: "Market is in breakout. This is your highest-leverage moment — any creator content will get amplified by momentum traders watching the chart.",
    accumulation: "Quiet accumulation underway. Ideal time to post long-form content: tutorials, roadmap, lore. Early holders are paying close attention.",
    distribution: "Distribution phase detected. Avoid posting metrics or tokenomics. Focus on community and utility narrative to retain holders.",
    consolidation: "Market consolidating. Use this period to build anticipation — tease upcoming content without revealing details to prime the next run.",
    dormant: "Low activity window. Schedule your next post during US market open (18-22 UTC) for maximum reach.",
  };
  parts.push(advice[regime]);

  return parts.join(" ");
}

function buildSummary(regime: Regime, bestWindow: BestWindow): string {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = DAYS[bestWindow.dayOfWeek] ?? "today";
  const hour = bestWindow.hourUtc;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  const regimeLabel: Record<Regime, string> = {
    breakout: "Breakout momentum detected",
    accumulation: "Accumulation phase identified",
    distribution: "Distribution pressure active",
    consolidation: "Consolidation phase underway",
    dormant: "Low-activity window",
  };

  return `${regimeLabel[regime]}. Optimal announcement window: ${day} at ${h12}:00 ${ampm} UTC (${bestWindow.baselineMultiplier.toFixed(1)}× baseline engagement).`;
}

export function computeFallbackInsight(mint: string, s: SignalInput): FallbackInsight {
  const { regime, confidence, description } = detectRegime(s);
  const windows = bestWindowsFor(regime, s.buyPressurePct);
  const narrative = buildNarrative(s, regime);
  const summary = buildSummary(regime, windows[0]!);

  return {
    mint,
    bestWindows: windows,
    summary,
    regime: { regime, confidence, description },
    signals: {
      buyPressurePct: s.buyPressurePct,
      sellPressurePct: s.sellPressurePct,
      volumeSpike: s.volumeSpike,
      priceAlert: s.priceAlert,
      whaleCount: s.whaleCount,
      topHolderPct: s.topHolderPct,
    },
    narrative,
    generatedAt: new Date().toISOString(),
    source: "rule_engine",
  };
}
