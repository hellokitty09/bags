import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/privy";
import { db, schema } from "@/lib/db";
import { getTokenMetadata } from "@/lib/bags";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const body = z.object({ mint: z.string().min(32) });

export async function POST(req: NextRequest) {
  if (req.cookies.get("demo_mode")?.value === "true") {
    return NextResponse.json({ error: "demo_mode_readonly" }, { status: 403 });
  }

  const session = await getSession();
  if (!session?.wallet) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  try {
    const meta = await getTokenMetadata(parsed.data.mint);
    if (meta.creatorWallet !== session.wallet) {
      return NextResponse.json({ error: "not creator of token" }, { status: 403 });
    }

    await db
      .insert(schema.tokens)
      .values({
        mint: meta.mint,
        creatorWallet: meta.creatorWallet,
        symbol: meta.symbol,
        name: meta.name,
        decimals: meta.decimals,
        creatorFeeBps: meta.creatorFeeBps,
        launchedAt: meta.launchedAt ? new Date(meta.launchedAt) : null,
      })
      .onConflictDoNothing();

    return NextResponse.json({ ok: true, token: meta });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
