from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from data.loader import load_tx_events
from models.timing import score_timing, summarize, classify_regime

router = APIRouter()


class TimingRequest(BaseModel):
    mint: str


class TimingWindowDTO(BaseModel):
    dayOfWeek: int
    hourUtc: int
    score: float
    baselineMultiplier: float


class RegimeDTO(BaseModel):
    regime: str
    confidence: float
    description: str


class TimingResponse(BaseModel):
    mint: str
    bestWindows: list[TimingWindowDTO]
    summary: str
    regime: RegimeDTO
    generatedAt: str


@router.post("/timing", response_model=TimingResponse)
async def timing_insight(req: TimingRequest) -> TimingResponse:
    events = await load_tx_events(req.mint, days=30)
    windows = score_timing(events, top_n=3)
    regime = classify_regime(events)
    summary = summarize(windows, regime)

    return TimingResponse(
        mint=req.mint,
        bestWindows=[
            TimingWindowDTO(
                dayOfWeek=w.day_of_week,
                hourUtc=w.hour_utc,
                score=w.score,
                baselineMultiplier=w.baseline_multiplier,
            )
            for w in windows
        ],
        summary=summary,
        regime=RegimeDTO(
            regime=regime.regime,
            confidence=regime.confidence,
            description=regime.description,
        ),
        generatedAt=datetime.now(tz=timezone.utc).isoformat(),
    )
