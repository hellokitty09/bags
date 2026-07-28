## 2024-10-10 - Bypassing Privy Auth during Next.js local dev
**Learning:** Bypassing Next.js environment validation via `SKIP_ENV_VALIDATION=true` still fails to start the frontend if `NEXT_PUBLIC_PRIVY_APP_ID` is invalid since the Privy provider fails to initialize.
**Action:** Use a real but dummy valid Privy app ID like `cm2r32xxx0000000000000000` when starting the dev server or tests.
