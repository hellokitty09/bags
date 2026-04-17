import { env } from "./env";
import { cached } from "./redis";
import type { TokenMetadata, Wallet, Mint } from "@creator-intel/shared";

async function bagsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.BAGS_API_KEY) {
    throw new Error("BAGS_API_KEY missing");
  }
  const res = await fetch(`${env.BAGS_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.BAGS_API_KEY}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Bags ${path} ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

interface BagsCreator {
  wallet: string;
  displayName?: string;
  twitter?: string;
  tokens: Array<{
    mint: string;
    symbol: string;
    name: string;
    decimals?: number;
    creatorFeeBps?: number;
    launchedAt?: string;
  }>;
}

export async function getCreatorByWallet(wallet: Wallet): Promise<BagsCreator> {
  return cached(`bags:creator:${wallet}`, 300, () =>
    bagsFetch<BagsCreator>(`/creators/${wallet}`),
  );
}

export async function getTokenMetadata(mint: Mint): Promise<TokenMetadata> {
  return cached(`bags:token:${mint}`, 600, async () => {
    const raw = await bagsFetch<{
      mint: string;
      symbol: string;
      name: string;
      decimals: number;
      creatorFeeBps: number;
      creatorWallet: string;
      launchedAt?: string;
    }>(`/tokens/${mint}`);
    return {
      mint: raw.mint,
      symbol: raw.symbol,
      name: raw.name,
      decimals: raw.decimals,
      creatorFeeBps: raw.creatorFeeBps,
      creatorWallet: raw.creatorWallet,
      launchedAt: raw.launchedAt ?? null,
    };
  });
}
