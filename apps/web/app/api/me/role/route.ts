import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/privy";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  role: z.enum(["creator", "trader"]),
});

export async function GET(req: NextRequest) {
  const isDemo = req.cookies.get("demo_mode")?.value === "true";
  if (isDemo) {
    return NextResponse.json({ role: "trader", demo: true });
  }

  const session = await getSession();
  if (!session?.wallet) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  try {
    const [row] = await db
      .select({ role: schema.creators.role })
      .from(schema.creators)
      .where(eq(schema.creators.wallet, session.wallet))
      .limit(1);
    return NextResponse.json({ role: row?.role ?? null });
  } catch {
    return NextResponse.json({ role: null });
  }
}

export async function POST(req: NextRequest) {
  const isDemo = req.cookies.get("demo_mode")?.value === "true";
  if (isDemo) {
    return NextResponse.json({ error: "demo_mode_readonly" }, { status: 403 });
  }

  const session = await getSession();
  if (!session?.wallet) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    await db
      .insert(schema.creators)
      .values({
        wallet: session.wallet,
        privyId: session.privyId,
        role: parsed.data.role,
      })
      .onConflictDoUpdate({
        target: schema.creators.wallet,
        set: { role: parsed.data.role },
      });
    return NextResponse.json({ ok: true, role: parsed.data.role });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 },
    );
  }
}
