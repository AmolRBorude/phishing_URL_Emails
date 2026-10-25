from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError

from ..db import get_db
from ..deps import current_user
from ..schemas import EmailIn, ScanDoc, UrlIn
from ..services import predictors
from ..services.risk import prediction, risk_level

router = APIRouter(prefix="/api", tags=["scans"])


def scan_out(doc: dict) -> dict:
    """MongoDB document -> JSON the frontend reads (see normalizeScan in src/utils/analysisUtils.js)."""
    return {
        "id": str(doc["_id"]),
        "type": doc["type"],
        "input": doc["input"],
        "prediction": doc["prediction"],
        "score": doc["score"],
        "confidence": doc["confidence"],
        "date": doc["created_at"].isoformat(),
        "urlScore": doc.get("url_score"),
        "emailScore": doc.get("email_score"),
        "indicators": doc.get("indicators", []),
    }


async def _save(user: dict, kind: str, text: str, sender: str | None, result: dict) -> dict:
    try:
        score = int(round(result["score"]))
        doc = ScanDoc(
            user_id=user["id"], type=kind, input=text, sender=sender,
            prediction=prediction(score), score=score, risk_level=risk_level(score),
            confidence=result["confidence"], indicators=result.get("indicators", []),
            url_score=score if kind == "URL" else None,
            email_score=score if kind == "EMAIL" else None,
        ).model_dump()
    except (KeyError, ValidationError, TypeError, ValueError):
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "The model returned an invalid result.")
    inserted = await get_db().scans.insert_one(doc)
    doc["_id"] = inserted.inserted_id
    return scan_out(doc)


@router.post("/analyze/url")
async def analyze_url(data: UrlIn, user: dict = Depends(current_user)):
    try:
        result = predictors.predict_url(data.url)
    except predictors.ModelNotConnected as e:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, str(e))
    return await _save(user, "URL", data.url, None, result)


@router.post("/analyze/email")
async def analyze_email(data: EmailIn, user: dict = Depends(current_user)):
    try:
        result = predictors.predict_email(data.sender, data.receiver, data.subject, data.body)
    except predictors.ModelNotConnected as e:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, str(e))
    # The body is used for the prediction only and is not saved.
    return await _save(user, "EMAIL", data.subject.strip() or data.sender, data.sender, result)


@router.get("/scans")
async def list_scans(user: dict = Depends(current_user)):
    query = {} if user["role"] == "Admin" else {"user_id": user["id"]}
    cursor = get_db().scans.find(query).sort("created_at", -1).limit(500)
    return [scan_out(d) async for d in cursor]
