import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/privy";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isDemo = req.cookies.get("demo_mode")?.value === "true";

  if (isDemo) {
    return NextResponse.json({
      user: { privyId: "demo-user", wallet: "DemoMode", email: "demo@bags.fm" },
      tokens: [{ mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", symbol: "BONK", name: "BONK" }]
    });
  }

  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  let tokens: { mint: string; symbol: string; name: string }[] = [];

  if (session.wallet) {
    try {
      await db
        .insert(schema.creators)
        .values({ wallet: session.wallet, privyId: session.privyId })
        .onConflictDoNothing();

      tokens = await db
        .select({
          mint: schema.tokens.mint,
          symbol: schema.tokens.symbol,
          name: schema.tokens.name,
        })
        .from(schema.tokens)
        .where(eq(schema.tokens.creatorWallet, session.wallet));
    } catch {
      // DB not ready yet — ignore in dev
    }
  }

  return NextResponse.json({
    user: { privyId: session.privyId, wallet: session.wallet, email: session.email },
    tokens,
  });
}
