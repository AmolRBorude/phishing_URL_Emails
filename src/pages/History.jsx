import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getScanHistory } from '../services/api';
import { lastScan } from '../utils/analysisUtils';
import PageHeader from '../components/PageHeader';
import ScanTable from '../components/ScanTable';
import LoadingSpinner from '../components/LoadingSpinner';

const FILTERS = [
  ['All', () => true], ['URL', (s) => s.type === 'URL'], ['Email', (s) => s.type === 'EMAIL'],
  ['Phishing', (s) => s.prediction === 'Phishing'], ['Legitimate', (s) => s.prediction === 'Legitimate'],
  ['High Risk', (s) => s.riskLevel === 'High'], ['Critical Risk', (s) => s.riskLevel === 'Critical'],
];
const PAGE = 8;

export default function History() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [scans, setScans] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState(params.get('q') || '');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => { setQ(params.get('q') || ''); }, [params]);
  useEffect(() => { getScanHistory().then(setScans).catch((e) => setError(e.message)); }, []);
  useEffect(() => { setPage(1); }, [q, filter]);

  const rows = useMemo(() => {
    const fn = FILTERS.find(([n]) => n === filter)[1];
    const t = q.trim().toLowerCase();
    return (scans || []).filter(fn).filter((s) => !t || s.input.toLowerCase().includes(t) || s.id.toLowerCase().includes(t));
  }, [scans, q, filter]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = (scan) => { lastScan.save(scan); navigate('/result', { state: { scan } }); };

  if (error) return <div className="card mx-auto max-w-md p-8 text-center"><p className="font-semibold">Could not load scan history</p><p className="mt-1 text-sm text-muted">{error}</p></div>;

  return (
    <>
      <PageHeader title="Scan History" description="Every URL and email you have analyzed." />
      <div className="card">
        <div className="space-y-3 p-4">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by input or scan ID" aria-label="Search history" />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter scans">
            {FILTERS.map(([n]) => (
              <button key={n} onClick={() => setFilter(n)} aria-pressed={filter === n}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filter === n ? 'border-brand-400 bg-brand-500/15 text-brand-400' : 'border-line text-muted hover:text-fg'}`}>{n}</button>
            ))}
          </div>
        </div>
        {!scans ? <LoadingSpinner text="Loading scans…" /> : (
          <>
            <ScanTable showId scans={rows.slice((page - 1) * PAGE, page * PAGE)} onView={view} emptyText={scans.length ? 'No scans match your search or filter.' : 'No scans yet.'} />
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted">
              <span>{rows.length} scan{rows.length === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost !p-2" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
                <span>Page {page} of {pages}</span>
                <button className="btn btn-ghost !p-2" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
