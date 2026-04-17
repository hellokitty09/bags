from datetime import datetime, timezone

from models.timing import score_timing, summarize


def ev(ts: datetime, kind: str = "buy", amount: float = 1.0) -> dict:
    return {
        "signature": f"sig-{ts.isoformat()}",
        "kind": kind,
        "amount": amount,
        "amount_usd": amount,
        "block_time": ts,
    }


def test_empty_returns_no_windows():
    assert score_timing([]) == []
    assert "Not enough" in summarize([])


def test_skews_toward_busy_window():
    events = []
    # 100 buys Tuesday 14:00 UTC (weekday=1 → JS Tue=2)
    for i in range(100):
        events.append(
            ev(datetime(2026, 1, 6, 14, i % 60, tzinfo=timezone.utc), amount=10)
        )
    # 1 buy Saturday 03:00
    events.append(ev(datetime(2026, 1, 10, 3, 0, tzinfo=timezone.utc), amount=10))

    windows = score_timing(events, top_n=1)
    assert len(windows) == 1
    assert windows[0].day_of_week == 2  # Tue (JS-style Sun=0)
    assert windows[0].hour_utc == 14
    assert windows[0].baseline_multiplier > 10


def test_ignores_non_buy_events():
    events = [
        ev(datetime(2026, 1, 6, 14, 0, tzinfo=timezone.utc), kind="sell", amount=999)
    ]
    assert score_timing(events) == []
