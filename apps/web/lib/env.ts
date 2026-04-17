import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().min(1),
  PRIVY_APP_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1).optional(),
  BAGS_API_KEY: z.string().min(1).optional(),
  BAGS_API_BASE: z.string().url().default("https://public-api-v2.bags.fm/api/v1"),
  BIRDEYE_API_KEY: z.string().min(1).optional(),
  HELIUS_API_KEY: z.string().min(1).optional(),
  HELIUS_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  ML_SERVICE_URL: z.string().url().default("http://localhost:8000"),
  ML_SERVICE_TOKEN: z.string().min(1).optional(),
});

export const env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  BAGS_API_KEY: process.env.BAGS_API_KEY,
  BAGS_API_BASE: process.env.BAGS_API_BASE,
  BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
  HELIUS_API_KEY: process.env.HELIUS_API_KEY,
  HELIUS_WEBHOOK_SECRET: process.env.HELIUS_WEBHOOK_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL,
  ML_SERVICE_TOKEN: process.env.ML_SERVICE_TOKEN,
});
