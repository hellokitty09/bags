import Redis from "ioredis";
import { env } from "./env";

const globalForRedis = globalThis as unknown as {
  redis?: Redis | null;
  redisSub?: Redis;
};

function createClient(): Redis | null {
  try {
    const client = new Redis(env.REDIS_URL, {
      lazyConnect: true, // don't connect on import
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      connectTimeout: 3000,
    });
    // Swallow connection errors so they don't crash the process
    client.on("error", () => {});
    return client;
  } catch {
    return null;
  }
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined
    ? globalForRedis.redis
    : (globalForRedis.redis = createClient());

export function makeSubscriber(): Redis | null {
  try {
    const client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });
    client.on("error", () => {});
    return client;
  } catch {
    return null;
  }
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  if (!redis) return loader();
  try {
    const hit = await redis.get(key);
    if (hit) {
      try {
        return JSON.parse(hit) as T;
      } catch {
        // corrupt cache — fall through
      }
    }
    const value = await loader();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds).catch(() => {});
    return value;
  } catch {
    // Redis unavailable — serve uncached
    return loader();
  }
}

export function feedChannel(mint: string) {
  return `feed:${mint}`;
}
