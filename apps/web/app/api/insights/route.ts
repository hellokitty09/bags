import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { TimingInsight } from "@creator-intel/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 6 * 3600 * 1000;

interface RegimeInfo {
  regime: string;
  confidence: number;
  description: string;
}

interface EnrichedInsight extends TimingInsight {
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
}

function generateNarrative(
  timing: TimingInsight,
  regime: RegimeInfo,
  signals: EnrichedInsight["signals"],
): string {
  const parts: string[] = [];

  // Regime headline
  const regimeEmoji: Record<string, string> = {
    breakout: "🚀",
    accumulation: "📈",
    distribution: "📉",
    consolidation: "⏸️",
    dormant: "💤",
  };
  parts.push(
    `${regimeEmoji[regime.regime] ?? "📊"} REGIME: ${regime.regime.toUpperCase()}`,
  );
  parts.push(regime.description);

  // Whale alert
  if (signals.whaleCount > 0) {
    if (signals.topHolderPct > 30) {
      parts.push(
        `⚠️ WHALE RISK: Top holders control ${signals.topHolderPct.toFixed(0)}% of supply across ${signals.whaleCount} whale wallets. High concentration risk.`,
      );
    } else {
      parts.push(
        `🐋 ${signals.whaleCount} whale wallet${signals.whaleCount > 1 ? "s" : ""} hold ${signals.topHolderPct.toFixed(0)}% — distribution looks healthy.`,
      );
    }
  }

  // Momentum
  if (signals.volumeSpike > 2) {
    parts.push(
      `📊 VOLUME SPIKE: ${signals.volumeSpike.toFixed(1)}× above baseline — unusual activity detected.`,
    );
  }
  if (signals.buyPressurePct > 60) {
    parts.push(
      `💚 Buy pressure dominant at ${signals.buyPressurePct.toFixed(0)}% — bulls in control.`,
    );
  } else if (signals.buyPressurePct < 40) {
    parts.push(
      `🔴 Sell pressure dominant at ${signals.sellPressurePct.toFixed(0)}% — caution advised.`,
    );
  }

  // Action item from timing
  if (timing.bestWindows.length > 0) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const w = timing.bestWindows[0]!;
    const actionVerb =
      regime.regime === "accumulation" || regime.regime === "breakout"
        ? "Ride the wave — post your next update"
        : regime.regime === "distribution"
          ? "Consider a community engagement push"
          : "Best time to post";
    parts.push(
      `🎯 ACTION: ${actionVerb} on ${days[w.dayOfWeek]} at ${String(w.hourUtc).padStart(2, "0")}:00 UTC (${w.baselineMultiplier.toFixed(1)}× more activity).`,
    );
  }

  // Confidence disclaimer
  if (regime.confidence < 0.3) {
    parts.push(
      `⚡ Low confidence (${(regime.confidence * 100).toFixed(0)}%) — signals based on limited history. Check back in a few days.`,
    );
  }

  return parts.join("\n\n");
}

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint");
  if (!mint)
    return NextResponse.json({ error: "mint required" }, { status: 400 });

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    const demoRegime: RegimeInfo = {
      regime: "accumulation",
      confidence: 0.82,
      description:
        "Steady buy pressure (62%) with stable volume — smart money is accumulating.",
    };
    const demoSignals: EnrichedInsight["signals"] = {
      buyPressurePct: 65.4,
      sellPressurePct: 34.6,
      volumeSpike: 3.2,
      priceAlert: "pump",
      whaleCount: 4,
      topHolderPct: 18.5,
    };
    const demoTiming: TimingInsight = {
      mint,
      generatedAt: new Date().toISOString(),
      summary:
        "High volume cluster detected during late US trading hours. Consider posting at 22:00 UTC for maximum engagement impact.",
      bestWindows: [
        {
          dayOfWeek: new Date().getDay(),
          hourUtc: 22,
          score: 9.8,
          baselineMultiplier: 2.8,
        },
        {
          dayOfWeek: (new Date().getDay() + 1) % 7,
          hourUtc: 18,
          score: 8.5,
          baselineMultiplier: 1.8,
        },
        {
          dayOfWeek: (new Date().getDay() + 2) % 7,
          hourUtc: 15,
          score: 7.2,
          baselineMultiplier: 1.5,
        },
      ],
    };

    const response: EnrichedInsight = {
      ...demoTiming,
      regime: demoRegime,
      signals: demoSignals,
      narrative: generateNarrative(demoTiming, demoRegime, demoSignals),
    };
    return NextResponse.json(response);
  }

  try {
    const rows = await db
      .select()
      .from(schema.insightsCache)
      .where(eq(schema.insightsCache.mint, mint))
      .limit(1);

    const cached = rows[0];
    if (
      cached &&
      Date.now() - new Date(cached.generatedAt).getTime() < CACHE_TTL_MS
    ) {
      return NextResponse.json(cached.payload as EnrichedInsight);
    }

    // Fetch timing from ML service
    const mlRes = await fetch(`${env.ML_SERVICE_URL}/insights/timing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.ML_SERVICE_TOKEN
          ? { Authorization: `Bearer ${env.ML_SERVICE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ mint }),
      cache: "no-store",
    });

    let timing: TimingInsight & { regime?: RegimeInfo };
    if (mlRes.ok) {
      timing = await mlRes.json();
    } else {
      timing = {
        mint,
        bestWindows: [],
        summary: "ML service unavailable — showing market signals only.",
        generatedAt: new Date().toISOString(),
      };
    }

    // Fetch market signals for enrichment
    let signalData: EnrichedInsight["signals"] = {
      buyPressurePct: 50,
      sellPressurePct: 50,
      volumeSpike: 1,
      priceAlert: "none",
      whaleCount: 0,
      topHolderPct: 0,
    };

    try {
      const [sigRes, holdRes] = await Promise.all([
        fetch(
          `${req.nextUrl.origin}/api/signals?mint=${mint}`,
          { cache: "no-store" },
        ),
        fetch(
          `${req.nextUrl.origin}/api/holders?mint=${mint}`,
          { cache: "no-store" },
        ),
      ]);
      if (sigRes.ok) {
        const sig = await sigRes.json();
        signalData.buyPressurePct = sig.signal?.buyPressurePct ?? 50;
        signalData.sellPressurePct = sig.signal?.sellPressurePct ?? 50;
        signalData.volumeSpike = sig.signal?.volumeSpike ?? 1;
        signalData.priceAlert = sig.signal?.priceAlert ?? "none";
      }
      if (holdRes.ok) {
        const hold = await holdRes.json();
        signalData.whaleCount =
          hold.entries?.filter(
            (h: { tier: string }) => h.tier === "whale",
          ).length ?? 0;
        signalData.topHolderPct =
          hold.entries
            ?.slice(0, 10)
            .reduce(
              (a: number, h: { sharePct: number }) => a + h.sharePct,
              0,
            ) ?? 0;
      }
    } catch {
      // Best-effort enrichment; continue with defaults
    }

    const regime: RegimeInfo = timing.regime ?? {
      regime: "consolidation",
      confidence: 0.5,
      description: "Mixed signals — consolidation range.",
    };

    const narrative = generateNarrative(timing, regime, signalData);

    const enriched: EnrichedInsight = {
      ...timing,
      regime,
      signals: signalData,
      narrative,
    };

    await db
      .insert(schema.insightsCache)
      .values({ mint, payload: enriched, generatedAt: new Date() })
      .onConflictDoUpdate({
        target: schema.insightsCache.mint,
        set: { payload: enriched, generatedAt: new Date() },
      });

    return NextResponse.json(enriched);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
