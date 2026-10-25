import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Gauge, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getAnalytics } from '../services/api';
import { styleFor } from '../utils/riskUtils';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard, { tooltipStyle } from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Disclaimer from '../components/Disclaimer';

const axis = { stroke: '#8c9ab8', fontSize: 12, tickLine: false, axisLine: false };

export default function Analytics() {
  const [a, setA] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { getAnalytics().then(setA).catch((e) => setError(e.message)); }, []);

  if (error) return <div className="card mx-auto max-w-md p-8 text-center"><p className="font-semibold">Could not load analytics</p><p className="mt-1 text-sm text-muted">{error}</p></div>;
  if (!a) return <LoadingSpinner text="Loading analytics…" />;
  const { stats: s } = a;
  const colors = ['#22c55e', '#ef4444'];

  return (
    <>
      <PageHeader title="Analytics" description="Detection trends across URL and email scans." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Detection Rate" value={`${s.detectionRate}%`} caption="Share of scans flagged as phishing" />
        <StatCard icon={ShieldAlert} label="Phishing Detection" value={s.phishing.toLocaleString()} tone="text-red-500" />
        <StatCard icon={ShieldCheck} label="Safe Detection" value={s.safe.toLocaleString()} tone="text-emerald-500" />
        <StatCard icon={Gauge} label="Average Risk Score" value={s.avgRisk} caption="Out of 100" tone="text-orange-500" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Total scans over time" subtitle="Per month">
          <ResponsiveContainer><LineChart data={a.monthly}><CartesianGrid stroke="#223052" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="scans" name="Scans" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Phishing vs legitimate">
          <ResponsiveContainer><PieChart><Pie data={a.distribution} dataKey="value" nameKey="name" outerRadius={85} stroke="none" label>{a.distribution.map((d, i) => <Cell key={d.name} fill={colors[i]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="URL vs email analysis" subtitle="Per month">
          <ResponsiveContainer><BarChart data={a.monthly}><CartesianGrid stroke="#223052" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,.08)' }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="URL" fill="#22d3ee" radius={[6, 6, 0, 0]} /><Bar dataKey="Email" fill="#3b82f6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Risk-level distribution">
          <ResponsiveContainer><BarChart data={a.detectionOverview}><CartesianGrid stroke="#223052" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,.08)' }} /><Bar dataKey="value" name="Scans" radius={[8, 8, 0, 0]}>{a.detectionOverview.map((d) => <Cell key={d.name} fill={styleFor(d.name).hex} />)}</Bar></BarChart></ResponsiveContainer>
        </ChartCard>
      </div>
      <Disclaimer className="mt-6">Detection rate here means the share of scans flagged as phishing. It is not a model accuracy measure.</Disclaimer>
    </>
  );
}
