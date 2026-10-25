import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link2, Mail, ScanSearch, ShieldAlert } from 'lucide-react';
import { getScanHistory } from '../services/api';
import { buildAnalytics } from '../utils/stats';
import { styleFor } from '../utils/riskUtils';
import { lastScan } from '../utils/analysisUtils';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard, { tooltipStyle } from '../components/ChartCard';
import ScanTable from '../components/ScanTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Disclaimer from '../components/Disclaimer';

const axis = { stroke: '#8c9ab8', fontSize: 12, tickLine: false, axisLine: false };

export default function Dashboard() {
  const navigate = useNavigate();
  const [scans, setScans] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError(''); setScans(null);
    getScanHistory().then(setScans).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const view = (scan) => { lastScan.save(scan); navigate('/result', { state: { scan } }); };

  if (error) return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <p className="font-semibold">Could not load your scans</p>
      <p className="mt-1 text-sm text-muted">{error}</p>
      <button className="btn btn-primary mt-5" onClick={load}>Try again</button>
    </div>
  );
  if (!scans) return <LoadingSpinner text="Loading security overview…" />;

  const { stats: s, detectionOverview, scanActivity, distribution } = buildAnalytics(scans);
  const colors = ['#22c55e', '#ef4444'];

  return (
    <>
      <PageHeader title="Security Overview" description="Scans from the URL and email detection modules." />

      {scans.length === 0 && (
        <div className="card mb-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">No scans yet. Analyze a URL or an email and it will show up here.</p>
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/url-analysis')}>Analyze URL</button>
            <button className="btn btn-ghost" onClick={() => navigate('/email-analysis')}>Analyze Email</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ScanSearch} label="Total Scans" value={s.totalScans} />
        <StatCard icon={Link2} label="URL Scans" value={s.urlScans} caption="CNN + BiLSTM" />
        <StatCard icon={Mail} label="Email Scans" value={s.emailScans} caption="LLM / Transformer" tone="text-blue-400" />
        <StatCard icon={ShieldAlert} label="Threats Detected" value={s.phishing} tone="text-red-500" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Detection Overview" subtitle="Scans by risk level" className="lg:col-span-2">
          <ResponsiveContainer>
            <BarChart data={detectionOverview}>
              <CartesianGrid stroke="#223052" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,.08)' }} />
              <Bar dataKey="value" name="Scans" radius={[8, 8, 0, 0]}>{detectionOverview.map((d) => <Cell key={d.name} fill={styleFor(d.name).hex} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Detection Distribution" subtitle="Legitimate vs phishing">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">{distribution.map((d, i) => <Cell key={d.name} fill={colors[i]} />)}</Pie>
              <Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Scan Activity" subtitle="Last 7 days" className="mt-4">
        <ResponsiveContainer>
          <LineChart data={scanActivity}>
            <CartesianGrid stroke="#223052" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" {...axis} /><YAxis allowDecimals={false} {...axis} />
            <Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="URL" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Email" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="card mt-6">
        <div className="flex items-center justify-between p-5 pb-2">
          <h2 className="font-semibold">Recent Scans</h2>
          <button className="text-sm font-medium text-brand-400 hover:underline" onClick={() => navigate('/history')}>View all</button>
        </div>
        <ScanTable scans={scans.slice(0, 6)} onView={view} emptyText="No scans yet." />
      </section>
      <Disclaimer className="mt-6" />
    </>
  );
}
