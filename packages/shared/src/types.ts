export type Mint = string;
export type Wallet = string;

export interface TokenMetadata {
  mint: Mint;
  symbol: string;
  name: string;
  decimals: number;
  launchedAt: string | null;
  creatorFeeBps: number;
  creatorWallet: Wallet;
}

export interface TokenOverview {
  mint: Mint;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  updatedAt: string;
}

export interface HolderEntry {
  wallet: Wallet;
  balance: number;
  sharePct: number;
  tier: "shrimp" | "fish" | "dolphin" | "whale";
}

export interface HolderAnalytics {
  mint: Mint;
  totalHolders: number;
  top10SharePct: number;
  whaleCount: number;
  gini: number;
  entries: HolderEntry[];
  newHolders24h: number;
  returningHolders24h: number;
}

export interface RevenuePoint {
  ts: string;
  feeLamports: number;
  feeUsd: number;
}

export interface RevenueSummary {
  mint: Mint;
  totalFeeUsd: number;
  fee24hUsd: number;
  fee7dUsd: number;
  projected30dUsd: number;
  series: RevenuePoint[];
}

export type TxKind = "buy" | "sell" | "transfer" | "mint" | "burn" | "unknown";

export interface TxEvent {
  signature: string;
  mint: Mint;
  kind: TxKind;
  fromWallet: Wallet | null;
  toWallet: Wallet | null;
  amount: number;
  amountUsd: number | null;
  blockTime: string;
}

export interface MarketSignal {
  mint: Mint;
  buyPressurePct: number;
  sellPressurePct: number;
  volumeSpike: number;
  priceAlert: "none" | "pump" | "dump";
  ohlcv: Array<{ t: number; o: number; h: number; l: number; c: number; v: number }>;
}

export interface TimingInsight {
  mint: Mint;
  bestWindows: Array<{
    dayOfWeek: number;
    hourUtc: number;
    score: number;
    baselineMultiplier: number;
  }>;
  summary: string;
  generatedAt: string;
}
