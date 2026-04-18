import { NextRequest } from "next/server";
import { feedChannel, makeSubscriber } from "@/lib/redis";
import { sseHeaders, sseStream } from "@/lib/sse";
import type { TxEvent } from "@creator-intel/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint");
  if (!mint) return new Response("mint required", { status: 400 });

  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    const stream = sseStream<TxEvent>({
      async subscribe(push) {
        const interval = setInterval(() => {
          const isBuy = Math.random() > 0.4;
          push({
            signature: "sig_" + Math.random().toString(36).slice(2),
            mint, kind: isBuy ? "buy" : "sell",
            amount: Math.floor(Math.random() * 5000000) + 100000,
            amountUsd: Math.random() * 2500 + 50,
            fromWallet: "Sender" + Math.random().toString(36).slice(2, 6),
            toWallet: "Recv" + Math.random().toString(36).slice(2, 6),
            blockTime: new Date().toISOString()
          });
        }, 1500);
        return () => clearInterval(interval);
      }
    });
    const res = new Response(stream, { headers: sseHeaders });
    req.signal.addEventListener("abort", () => { try { stream.cancel(); } catch {} });
    return res;
  }

  const sub = makeSubscriber();

  // If Redis is unavailable, return a heartbeat-only stream (no crash)
  if (!sub) {
    const stream = sseStream<TxEvent>({ subscribe: async () => () => {} });
    return new Response(stream, { headers: sseHeaders });
  }

  const stream = sseStream<TxEvent>({
    async subscribe(push) {
      try {
        await sub.subscribe(feedChannel(mint));
        sub.on("message", (_chan, message) => {
          try { push(JSON.parse(message) as TxEvent); } catch {}
        });
      } catch {
        // Redis subscribe failed — stream stays open, just no events
      }
      return () => {
        sub.unsubscribe().catch(() => {});
        sub.quit().catch(() => {});
      };
    },
  });

  const res = new Response(stream, { headers: sseHeaders });

  req.signal.addEventListener("abort", () => {
    try {
      stream.cancel();
    } catch {}
  });

  return res;
}
