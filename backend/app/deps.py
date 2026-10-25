from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError

from .db import get_db
from .security import decode_token

_bearer = HTTPBearer(auto_error=False)


async def current_user(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict:
    unauthorized = HTTPException(status.HTTP_401_UNAUTHORIZED, "Please sign in again.")
    if creds is None:
        raise unauthorized
    try:
        user_id = decode_token(creds.credentials)["sub"]
        user = await get_db().users.find_one({"_id": ObjectId(user_id)})
    except (PyJWTError, KeyError, InvalidId):
        raise unauthorized
    if user is None:
        raise unauthorized
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"], "role": user["role"]}
