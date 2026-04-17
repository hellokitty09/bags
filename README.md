# Creator Intel — Bags Terminal

A Bloomberg-style real-time analytics terminal for creators on [Bags.fm].
Built for the Bags App Store launch: holder analytics, fee revenue
tracking, market signals, live on-chain activity, and an AI timing insight.

Stack: **Next.js 16** (App Router) + **FastAPI** (ML) +
**Neon Postgres** + **Upstash Redis** + **Privy** (auth) +
**Birdeye**/**Helius**/**Bags** APIs.

```
apps/
  web/     Next.js dashboard + API routes
  ml/      FastAPI "best time to post" model
packages/
  shared/  TS types shared between web + scripts
scripts/   Helius webhook setup, holder backfill cron
```

## 1. Prereqs

- Node 20+ and `pnpm` 9+
- Python 3.12+
- Accounts / API keys:
  - [Privy] (APP_ID + APP_SECRET)
  - [Bags] public API key
  - [Birdeye] API key (free tier works)
  - [Helius] API key
  - Neon Postgres URL (recommend provisioning via Vercel Marketplace)
  - Upstash Redis URL (same — Vercel Marketplace auto-injects env)

## 2. Install

```bash
pnpm install
cd apps/ml && python -m venv .venv && source .venv/bin/activate \
  && pip install -r requirements.txt && cd -
```

## 3. Configure env

```bash
cp .env.example apps/web/.env.local
cp apps/ml/.env.example apps/ml/.env
# fill in both files
```

## 4. Database

```bash
pnpm db:push      # applies Drizzle schema to Neon
pnpm db:studio    # optional: browse tables
```

## 5. Run

Three processes:

```bash
# terminal 1 — Next.js
pnpm dev

# terminal 2 — FastAPI ML
pnpm ml:dev

# terminal 3 — expose localhost so Helius can POST to your webhook
ngrok http 3000      # copy the https URL into NEXT_PUBLIC_APP_URL, restart web
```

Then register the webhook for the token you want to monitor:

```bash
pnpm webhook:register <MINT_ADDRESS>
```

Optionally seed holder history:

```bash
pnpm holders:backfill <MINT_ADDRESS>
```

Open <http://localhost:3000>, connect your Bags-linked wallet via Privy,
paste a mint address, and the terminal loads.

## 6. Deploy

**Web** — push to a Vercel project:

- Install the Neon and Upstash integrations from the Vercel Marketplace.
  They auto-inject `DATABASE_URL` and `REDIS_URL`.
- Add all other env vars from `.env.example`.
- The `vercel.json` cron schedules `/api/cron/snapshot` every 6 hours.

**ML** — Fly.io or Railway (any container host):

```bash
cd apps/ml && fly launch --dockerfile Dockerfile
# or: railway up
```

Point the web app at the deployed ML URL via `ML_SERVICE_URL`.

## 7. Demo script (2 minutes)

1. Open the dashboard, connect wallet → land on terminal shell.
2. Pick a token from the dropdown — ticker bar populates instantly
   (Birdeye, cached 60s).
3. HolderTreemap renders top 20 wallets colored by whale tier.
4. RevenueSparkline shows fee revenue over the last 30 days.
5. Buy a small amount of the token on Bags → within ~5s the new
   transaction appears in the Activity Feed (Helius webhook → Redis
   pub/sub → SSE).
6. InsightCard shows "Best window: Tue 14:00 UTC · 2.4× baseline" from
   the FastAPI model.

## 8. Tests

```bash
pnpm test                        # Vitest for lib/*
cd apps/ml && pytest              # pytest for timing model
```

## Notes

- The SSE route requires the Node runtime — it uses `ioredis.subscribe`,
  which won't run on the Edge runtime.
- Birdeye responses are cached in Redis (60s for quotes, 5min for
  holders) to stay within the free-tier rate limit.
- The ML insight is intentionally a simple weighted-mean model for v0;
  swap `apps/ml/models/timing.py` for XGBoost once enough tx data exists.

[Bags.fm]: https://bags.fm
[Privy]: https://privy.io
[Bags]: https://dev.bags.fm
[Birdeye]: https://docs.birdeye.so
[Helius]: https://docs.helius.dev
