import { Eye, Link2, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import RiskBadge from './RiskBadge';

const fmt = (d) => new Date(d).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function ScanTable({ scans, onView, showId = false, emptyText = 'No scans to show yet.' }) {
  if (!scans.length) {
    return <div className="py-12 text-center text-sm text-muted">{emptyText}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs text-muted">
          <tr className="border-b border-line">
            {showId && <th className="px-4 py-3 font-medium">ID</th>}
            {['Type', 'Input', 'Prediction', 'Risk Score', 'Risk Level', 'Date', 'Action'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {scans.map((s) => (
            <tr key={s.id} className="border-b border-line/60 last:border-0 hover:bg-panel2/60">
              {showId && <td className="px-4 py-3 font-medium text-muted">{s.id}</td>}
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5">{s.type === 'URL' ? <Link2 size={14} className="text-brand-400" /> : <Mail size={14} className="text-blue-400" />}{s.type === 'URL' ? 'URL' : 'Email'}</span>
              </td>
              <td className="max-w-[260px] truncate px-4 py-3" title={s.input}>{s.input}</td>
              <td className="px-4 py-3">
                {s.prediction === 'Phishing'
                  ? <span className="inline-flex items-center gap-1.5 font-medium text-red-500"><ShieldAlert size={14} />Phishing</span>
                  : <span className="inline-flex items-center gap-1.5 font-medium text-emerald-500"><ShieldCheck size={14} />Legitimate</span>}
              </td>
              <td className="px-4 py-3 font-semibold">{s.score}</td>
              <td className="px-4 py-3"><RiskBadge level={s.riskLevel} /></td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{fmt(s.date)}</td>
              <td className="px-4 py-3">
                <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => onView(s)}><Eye size={14} />View Result</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
