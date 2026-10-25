import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Copy, History as HistoryIcon, Link2, Mail, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { lastScan } from '../utils/analysisUtils';
import { styleFor } from '../utils/riskUtils';
import { copyText } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import RiskScore from '../components/RiskScore';
import RiskBadge from '../components/RiskBadge';
import ThreatIndicator from '../components/ThreatIndicator';
import RecommendationCard from '../components/RecommendationCard';
import Disclaimer from '../components/Disclaimer';

const PHISH_RECS = [
  'Do not click suspicious links.', 'Do not enter passwords or banking credentials.',
  'Verify the sender independently.', 'Report suspicious communication.',
];
const SAFE_RECS = [
  'Still verify unexpected requests through a trusted channel.', 'Type the website address yourself instead of following links.',
  'Keep your browser and email client up to date.', 'Report anything that later looks suspicious.',
];

function Summary({ icon: Icon, title, model, score }) {
  const analyzed = score !== null && score !== undefined;
  const s = styleFor(analyzed ? (score > 80 ? 'Critical' : score > 60 ? 'High' : score > 40 ? 'Medium' : score > 20 ? 'Low' : 'Safe') : 'Low');
  return (
    <div className="rounded-xl border border-line bg-panel2 p-4">
      <div className="flex items-center gap-2 text-sm font-medium"><Icon size={16} className="text-brand-400" />{title}</div>
      <p className="text-xs text-muted">{model}</p>
      {analyzed
        ? <><p className="mt-3 text-2xl font-bold">{score}%</p><div className="mt-2 h-1.5 rounded-full bg-line"><div className="h-full rounded-full" style={{ width: `${score}%`, background: s.hex }} /></div></>
        : <p className="mt-3 text-lg font-semibold text-muted">Not analyzed</p>}
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [scan] = useState(() => {
    const s = location.state?.scan || lastScan.load();
    if (s) lastScan.save(s);
    return s;
  });

  if (!scan) return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <p className="font-semibold">No result to show</p>
      <p className="mt-1 text-sm text-muted">Run a URL or email analysis, or open a scan from your history.</p>
      <div className="mt-5 flex justify-center gap-3"><Link to="/url-analysis" className="btn btn-primary">Analyze URL</Link><Link to="/history" className="btn btn-ghost">View History</Link></div>
    </div>
  );

  const phishing = scan.prediction === 'Phishing';
  const s = styleFor(scan.riskLevel);
  const indicators = scan.indicators;
  const copy = async (text, msg) => { (await copyText(text)) ? toast.success(msg) : toast.error('Copy failed. Select the text and copy it manually.'); };
  const summary = `PhishGuard AI result\nType: ${scan.type}\nInput: ${scan.input}\nPrediction: ${scan.prediction}\nRisk score: ${scan.score}/100 (${scan.riskLevel})\nConfidence: ${Math.round(scan.confidence * 100)}%`;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Phishing Analysis Result" description={`Scan ${scan.id}`} />

      <section className={`card border-2 p-6 sm:p-8 ${s.border}`}>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <RiskScore score={scan.score} />
          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className={`flex items-center justify-center gap-2 text-2xl font-extrabold tracking-tight md:justify-start ${phishing ? 'text-red-500' : 'text-emerald-500'}`}>
              {phishing ? <ShieldAlert size={26} /> : <ShieldCheck size={26} />}
              {phishing ? 'PHISHING DETECTED' : 'NO PHISHING DETECTED'}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-left sm:grid-cols-3">
              <div><dt className="text-xs text-muted">Risk Score</dt><dd className="font-bold">{scan.score} / 100</dd></div>
              <div><dt className="text-xs text-muted">Risk Level</dt><dd className="mt-0.5"><RiskBadge level={scan.riskLevel} /></dd></div>
              <div><dt className="text-xs text-muted">Confidence</dt><dd className="font-bold">{Math.round(scan.confidence * 100)}%</dd></div>
            </dl>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-bg px-3 py-2 text-left text-sm">
              {scan.type === 'URL' ? <Link2 size={15} className="shrink-0 text-brand-400" /> : <Mail size={15} className="shrink-0 text-blue-400" />}
              <span className="truncate" title={scan.input}>{scan.input}</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {scan.type === 'URL' && <button className="btn btn-ghost !py-2 text-xs" onClick={() => copy(scan.input, 'URL copied')}><Copy size={14} />Copy URL</button>}
              <button className="btn btn-ghost !py-2 text-xs" onClick={() => copy(summary, 'Result copied')}><Copy size={14} />Copy result</button>
            </div>
          </div>
        </div>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="font-semibold">Detection Summary</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Summary icon={Link2} title="URL Score" model="CNN + BiLSTM" score={scan.urlScore} />
          <Summary icon={Mail} title="Email Score" model="LLM / Transformer" score={scan.emailScore} />
        </div>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="font-semibold">Security Indicators</h2>
        {indicators.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {indicators.map((i) => <ThreatIndicator key={i.label} {...i} />)}
          </div>
        ) : <p className="mt-2 text-sm text-muted">The backend did not return any indicators for this scan.</p>}
      </section>

      <section className="card mt-6 p-6">
        <h2 className="font-semibold">Explanation</h2>
        <p className="mt-2 text-sm text-muted">{phishing ? 'This input contains multiple characteristics associated with phishing.' : 'This input shows few characteristics associated with phishing. A low score does not prove it is safe.'}</p>
        <h2 className="mt-6 font-semibold">Recommendations</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{(phishing ? PHISH_RECS : SAFE_RECS).map((t) => <RecommendationCard key={t} text={t} />)}</div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={() => navigate(scan.type === 'URL' ? '/url-analysis' : '/email-analysis')}><RotateCcw size={16} />Scan Another</button>
        <button className="btn btn-ghost" onClick={() => navigate('/history')}><HistoryIcon size={16} />View History</button>
      </div>
      <Disclaimer className="mt-6" />
    </div>
  );
}
