import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Link2, Search, X } from 'lucide-react';
import { analyzeURL } from '../services/api';
import { validateUrl } from '../utils/validators';
import { copyText } from '../utils/clipboard';
import { lastScan } from '../utils/analysisUtils';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    const err = validateUrl(url);
    setError(err);
    if (err) return;
    setLoading(true);
    try {
      const scan = await analyzeURL(url);
      lastScan.save(scan);
      navigate('/result', { state: { scan } });
    } catch (ex) {
      setError(ex.message);
      toast.error('Analysis failed. Check the message under the field and try again.');
      setLoading(false);
    }
  };

  const copy = async () => {
    if (await copyText(url)) { setCopied(true); toast.success('URL copied'); setTimeout(() => setCopied(false), 1500); }
  };

  if (loading) return <div className="card p-6"><LoadingSpinner text="Analyzing URL with CNN + BiLSTM…" size={36} /></div>;

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
      <label htmlFor="url" className="label">Enter Website URL</label>
      <div className="relative">
        <Link2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" autoComplete="off" spellCheck="false"
          aria-invalid={!!error} aria-describedby={error ? 'url-err' : undefined}
          className={`input !py-3.5 !pl-10 ${url ? '!pr-12' : ''} ${error ? 'input-error' : ''}`} />
        {url && (
          <button type="button" onClick={copy} aria-label="Copy URL" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:bg-panel2 hover:text-fg">
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        )}
      </div>
      {error && <p id="url-err" role="alert" className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary"><Search size={16} />Analyze URL</button>
        <button type="button" className="btn btn-ghost" onClick={() => { setUrl(''); setError(''); }}><X size={16} />Clear</button>
      </div>
    </form>
  );
}
