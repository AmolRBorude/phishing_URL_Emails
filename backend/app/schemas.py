"""Request bodies and the documents stored in MongoDB.

The email body is NOT stored. Only the subject and sender are kept with a scan.
"""
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ---------- requests ----------
class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UrlIn(BaseModel):
    url: str = Field(max_length=2048)

    @field_validator("url")
    @classmethod
    def must_be_http(cls, v: str) -> str:
        v = v.strip()
        if not v.lower().startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        return v


class EmailIn(BaseModel):
    sender: EmailStr
    receiver: str = ""
    subject: str = Field(default="", max_length=500)
    body: str = Field(min_length=1, max_length=50000)


# ---------- MongoDB documents ----------
class UserDoc(BaseModel):
    name: str
    email: str
    password_hash: str  # never store plain passwords
    role: Literal["User", "Admin"] = "User"
    created_at: datetime = Field(default_factory=utcnow)


class Indicator(BaseModel):
    label: str
    value: str | int | float
    status: Literal["ok", "warn", "danger"]
    hint: str | None = None


class ScanDoc(BaseModel):
    user_id: str
    type: Literal["URL", "EMAIL"]
    input: str                      # the URL, or the email subject
    sender: str | None = None       # email scans only
    prediction: Literal["Phishing", "Legitimate"]
    score: int = Field(ge=0, le=100)
    risk_level: Literal["Safe", "Low", "Medium", "High", "Critical"]
    confidence: float = Field(ge=0, le=1)
    url_score: int | None = None
    email_score: int | None = None
    indicators: list[Indicator] = []
    created_at: datetime = Field(default_factory=utcnow)
