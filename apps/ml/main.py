from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException

from data.loader import close_pool, init_pool
from routers import insights

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_pool(os.environ["DATABASE_URL"])
    yield
    await close_pool()


async def verify_token(authorization: str | None = Header(default=None)) -> None:
    expected = os.environ.get("ML_SERVICE_TOKEN")
    if not expected:
        return
    if authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="unauthorized")


app = FastAPI(title="creator-intel-ml", version="0.1.0", lifespan=lifespan)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(
    insights.router,
    prefix="/insights",
    tags=["insights"],
    dependencies=[Depends(verify_token)],
)
