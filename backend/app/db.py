"""MongoDB connection and indexes (PyMongo async client).

Collections
  users  one document per account
  scans  one document per URL or email analysis
"""
from pymongo import ASCENDING, DESCENDING, AsyncMongoClient

from .config import settings

_client: AsyncMongoClient | None = None


def get_db():
    if _client is None:
        raise RuntimeError("Database is not connected. Call connect() first.")
    return _client[settings.mongodb_db]


async def create_indexes() -> None:
    db = get_db()
    await db.users.create_index([("email", ASCENDING)], unique=True)
    await db.scans.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
    await db.scans.create_index([("type", ASCENDING)])
    await db.scans.create_index([("prediction", ASCENDING)])
    await db.scans.create_index([("risk_level", ASCENDING)])


async def connect() -> None:
    global _client
    _client = AsyncMongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
    await _client.admin.command("ping")  # fails fast if MongoDB is not reachable
    await create_indexes()


async def close() -> None:
    global _client
    if _client is not None:
        await _client.close()
        _client = None
