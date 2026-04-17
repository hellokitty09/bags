import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { and, eq, gte, sql } from "drizzle-orm";
import type { RevenueSummary, RevenuePoint } from "@creator-intel/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint");
  if (!mint) return NextResponse.json({ error: "mint required" }, { status: 400 });

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    return NextResponse.json({
      mint,
      totalFeeUsd: 42500.5,
      fee24hUsd: 1250.2,
      fee7dUsd: 8400.1,
      projected30dUsd: 36000.4,
      series: Array.from({length: 30}, (_, i) => ({
        ts: new Date(Date.now() - (30-i)*86400000).toISOString(),
        feeLamports: 1000000000,
        feeUsd: 200 + Math.random() * 500 + (i * 20)
      }))
    });
  }

  const since30d = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const since24h = new Date(Date.now() - 24 * 3600 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000);

  try {
    const daily = await db
      .select({
        ts: sql<string>`date_trunc('hour', ${schema.feeEvents.blockTime})`,
        feeLamports: sql<string>`sum(${schema.feeEvents.feeLamports})`,
        feeUsd: sql<number>`coalesce(sum(${schema.feeEvents.feeUsd}), 0)`,
      })
      .from(schema.feeEvents)
      .where(
        and(
          eq(schema.feeEvents.mint, mint),
          gte(schema.feeEvents.blockTime, since30d),
        ),
      )
      .groupBy(sql`date_trunc('hour', ${schema.feeEvents.blockTime})`)
      .orderBy(sql`date_trunc('hour', ${schema.feeEvents.blockTime})`);

    const series: RevenuePoint[] = daily.map((d) => ({
      ts: new Date(d.ts).toISOString(),
      feeLamports: Number(d.feeLamports),
      feeUsd: Number(d.feeUsd),
    }));

    const total = series.reduce((a, p) => a + p.feeUsd, 0);
    const fee24h = series
      .filter((p) => new Date(p.ts) >= since24h)
      .reduce((a, p) => a + p.feeUsd, 0);
    const fee7d = series
      .filter((p) => new Date(p.ts) >= since7d)
      .reduce((a, p) => a + p.feeUsd, 0);
    const projected = (fee7d / 7) * 30;

    const payload: RevenueSummary = {
      mint,
      totalFeeUsd: total,
      fee24hUsd: fee24h,
      fee7dUsd: fee7d,
      projected30dUsd: projected,
      series,
    };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
