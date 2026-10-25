import asyncio

from fastapi import APIRouter, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..config import settings
from ..db import get_db
from ..schemas import LoginIn, RegisterIn, UserDoc
from ..security import create_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _response(user_id: str, name: str, email: str, role: str) -> dict:
    return {"token": create_token(user_id, role), "user": {"name": name, "email": email, "role": role}}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: RegisterIn):
    email = data.email.lower()
    role = "Admin" if email in settings.admin_list else "User"
    doc = UserDoc(name=data.name.strip(), email=email, role=role,
                  password_hash=await asyncio.to_thread(hash_password, data.password))
    try:
        result = await get_db().users.insert_one(doc.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists.")
    return _response(str(result.inserted_id), doc.name, email, role)


@router.post("/login")
async def login(data: LoginIn):
    user = await get_db().users.find_one({"email": data.email.lower()})
    ok = user is not None and await asyncio.to_thread(verify_password, data.password, user["password_hash"])
    if not ok:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password.")
    return _response(str(user["_id"]), user["name"], user["email"], user["role"])
