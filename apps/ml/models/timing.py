from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np

DAYS = 7
HOURS = 24


@dataclass(frozen=True)
class TimingWindow:
    day_of_week: int
    hour_utc: int
    score: float
    baseline_multiplier: float


@dataclass(frozen=True)
class RegimeResult:
    """Market regime classification based on volume + buy/sell dynamics."""
    regime: str          # accumulation | distribution | breakout | consolidation | dormant
    confidence: float    # 0-1 based on sample size
    description: str


def classify_regime(events: list[dict[str, Any]]) -> RegimeResult:
    """Classify token market regime from recent transaction history."""
    if len(events) < 5:
        return RegimeResult(
            regime="dormant",
            confidence=0.0,
            description="Not enough trading history to classify — need more data.",
        )

    buys = [e for e in events if e.get("kind") == "buy"]
    sells = [e for e in events if e.get("kind") == "sell"]
    total = len(buys) + len(sells) or 1

    buy_ratio = len(buys) / total
    buy_volume = sum(float(e.get("amount_usd") or e.get("amount") or 0) for e in buys)
    sell_volume = sum(float(e.get("amount_usd") or e.get("amount") or 0) for e in sells)
    total_volume = buy_volume + sell_volume or 1.0

    # Volume trend: compare last 25% of events to first 25%
    quarter = max(1, len(events) // 4)
    early_vol = sum(float(e.get("amount_usd") or e.get("amount") or 0) for e in events[:quarter])
    late_vol = sum(float(e.get("amount_usd") or e.get("amount") or 0) for e in events[-quarter:])
    vol_trend = late_vol / (early_vol or 1.0)

    # Confidence scales with sample size
    confidence = min(1.0, len(events) / 100)

    # Classification logic
    if buy_ratio > 0.65 and vol_trend > 1.5:
        return RegimeResult(
            regime="breakout",
            confidence=confidence,
            description=f"Strong buy-side dominance ({buy_ratio:.0%}) with {vol_trend:.1f}× volume acceleration — breakout conditions detected.",
        )
    elif buy_ratio > 0.55 and vol_trend > 0.8:
        return RegimeResult(
            regime="accumulation",
            confidence=confidence,
            description=f"Steady buy pressure ({buy_ratio:.0%}) with stable volume — smart money is accumulating.",
        )
    elif buy_ratio < 0.4 and vol_trend > 1.3:
        return RegimeResult(
            regime="distribution",
            confidence=confidence,
            description=f"Selling dominates ({1-buy_ratio:.0%} sells) with rising volume — holders are distributing.",
        )
    elif vol_trend < 0.5 and len(events) < 20:
        return RegimeResult(
            regime="dormant",
            confidence=confidence,
            description="Minimal trading activity — token is in a dormant phase.",
        )
    else:
        return RegimeResult(
            regime="consolidation",
            confidence=confidence,
            description=f"Mixed signals ({buy_ratio:.0%} buys, {vol_trend:.1f}× vol trend) — consolidation range.",
        )


def score_timing(events: list[dict[str, Any]], top_n: int = 3) -> list[TimingWindow]:
    grid = np.zeros((DAYS, HOURS), dtype=float)
    counts = np.zeros((DAYS, HOURS), dtype=float)

    for e in events:
        if e.get("kind") != "buy":
            continue
        ts = e["block_time"]
        dow = ts.weekday()
        dow = (dow + 1) % 7  # python: Mon=0 → JS-style Sun=0
        hour = ts.hour
        weight = float(e.get("amount_usd") or e.get("amount") or 1.0)
        grid[dow][hour] += weight
        counts[dow][hour] += 1

    total = grid.sum()
    if total == 0:
        return []

    baseline = total / (DAYS * HOURS)
    if baseline == 0:
        return []

    flat = []
    for d in range(DAYS):
        for h in range(HOURS):
            v = grid[d][h]
            if v == 0:
                continue
            flat.append(
                TimingWindow(
                    day_of_week=d,
                    hour_utc=h,
                    score=float(v / baseline),
                    baseline_multiplier=float(v / baseline),
                )
            )

    flat.sort(key=lambda w: w.score, reverse=True)
    return flat[:top_n]


def summarize(windows: list[TimingWindow], regime: RegimeResult | None = None) -> str:
    if not windows:
        return "Not enough trading history yet — try again in a few days."
    w = windows[0]
    day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    base = (
        f"Your token sees {w.baseline_multiplier:.1f}× more buy-side activity on "
        f"{day_names[w.day_of_week]} around {w.hour_utc:02d}:00 UTC — post, "
        f"airdrop, or launch campaigns during that window."
    )
    if regime and regime.regime != "dormant":
        base += f" Market regime: {regime.regime}. {regime.description}"
    return base
