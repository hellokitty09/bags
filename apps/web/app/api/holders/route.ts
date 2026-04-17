import { NextRequest, NextResponse } from "next/server";
import { getTokenHolders, getTokenOverview } from "@/lib/birdeye";
import { db, schema } from "@/lib/db";
import { and, eq, gte } from "drizzle-orm";
import type { HolderAnalytics } from "@creator-intel/shared";

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

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint");
  if (!mint) return NextResponse.json({ error: "mint required" }, { status: 400 });

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    return NextResponse.json({
      mint, totalHolders: 142503, top10SharePct: 45.2, whaleCount: 12, gini: 0.85, newHolders24h: 1240, returningHolders24h: 304,
      entries: Array.from({length: 20}, (_, i) => {
        const sharePct = 20 / (i + 1.5) + Math.random();
        return {
          wallet: `Wallet${i}xxxxxxxxx` + Math.random().toString(36).slice(2,8),
          balance: 1000000 / (i + 1), sharePct,
          tier: sharePct > 5 ? "whale" : sharePct > 2 ? "dolphin" : sharePct > 0.5 ? "fish" : "shrimp"
        };
      })
    });
  }

  try {
    const [entries, overview] = await Promise.all([
      getTokenHolders(mint, 100),
      getTokenOverview(mint),
    ]);

    const balances = entries.map((e) => e.balance);
    const top10 = entries.slice(0, 10);
    const top10Share = top10.reduce((a, e) => a + e.sharePct, 0);
    const whales = entries.filter((e) => e.tier === "whale").length;
    const g = gini(balances);

    const since = new Date(Date.now() - 24 * 3600 * 1000);
    let newHolders24h = 0;
    let returningHolders24h = 0;
    try {
      const recent = await db
        .select()
        .from(schema.holders)
        .where(and(eq(schema.holders.mint, mint), gte(schema.holders.firstSeen, since)));
      newHolders24h = recent.length;
      const returning = await db
        .select()
        .from(schema.holders)
        .where(and(eq(schema.holders.mint, mint), gte(schema.holders.lastSeen, since)));
      returningHolders24h = Math.max(0, returning.length - newHolders24h);
    } catch {
      // DB may not be set up yet in fresh dev — fall back to 0.
    }

    const payload: HolderAnalytics = {
      mint,
      totalHolders: overview.holders,
      top10SharePct: top10Share,
      whaleCount: whales,
      gini: Number.isFinite(g) ? g : 0,
      entries,
      newHolders24h,
      returningHolders24h,
    };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
