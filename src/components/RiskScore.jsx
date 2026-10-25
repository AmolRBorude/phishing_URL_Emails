import { useEffect, useState } from 'react';
import { getRiskLevel, styleFor } from '../utils/riskUtils';

export default function RiskScore({ score, size = 168 }) {
  const level = getRiskLevel(score);
  const s = styleFor(level);
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => { const t = requestAnimationFrame(() => setP(score)); return () => cancelAnimationFrame(t); }, [score]);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`Risk score ${score} out of 100, ${level}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="10" stroke="currentColor" className="text-line" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="10" strokeLinecap="round" stroke={s.hex}
          strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} style={{ transition: 'stroke-dashoffset 900ms ease-out' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-extrabold leading-none">{score}</div>
        <div className="mt-1 text-xs font-medium text-muted">out of 100</div>
      </div>
    </div>
  );
}
