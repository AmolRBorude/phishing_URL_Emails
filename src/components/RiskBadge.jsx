import { styleFor } from '../utils/riskUtils';
export default function RiskBadge({ level }) {
  const s = styleFor(level);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.border} ${s.text}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.hex }} />
      {level}
    </span>
  );
}
