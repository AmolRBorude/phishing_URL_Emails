# PhishGuard AI backend (FastAPI + MongoDB)

Included: MongoDB setup, register/login, analyze URL/email routes, scan history.
Not included: the two AI models. Connect them in `app/services/predictors.py`.

## Run
    docker compose up -d                                   # local MongoDB (or use Atlas in .env)
    python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env                                   # set JWT_SECRET and ADMIN_EMAILS
    uvicorn app.main:app --reload --port 8000

Docs and manual testing: http://localhost:8000/docs

## Routes
| Method | Path | Needs login | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | create account, returns `{token, user}` |
| POST | /api/auth/login | no | returns `{token, user}` |
| POST | /api/analyze/url | yes | body `{url}` |
| POST | /api/analyze/email | yes | body `{sender, receiver, subject, body}` |
| GET | /api/scans | yes | your scans (admins see all) |
| GET | /api/health | no | database check |

Analyze routes return 503 with a clear message until the models are connected.

## Connecting your models
In `app/services/predictors.py`, replace the two `raise ModelNotConnected(...)` lines with a call to your model and return
`{"score": 0-100, "confidence": 0-1, "indicators": [...]}`. Everything else (risk level, saving, API response) is already done.

## Notes
- Passwords are hashed (scrypt). Tokens are JWT; change `JWT_SECRET`.
- Emails listed in `ADMIN_EMAILS` become Admin when they register.
- The email body is never saved.
