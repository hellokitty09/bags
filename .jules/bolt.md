## 2024-07-14 - Optimize Number Formatting
**Learning:** Instantiating `Intl.NumberFormat` per render call significantly hurts performance in high-frequency React components like `ActivityFeed` (frequently updating stream) and `RevenueSparkline` (charts plotting multiple points).
**Action:** Always cache and reuse `Intl.NumberFormat` instances using string-based Map keys (e.g. `usd-compact-2`) instead of dynamic instantiations per function call. Use template literals over `JSON.stringify` for cache keys.
