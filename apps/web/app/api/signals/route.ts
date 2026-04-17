import { NextRequest, NextResponse } from "next/server";
import { getMarketSignal, getTokenOverview } from "@/lib/birdeye";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint");
  if (!mint) return NextResponse.json({ error: "mint required" }, { status: 400 });

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    return NextResponse.json({
      signal: {
        buyPressurePct: 65.4,
        sellPressurePct: 34.6,
        volumeSpike: 3.2,
        priceAlert: "pump",
        ohlcv: Array.from({length: 24}, (_, i) => ({ t: Date.now() - (24-i)*3600000, o: 0.03, h: 0.04, l: 0.02, c: 0.034 + Math.random() * 0.01, v: 100000 }))
      },
      overview: { mint, price: 0.0352, priceChange24h: 12.4, volume24h: 1240000, marketCap: 34000000, holders: 142503 }
    });
  }

  try {
    const [signal, overview] = await Promise.all([
      getMarketSignal(mint),
      getTokenOverview(mint),
    ]);
    return NextResponse.json({ signal, overview });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
