import { Cpu, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import URLAnalyzer from '../components/URLAnalyzer';
import Disclaimer from '../components/Disclaimer';

export default function URLAnalysis() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="URL Phishing Analysis" description="Analyze a website URL using our CNN + BiLSTM phishing detection model." />
      <URLAnalyzer />
      <div className="card mt-6 grid gap-4 p-5 sm:grid-cols-2">
        <div className="flex gap-3"><Cpu size={18} className="mt-0.5 shrink-0 text-brand-400" /><p className="text-sm text-muted">The model reads the URL as a character sequence. The URL is not opened or visited.</p></div>
        <div className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" /><p className="text-sm text-muted">The result comes from your FastAPI backend, so it must be running.</p></div>
      </div>
      <Disclaimer className="mt-4" />
    </div>
  );
}
