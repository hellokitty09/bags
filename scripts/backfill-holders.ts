#!/usr/bin/env tsx
import "dotenv/config";
import { getTokenAccounts } from "../apps/web/lib/helius";
import { getTokenOverview, getTokenHolders } from "../apps/web/lib/birdeye";
import { db, schema } from "../apps/web/lib/db";
import { sql } from "drizzle-orm";

function gini(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  if (sum === 0) return 0;
  let cum = 0;
  for (let i = 0; i < n; i++) cum += (i + 1) * sorted[i]!;
  return (2 * cum) / (n * sum) - (n + 1) / n;
}

async function main() {
  const mint = process.argv[2];
  if (!mint) {
    console.error("usage: backfill-holders.ts <mint>");
    process.exit(1);
  }

  console.log(`[${mint}] fetching holders from Helius…`);
  const accounts = await getTokenAccounts(mint);
  console.log(`[${mint}] got ${accounts.length} token accounts`);

  const byOwner = new Map<string, number>();
  for (const a of accounts) {
    byOwner.set(a.owner, (byOwner.get(a.owner) ?? 0) + a.amount / 10 ** a.decimals);
  }

  const balances = Array.from(byOwner.values());
  const overview = await getTokenOverview(mint);
  const top100 = await getTokenHolders(mint, 100);
  const top10Share = top100.slice(0, 10).reduce((a, h) => a + h.sharePct, 0);
  const whales = top100.filter((h) => h.tier === "whale").length;
  const g = gini(balances);

  await db.insert(schema.holderSnapshots).values({
    mint,
    takenAt: new Date(),
    holderCount: overview.holders,
    top10Pct: top10Share,
    whaleCount: whales,
    gini: Number.isFinite(g) ? g : 0,
  });

  const now = new Date();
  const rows = Array.from(byOwner.entries()).map(([wallet, balance]) => ({
    mint,
    wallet,
    balance,
    firstSeen: now,
    lastSeen: now,
  }));

  if (rows.length > 0) {
    const chunks: (typeof rows)[] = [];
    for (let i = 0; i < rows.length; i += 500) chunks.push(rows.slice(i, i + 500));
    for (const chunk of chunks) {
      await db
        .insert(schema.holders)
        .values(chunk)
        .onConflictDoUpdate({
          target: [schema.holders.mint, schema.holders.wallet],
          set: {
            balance: sql`excluded.balance`,
            lastSeen: sql`excluded.last_seen`,
          },
        });
    }
  }

  console.log(`[${mint}] snapshot written · ${rows.length} holders upserted`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
