import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Cpu, FileText, Gauge, ScanSearch, ShieldAlert } from 'lucide-react';
import { getScanHistory } from '../services/api';
import { buildAnalytics } from '../utils/stats';
import { lastScan } from '../utils/analysisUtils';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ScanTable from '../components/ScanTable';
import LoadingSpinner from '../components/LoadingSpinner';

const MODELS = [
  { name: 'URL Model', arch: 'CNN + BiLSTM' },
  { name: 'Email Model', arch: 'LLM / Transformer' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [scans, setScans] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { getScanHistory().then(setScans).catch((e) => setError(e.message)); }, []);
  const view = (scan) => { lastScan.save(scan); navigate('/result', { state: { scan } }); };

  const s = scans ? buildAnalytics(scans).stats : null;

  return (
    <>
      <PageHeader title="Admin Dashboard" description="System overview based on the scans stored by the backend." />

      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={() => navigate('/history')}><FileText size={16} />View Scan Logs</button>
        <button className="btn btn-ghost" onClick={() => navigate('/analytics')}><BarChart3 size={16} />View Analytics</button>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {MODELS.map((m) => (
          <div key={m.name} className="card flex items-center gap-3 p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-panel2 text-brand-400"><Cpu size={18} /></span>
            <div><p className="text-sm text-muted">{m.name}</p><p className="font-semibold">{m.arch}</p></div>
          </div>
        ))}
      </section>

      {error && <div className="card mt-6 p-6 text-sm text-muted">{error}</div>}
      {!error && !scans && <LoadingSpinner text="Loading scans…" />}
      {scans && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={ScanSearch} label="Total Scans" value={s.totalScans} />
            <StatCard icon={ShieldAlert} label="Phishing Detected" value={s.phishing} tone="text-red-500" />
            <StatCard icon={Gauge} label="Average Risk Score" value={s.avgRisk} caption="Out of 100" tone="text-orange-500" />
          </div>
          <section className="card mt-6"><h2 className="p-5 pb-2 font-semibold">Recent Threats</h2><ScanTable scans={scans.filter((x) => x.prediction === 'Phishing').slice(0, 5)} onView={view} emptyText="No threats recorded." /></section>
          <section className="card mt-6"><h2 className="p-5 pb-2 font-semibold">Recent Scans</h2><ScanTable scans={scans.slice(0, 5)} onView={view} emptyText="No scans yet." /></section>
        </>
      )}
    </>
  );
}
