"""Password hashing (scrypt, standard library) and login tokens (JWT)."""
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt

from .config import settings

_ALGO = "HS256"


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split("$")
        digest = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt_hex), n=2**14, r=8, p=1)
        return hmac.compare_digest(digest.hex(), digest_hex)
    except ValueError:
        return False


def create_token(user_id: str, role: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    return jwt.encode({"sub": user_id, "role": role, "exp": exp}, settings.jwt_secret, algorithm=_ALGO)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[_ALGO])
