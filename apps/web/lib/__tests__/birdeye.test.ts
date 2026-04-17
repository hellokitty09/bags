import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../env", () => ({
  env: {
    BIRDEYE_API_KEY: "test-key",
    DATABASE_URL: "postgres://x",
    REDIS_URL: "redis://x",
    BAGS_API_BASE: "https://x",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    ML_SERVICE_URL: "http://localhost:8000",
  },
}));

vi.mock("../redis", () => ({
  redis: {},
  makeSubscriber: () => ({}),
  feedChannel: (m: string) => `feed:${m}`,
  cached: async <T>(_k: string, _t: number, loader: () => Promise<T>) => loader(),
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("birdeye.getTokenOverview", () => {
  it("maps birdeye payload to shared TokenOverview", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            address: "MINT",
            price: 0.00123,
            priceChange24hPercent: 12.5,
            v24hUSD: 42000,
            mc: 1_000_000,
            holder: 321,
            lastTradeUnixTime: 1_700_000_000,
          },
        }),
      ),
    );
    const { getTokenOverview } = await import("../birdeye");
    const o = await getTokenOverview("MINT");
    expect(o.mint).toBe("MINT");
    expect(o.price).toBeCloseTo(0.00123);
    expect(o.holders).toBe(321);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe("birdeye.getMarketSignal", () => {
  it("computes buy/sell pressure from ohlcv", async () => {
    const now = Math.floor(Date.now() / 1000);
    const candles = Array.from({ length: 24 }, (_, i) => ({
      unixTime: now - (24 - i) * 3600,
      o: 1,
      h: 1.1,
      l: 0.9,
      c: i >= 18 ? 1.2 : 0.9,
      v: i >= 18 ? 100 : 10,
    }));

    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const u = String(url);
      if (u.includes("ohlcv")) {
        return new Response(
          JSON.stringify({ success: true, data: { items: candles } }),
        );
      }
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            address: "MINT",
            price: 1.2,
            priceChange24hPercent: 30,
            v24hUSD: 1,
            mc: 1,
            holder: 1,
            lastTradeUnixTime: now,
          },
        }),
      );
    });

    const { getMarketSignal } = await import("../birdeye");
    const s = await getMarketSignal("MINT");
    expect(s.buyPressurePct).toBeGreaterThan(s.sellPressurePct);
    expect(s.volumeSpike).toBeGreaterThan(2);
    expect(s.priceAlert).toBe("pump");
  });
});
