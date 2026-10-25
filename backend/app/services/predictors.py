"""The ONLY place where the AI models plug in.

Each function must return a dict:
    {
      "score": int 0-100,          # phishing risk, higher = more likely phishing
      "confidence": float 0-1,
      "indicators": [              # shown as cards on the Result page (can be empty)
        {"label": "HTTPS", "value": "No", "status": "danger", "hint": "optional text"}
      ],
    }
status is one of: "ok", "warn", "danger".

Until the models are connected both functions raise ModelNotConnected, and the API answers with a clear 503.
"""


class ModelNotConnected(Exception):
    pass


def predict_url(url: str) -> dict:
    # TODO: call your CNN + BiLSTM model here.
    raise ModelNotConnected("The URL model (CNN + BiLSTM) is not connected yet.")


def predict_email(sender: str, receiver: str, subject: str, body: str) -> dict:
    # TODO: call your Transformer / LLM here.
    raise ModelNotConnected("The email model (Transformer / LLM) is not connected yet.")
