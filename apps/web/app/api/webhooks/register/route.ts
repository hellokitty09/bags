import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/privy";
import { registerWebhook } from "@/lib/helius";
import { env } from "@/lib/env";
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

  if (!env.HELIUS_API_KEY) {
    return NextResponse.json({ error: "HELIUS_API_KEY not configured" }, { status: 503 });
  }

  try {
    const result = await registerWebhook({
      webhookUrl: `${env.NEXT_PUBLIC_APP_URL}/api/webhooks/helius`,
      accountAddresses: [parsed.data.mint],
      transactionTypes: ["SWAP", "TRANSFER"],
      authHeader: env.HELIUS_WEBHOOK_SECRET,
    });

    return NextResponse.json({ ok: true, webhookId: result.webhookID });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 502 },
    );
  }
}
