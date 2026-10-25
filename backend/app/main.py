from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import db
from .config import settings
from .routers import auth, scans


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.connect()
    yield
    await db.close()


app = FastAPI(title="PhishGuard AI API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(scans.router)


@app.get("/api/health")
async def health():
    await db.get_db().command("ping")
    return {"status": "ok", "database": settings.mongodb_db}
