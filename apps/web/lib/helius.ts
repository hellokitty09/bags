import { env } from "./env";
import type { Mint, TxEvent, TxKind } from "@creator-intel/shared";

const RPC = () => `https://mainnet.helius-rpc.com/?api-key=${env.HELIUS_API_KEY}`;
const API = () => `https://api.helius.xyz/v0`;

export async function registerWebhook(opts: {
  webhookUrl: string;
  accountAddresses: string[];
  transactionTypes?: string[];
  authHeader?: string;
}) {
  if (!env.HELIUS_API_KEY) throw new Error("HELIUS_API_KEY missing");
  const res = await fetch(
    `${API()}/webhooks?api-key=${env.HELIUS_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        webhookURL: opts.webhookUrl,
        accountAddresses: opts.accountAddresses,
        transactionTypes: opts.transactionTypes ?? ["ANY"],
        webhookType: "enhanced",
        authHeader: opts.authHeader,
      }),
    },
  );
  if (!res.ok) throw new Error(`Helius register ${res.status}: ${await res.text()}`);
  return res.json() as Promise<{ webhookID: string }>;
}

export async function listWebhooks() {
  const res = await fetch(`${API()}/webhooks?api-key=${env.HELIUS_API_KEY}`);
  if (!res.ok) throw new Error(`Helius list ${res.status}`);
  return res.json() as Promise<Array<{ webhookID: string; webhookURL: string }>>;
}

export async function deleteWebhook(id: string) {
  const res = await fetch(
    `${API()}/webhooks/${id}?api-key=${env.HELIUS_API_KEY}`,
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error(`Helius delete ${res.status}`);
}

interface HeliusTokenAccount {
  address: string;
  owner: string;
  amount: number;
  decimals: number;
}

export async function getTokenAccounts(mint: Mint): Promise<HeliusTokenAccount[]> {
  const all: HeliusTokenAccount[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(RPC(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ci",
        method: "getTokenAccounts",
        params: { mint, page, limit: 1000 },
      }),
    });
    if (!res.ok) throw new Error(`Helius rpc ${res.status}`);
    const json = (await res.json()) as {
      result?: { token_accounts: HeliusTokenAccount[]; total: number };
    };
    const items = json.result?.token_accounts ?? [];
    if (items.length === 0) break;
    all.push(...items);
    if (items.length < 1000) break;
    page += 1;
    if (page > 20) break;
  }
  return all;
}

export interface HeliusEnhancedTx {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  nativeTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers?: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    mint: string;
    tokenAmount: number;
  }>;
  events?: { swap?: unknown; nft?: unknown };
}

export function normalizeTx(mint: Mint, raw: HeliusEnhancedTx): TxEvent | null {
  const tt = (raw.tokenTransfers ?? []).find((t) => t.mint === mint);
  if (!tt) return null;
  const swap = raw.events?.swap !== undefined;

  let kind: TxKind = "transfer";
  if (raw.type === "SWAP" || swap) {
    const solTransfer = raw.nativeTransfers?.find(
      (n) => n.fromUserAccount === tt.toUserAccount,
    );
    kind = solTransfer ? "buy" : "sell";
  } else if (raw.type === "MINT") kind = "mint";
  else if (raw.type === "BURN") kind = "burn";
  else if (raw.type === "TRANSFER") kind = "transfer";
  else kind = "unknown";

  return {
    signature: raw.signature,
    mint,
    kind,
    fromWallet: tt.fromUserAccount ?? null,
    toWallet: tt.toUserAccount ?? null,
    amount: tt.tokenAmount,
    amountUsd: null,
    blockTime: new Date(raw.timestamp * 1000).toISOString(),
  };
}
