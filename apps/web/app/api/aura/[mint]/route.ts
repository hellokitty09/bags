import { NextRequest, NextResponse } from "next/server";
import { getMarketSignal, getTokenOverview, getTokenHolders } from "@/lib/birdeye";
import { getTokenMetadata } from "@/lib/bags";
import { computeAura, type AuraScore } from "@/lib/aura";
import { db, schema } from "@/lib/db";
import { and, eq, gte } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function gini(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;
  let cum = 0;
  for (let i = 0; i < n; i++) cum += (i + 1) * sorted[i]!;
  return (2 * cum) / (n * sum) - (n + 1) / n;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mint: string }> },
): Promise<NextResponse> {
  const { mint } = await params;
  if (!mint || mint.length < 32) {
    return NextResponse.json({ error: "invalid mint" }, { status: 400 });
  }

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    const demo = computeAura({
      gini: 0.62,
      buyPressurePct: 68,
      volumeSpike: 2.4,
      whaleCount: 4,
      newHolders24h: 1240,
    });
    const payload: AuraScore = {
      mint,
      symbol: "DEMO",
      name: "Demo Token",
      score: demo.score,
      tier: demo.tier,
      breakdown: demo.breakdown,
      signals: {
        gini: 0.62,
        buyPressurePct: 68,
        volumeSpike: 2.4,
        whaleCount: 4,
        newHolders24h: 1240,
        price: 0.0352,
        priceChange24h: 12.4,
        marketCap: 34_000_000,
        totalHolders: 142503,
      },
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(payload);
  }

  try {
    const [signal, overview, holders, meta] = await Promise.all([
      getMarketSignal(mint).catch(() => null),
      getTokenOverview(mint).catch(() => null),
      getTokenHolders(mint, 100).catch(() => [] as Awaited<ReturnType<typeof getTokenHolders>>),
      getTokenMetadata(mint).catch(() => null),
    ]);

    if (!overview && !signal) {
      return NextResponse.json(
        { error: "token not found on birdeye" },
        { status: 404 },
      );
    }

    const balances = holders.map((h) => h.balance);
    const g = Number.isFinite(gini(balances)) ? gini(balances) : 0.5;
    const whaleCount = holders.filter((h) => h.tier === "whale").length;

    let newHolders24h = 0;
    try {
      const since = new Date(Date.now() - 24 * 3600 * 1000);
      const recent = await db
        .select()
        .from(schema.holders)
        .where(and(eq(schema.holders.mint, mint), gte(schema.holders.firstSeen, since)));
      newHolders24h = recent.length;
    } catch {
      // DB not required for aura score
    }

    const input = {
      gini: g,
      buyPressurePct: signal?.buyPressurePct ?? 50,
      volumeSpike: signal?.volumeSpike ?? 1,
      whaleCount,
      newHolders24h,
    };
    const { score, tier, breakdown } = computeAura(input);

    const payload: AuraScore = {
      mint,
      symbol: meta?.symbol ?? overview?.mint?.slice(0, 6) ?? "TOKEN",
      name: meta?.name ?? "Unknown Token",
      score,
      tier,
      breakdown,
      signals: {
        gini: Math.round(g * 100) / 100,
        buyPressurePct: Math.round(input.buyPressurePct * 10) / 10,
        volumeSpike: Math.round(input.volumeSpike * 100) / 100,
        whaleCount,
        newHolders24h,
        price: overview?.price ?? 0,
        priceChange24h: overview?.priceChange24h ?? 0,
        marketCap: overview?.marketCap ?? 0,
        totalHolders: overview?.holders ?? 0,
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
