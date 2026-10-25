import { getPrediction, getRiskLevel } from './riskUtils.js';

// Turns a backend response into the one shape the UI uses.
// Backend must send at least: score (0-100). Optional: id, prediction, confidence (0-1), date, indicators.
// indicators: [{ label, value, status: 'ok' | 'warn' | 'danger', hint? }]
export function normalizeScan(raw) {
  const score = Math.round(Number(raw.score) || 0);
  const type = String(raw.type || 'URL').toUpperCase();
  return {
    id: raw.id || `SCN-${Date.now().toString().slice(-6)}`,
    type,
    input: raw.input || '',
    prediction: raw.prediction || getPrediction(score),
    score,
    riskLevel: getRiskLevel(score), // always derived from riskUtils so thresholds live in one place
    confidence: raw.confidence ?? 0,
    date: raw.date || new Date().toISOString(),
    urlScore: raw.urlScore ?? (type === 'URL' ? score : null),
    emailScore: raw.emailScore ?? (type === 'EMAIL' ? score : null),
    indicators: raw.indicators || [],
  };
}

// Keeps the last opened result so the Result page survives a refresh.
const KEY = 'pg_last_scan';
export const lastScan = {
  save: (s) => { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } },
  load: () => { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } },
};
