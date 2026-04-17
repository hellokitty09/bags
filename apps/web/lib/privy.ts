import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
import { env } from "./env";

let _client: PrivyClient | null = null;
function privy(): PrivyClient {
  if (!env.NEXT_PUBLIC_PRIVY_APP_ID || !env.PRIVY_APP_SECRET) {
    throw new Error("Privy env vars missing");
  }
  if (!_client) {
    _client = new PrivyClient(env.NEXT_PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);
  }
  return _client;
}

export interface Session {
  privyId: string;
  wallet: string | null;
  email: string | null;
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get("privy-token")?.value ?? jar.get("privy-id-token")?.value;
  if (!token) return null;
  try {
    const claims = await privy().verifyAuthToken(token);
    const user = await privy().getUser(claims.userId);
    const wallet =
      user.linkedAccounts.find((a) => a.type === "wallet")?.address ?? null;
    const email =
      user.linkedAccounts.find((a) => a.type === "email")?.address ?? null;
    return { privyId: user.id, wallet, email };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Response("Unauthorized", { status: 401 });
  return s;
}
