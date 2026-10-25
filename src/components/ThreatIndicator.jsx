import { AlertTriangle, CheckCircle2, Hash, KeyRound, Link2, Lock, Mail, Network, Ruler, Siren, Waves, Zap, ShieldQuestion } from 'lucide-react';

const ICONS = {
  'URL Length': Ruler, HTTPS: Lock, 'IP Address': Network, 'Number of Dots': Hash, 'Number of Parameters': Link2,
  'Suspicious Keywords': AlertTriangle, Entropy: Waves, 'Urgent language': Zap, 'Suspicious links': Link2,
  'Credential request': KeyRound, 'Social engineering': Siren, 'Unusual sender': Mail,
};
const TONES = {
  danger: 'border-red-500/30 bg-red-500/5 text-red-500',
  warn: 'border-orange-500/30 bg-orange-500/5 text-orange-500',
  ok: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500',
};

export default function ThreatIndicator({ label, value, status = 'ok', hint }) {
  const Icon = ICONS[label] || ShieldQuestion;
  const Mark = status === 'ok' ? CheckCircle2 : AlertTriangle;
  return (
    <div className={`rounded-xl border p-4 ${TONES[status]}`}>
      <div className="flex items-center justify-between">
        <Icon size={18} />
        <Mark size={14} />
      </div>
      <p className="mt-3 text-xs font-medium text-muted">{label}</p>
      <p className="text-lg font-bold text-fg">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
