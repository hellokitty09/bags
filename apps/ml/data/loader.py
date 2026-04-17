from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import asyncpg

_pool: asyncpg.Pool | None = None


async def init_pool(dsn: str) -> None:
    global _pool
    _pool = await asyncpg.create_pool(dsn=dsn, min_size=1, max_size=5)


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


def pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("pool not initialized")
    return _pool


async def load_tx_events(mint: str, days: int = 30) -> list[dict[str, Any]]:
    since = datetime.now(tz=timezone.utc) - timedelta(days=days)
    rows = await pool().fetch(
        """
        select signature, kind, amount, amount_usd, block_time
        from tx_events
        where mint = $1 and block_time >= $2
        """,
        mint,
        since,
    )
    return [dict(r) for r in rows]
