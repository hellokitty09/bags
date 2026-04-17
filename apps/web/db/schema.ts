import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  doublePrecision,
  jsonb,
  primaryKey,
  index,
  serial,
} from "drizzle-orm/pg-core";

export const creators = pgTable("creators", {
  wallet: text("wallet").primaryKey(),
  privyId: text("privy_id").notNull(),
  displayName: text("display_name"),
  twitterHandle: text("twitter_handle"),
  role: text("role", { enum: ["creator", "trader"] }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tokens = pgTable(
  "tokens",
  {
    mint: text("mint").primaryKey(),
    creatorWallet: text("creator_wallet")
      .notNull()
      .references(() => creators.wallet, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    name: text("name").notNull(),
    decimals: integer("decimals").notNull().default(9),
    creatorFeeBps: integer("creator_fee_bps").notNull().default(0),
    launchedAt: timestamp("launched_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    creatorIdx: index("tokens_creator_idx").on(t.creatorWallet),
  }),
);

export const holderSnapshots = pgTable(
  "holder_snapshots",
  {
    id: serial("id").primaryKey(),
    mint: text("mint")
      .notNull()
      .references(() => tokens.mint, { onDelete: "cascade" }),
    takenAt: timestamp("taken_at", { withTimezone: true }).defaultNow().notNull(),
    holderCount: integer("holder_count").notNull(),
    top10Pct: doublePrecision("top10_pct").notNull(),
    whaleCount: integer("whale_count").notNull(),
    gini: doublePrecision("gini").notNull(),
  },
  (t) => ({
    mintTakenAtIdx: index("holder_snapshots_mint_taken_at_idx").on(t.mint, t.takenAt),
  }),
);

export const holders = pgTable(
  "holders",
  {
    mint: text("mint")
      .notNull()
      .references(() => tokens.mint, { onDelete: "cascade" }),
    wallet: text("wallet").notNull(),
    balance: doublePrecision("balance").notNull(),
    firstSeen: timestamp("first_seen", { withTimezone: true }).defaultNow().notNull(),
    lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.mint, t.wallet] }),
    mintBalanceIdx: index("holders_mint_balance_idx").on(t.mint, t.balance),
  }),
);

export const feeEvents = pgTable(
  "fee_events",
  {
    id: serial("id").primaryKey(),
    mint: text("mint")
      .notNull()
      .references(() => tokens.mint, { onDelete: "cascade" }),
    signature: text("signature").notNull().unique(),
    amountLamports: bigint("amount_lamports", { mode: "bigint" }).notNull(),
    feeLamports: bigint("fee_lamports", { mode: "bigint" }).notNull(),
    feeUsd: doublePrecision("fee_usd"),
    blockTime: timestamp("block_time", { withTimezone: true }).notNull(),
  },
  (t) => ({
    mintTimeIdx: index("fee_events_mint_time_idx").on(t.mint, t.blockTime),
  }),
);

export const txEvents = pgTable(
  "tx_events",
  {
    signature: text("signature").primaryKey(),
    mint: text("mint")
      .notNull()
      .references(() => tokens.mint, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    fromWallet: text("from_wallet"),
    toWallet: text("to_wallet"),
    amount: doublePrecision("amount").notNull(),
    amountUsd: doublePrecision("amount_usd"),
    blockTime: timestamp("block_time", { withTimezone: true }).notNull(),
    raw: jsonb("raw"),
  },
  (t) => ({
    mintTimeIdx: index("tx_events_mint_time_idx").on(t.mint, t.blockTime),
  }),
);

export const insightsCache = pgTable("insights_cache", {
  mint: text("mint").primaryKey(),
  payload: jsonb("payload").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Creator = typeof creators.$inferSelect;
export type Token = typeof tokens.$inferSelect;
export type HolderSnapshot = typeof holderSnapshots.$inferSelect;
export type Holder = typeof holders.$inferSelect;
export type FeeEvent = typeof feeEvents.$inferSelect;
export type TxEventRow = typeof txEvents.$inferSelect;
