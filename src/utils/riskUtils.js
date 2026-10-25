// Risk bands: edit this array to change the classification thresholds everywhere in the UI.
export const RISK_BANDS = [
  { max: 20, level: 'Safe' },
  { max: 40, level: 'Low' },
  { max: 60, level: 'Medium' },
  { max: 80, level: 'High' },
  { max: 100, level: 'Critical' },
];

// Scores at or above this value are labelled "Phishing" in the UI (backend should send its own prediction).
export const PHISHING_THRESHOLD = 50;

export const getRiskLevel = (score) => {
  const s = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  return RISK_BANDS.find((b) => s <= b.max).level;
};

export const getPrediction = (score) => (score >= PHISHING_THRESHOLD ? 'Phishing' : 'Legitimate');

export const RISK_STYLES = {
  Safe: { hex: '#22c55e', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  Low: { hex: '#3b82f6', text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  Medium: { hex: '#eab308', text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  High: { hex: '#f97316', text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  Critical: { hex: '#ef4444', text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};
export const styleFor = (level) => RISK_STYLES[level] || RISK_STYLES.Low;
