// Builds dashboard/analytics numbers from the real scan list. No numbers are made up.
const RISK_ORDER = ['Safe', 'Low', 'Medium', 'High', 'Critical'];
const count = (list, fn) => list.filter(fn).length;
const sameDay = (a, b) => new Date(a).toDateString() === b.toDateString();

export function buildAnalytics(scans) {
  const total = scans.length;
  const urlScans = count(scans, (s) => s.type === 'URL');
  const phishing = count(scans, (s) => s.prediction === 'Phishing');
  const now = new Date();

  const scanActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - (6 - i));
    const day = scans.filter((s) => sameDay(s.date, d));
    return { day: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), URL: count(day, (s) => s.type === 'URL'), Email: count(day, (s) => s.type === 'EMAIL') };
  });

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const m = scans.filter((s) => { const x = new Date(s.date); return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth(); });
    const url = count(m, (s) => s.type === 'URL');
    return { month: d.toLocaleDateString(undefined, { month: 'short' }), scans: m.length, URL: url, Email: m.length - url };
  });

  return {
    stats: {
      totalScans: total, urlScans, emailScans: total - urlScans, phishing, safe: total - phishing,
      avgRisk: total ? Math.round(scans.reduce((a, s) => a + s.score, 0) / total) : 0,
      detectionRate: total ? +((phishing / total) * 100).toFixed(1) : 0,
    },
    detectionOverview: RISK_ORDER.map((name) => ({ name, value: count(scans, (s) => s.riskLevel === name) })),
    distribution: [{ name: 'Legitimate', value: total - phishing }, { name: 'Phishing', value: phishing }],
    scanActivity,
    monthly,
  };
}
