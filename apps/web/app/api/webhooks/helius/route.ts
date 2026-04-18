import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { db, schema } from "@/lib/db";
import { feedChannel, redis } from "@/lib/redis";
import { normalizeTx, type HeliusEnhancedTx } from "@/lib/helius";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (env.HELIUS_WEBHOOK_SECRET && auth !== env.HELIUS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await req.json()) as HeliusEnhancedTx[];
  if (!Array.isArray(payload)) {
    return NextResponse.json({ error: "expected array" }, { status: 400 });
  }

  const tracked = new Set(
    (await db.select({ mint: schema.tokens.mint }).from(schema.tokens)).map(
      (r) => r.mint,
    ),
  );

  let ingested = 0;

  for (const raw of payload) {
    const mints = new Set(
      (raw.tokenTransfers ?? []).map((t) => t.mint).filter((m) => tracked.has(m)),
    );
    for (const mint of mints) {
      const event = normalizeTx(mint, raw);
      if (!event) continue;

      try {
        await db
          .insert(schema.txEvents)
          .values({
            signature: event.signature,
            mint,
            kind: event.kind,
            fromWallet: event.fromWallet,
            toWallet: event.toWallet,
            amount: event.amount,
            amountUsd: event.amountUsd ?? null,
            blockTime: new Date(event.blockTime),
            raw: raw as unknown as object,
          })
          .onConflictDoNothing();

        if (raw.fee && raw.fee > 0) {
          await db
            .insert(schema.feeEvents)
            .values({
              mint,
              signature: event.signature,
              amountLamports: BigInt(Math.round(event.amount * 1e9)),
              feeLamports: BigInt(raw.fee),
              feeUsd: null,
              blockTime: new Date(event.blockTime),
            })
            .onConflictDoNothing();
        }

        await redis?.publish(feedChannel(mint), JSON.stringify(event));
        ingested++;
      } catch (err) {
        console.error("helius ingest error", err);
      }
    }
  }

  return NextResponse.json({ ok: true, ingested });
}
