import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { getTokenHolders, getTokenOverview } from "@/lib/birdeye";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const tokens = await db
    .select({ mint: schema.tokens.mint })
    .from(schema.tokens);

  const results: { mint: string; ok: boolean; err?: string }[] = [];

  for (const { mint } of tokens) {
    try {
      const [overview, top] = await Promise.all([
        getTokenOverview(mint),
        getTokenHolders(mint, 100),
      ]);
      const top10Pct = top.slice(0, 10).reduce((a, h) => a + h.sharePct, 0);
      const whaleCount = top.filter((h) => h.tier === "whale").length;

      await db.insert(schema.holderSnapshots).values({
        mint,
        takenAt: new Date(),
        holderCount: overview.holders,
        top10Pct,
        whaleCount,
        gini: 0,
      });
      results.push({ mint, ok: true });
    } catch (err) {
      results.push({
        mint,
        ok: false,
        err: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ results });
}
