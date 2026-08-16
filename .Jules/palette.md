## 2024-05-15 - [Bypassing Auth for Playwright Verification]
**Learning:** For local development and UI testing without valid Privy authentication credentials, appending `?demo=true` to the local URL sets a `demo_mode=true` cookie that bypasses the login gate.
**Action:** In Playwright verification scripts, bypass authentication by programmatically adding this cookie before navigation: `page.context.add_cookies([{"name": "demo_mode", "value": "true", "domain": "localhost", "path": "/"}])`.
