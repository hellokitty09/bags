import Redis from "ioredis";
import { env } from "./env";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
  redisSub?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });

export function makeSubscriber(): Redis {
  return new Redis(env.REDIS_URL, {
    lazyConnect: false,
    maxRetriesPerRequest: null,
  });
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const hit = await redis.get(key);
  if (hit) {
    try {
      return JSON.parse(hit) as T;
    } catch {
      // fall through on corrupt cache
    }
  }
  const value = await loader();
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  return value;
}

export function feedChannel(mint: string) {
  return `feed:${mint}`;
}
