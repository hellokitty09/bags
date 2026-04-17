import { env } from "./env";
import { cached } from "./redis";
import type {
  Mint,
  TokenOverview,
  HolderEntry,
  MarketSignal,
} from "@creator-intel/shared";

const BASE = "https://public-api.birdeye.so";

async function beFetch<T>(path: string): Promise<T> {
  if (!env.BIRDEYE_API_KEY) throw new Error("BIRDEYE_API_KEY missing");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "X-API-KEY": env.BIRDEYE_API_KEY,
      "x-chain": "solana",
      accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Birdeye ${path} ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { success: boolean; data: T };
  if (!json.success) throw new Error(`Birdeye ${path}: not successful`);
  return json.data;
}

interface BeOverview {
  address: string;
  price: number;
  priceChange24hPercent: number;
  v24hUSD: number;
  mc: number;
  holder: number;
  lastTradeUnixTime: number;
}

export async function getTokenOverview(mint: Mint): Promise<TokenOverview> {
  return cached(`birdeye:overview:${mint}`, 60, async () => {
    const data = await beFetch<BeOverview>(
      `/defi/token_overview?address=${mint}`,
    );
    return {
      mint: data.address,
      price: data.price,
      priceChange24h: data.priceChange24hPercent,
      volume24h: data.v24hUSD,
      marketCap: data.mc,
      holders: data.holder,
      updatedAt: new Date(data.lastTradeUnixTime * 1000).toISOString(),
    };
  });
}

interface BeHolderItem {
  owner: string;
  amount: string;
  ui_amount: number;
  percentage: number;
}

function tierOf(sharePct: number): HolderEntry["tier"] {
  if (sharePct >= 5) return "whale";
  if (sharePct >= 1) return "dolphin";
  if (sharePct >= 0.1) return "fish";
  return "shrimp";
}

export async function getTokenHolders(
  mint: Mint,
  limit = 100,
): Promise<HolderEntry[]> {
  return cached(`birdeye:holders:${mint}:${limit}`, 300, async () => {
    const data = await beFetch<{ items: BeHolderItem[] }>(
      `/defi/v3/token/holder?address=${mint}&offset=0&limit=${limit}`,
    );
    return data.items.map((h) => ({
      wallet: h.owner,
      balance: h.ui_amount,
      sharePct: h.percentage,
      tier: tierOf(h.percentage),
    }));
  });
}

interface BeOhlcv {
  items: Array<{
    unixTime: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  }>;
}

export async function getOhlcv(
  mint: Mint,
  type: "1H" | "15m" | "1D" = "1H",
  limit = 24,
): Promise<MarketSignal["ohlcv"]> {
  return cached(`birdeye:ohlcv:${mint}:${type}:${limit}`, 60, async () => {
    const now = Math.floor(Date.now() / 1000);
    const secondsByType = { "15m": 900, "1H": 3600, "1D": 86400 } as const;
    const timeFrom = now - secondsByType[type] * limit;
    const data = await beFetch<BeOhlcv>(
      `/defi/ohlcv?address=${mint}&type=${type}&time_from=${timeFrom}&time_to=${now}`,
    );
    return data.items.map((c) => ({
      t: c.unixTime,
      o: c.o,
      h: c.h,
      l: c.l,
      c: c.c,
      v: c.v,
    }));
  });
}

export async function getMarketSignal(mint: Mint): Promise<MarketSignal> {
  const [overview, ohlcv] = await Promise.all([
    getTokenOverview(mint),
    getOhlcv(mint, "1H", 24),
  ]);
  const recent = ohlcv.slice(-6);
  const older = ohlcv.slice(-24, -6);
  const recentAvgVol = avg(recent.map((c) => c.v));
  const olderAvgVol = avg(older.map((c) => c.v)) || 1;
  const volumeSpike = recentAvgVol / olderAvgVol;

  const buys = recent.filter((c) => c.c >= c.o).reduce((a, c) => a + c.v, 0);
  const sells = recent.filter((c) => c.c < c.o).reduce((a, c) => a + c.v, 0);
  const total = buys + sells || 1;

  let priceAlert: MarketSignal["priceAlert"] = "none";
  if (overview.priceChange24h > 20) priceAlert = "pump";
  else if (overview.priceChange24h < -15) priceAlert = "dump";

  return {
    mint,
    buyPressurePct: (buys / total) * 100,
    sellPressurePct: (sells / total) * 100,
    volumeSpike,
    priceAlert,
    ohlcv,
  };
}

function avg(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
