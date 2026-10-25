"""Risk bands. Keep in sync with src/utils/riskUtils.js in the frontend."""
BANDS = [(20, "Safe"), (40, "Low"), (60, "Medium"), (80, "High"), (100, "Critical")]
PHISHING_THRESHOLD = 50


def risk_level(score: int) -> str:
    for upper, level in BANDS:
        if score <= upper:
            return level
    return "Critical"


def prediction(score: int) -> str:
    return "Phishing" if score >= PHISHING_THRESHOLD else "Legitimate"
