import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, Search, Upload, X } from 'lucide-react';
import { analyzeEmail } from '../services/api';
import { validateEmailForm } from '../utils/validators';
import { lastScan } from '../utils/analysisUtils';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';
import Disclaimer from './Disclaimer';

const EMPTY = { sender: '', receiver: '', subject: '', body: '' };

function parseEml(text) {
  const [head, ...rest] = text.replace(/\r\n/g, '\n').split('\n\n');
  const unfolded = head.replace(/\n[ \t]+/g, ' ');
  const h = (name) => (unfolded.match(new RegExp(`^${name}:\\s*(.*)$`, 'im')) || [])[1] || '';
  const addr = (v) => (v.match(/[^\s<>"]+@[^\s<>"]+/) || [''])[0];
  return { sender: addr(h('From')), receiver: addr(h('To')), subject: h('Subject'), body: rest.join('\n\n').slice(0, 20000) };
}

export default function EmailAnalyzer() {
  const [mode, setMode] = useState('paste');
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const onFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.eml')) { toast.error('Only .eml files are supported.'); return; }
    if (file.size > 1024 * 1024) { toast.error('File is larger than 1 MB.'); return; }
    const r = new FileReader();
    r.onload = () => { setF(parseEml(String(r.result))); setFileName(file.name); setErrors({}); };
    r.onerror = () => toast.error('Could not read that file.');
    r.readAsText(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateEmailForm(f);
    if (mode === 'upload' && !fileName) errs.file = 'Choose a .eml file to analyze.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const scan = await analyzeEmail(f);
      lastScan.save(scan);
      navigate('/result', { state: { scan } });
    } catch (ex) {
      toast.error(ex.message);
      setLoading(false);
    }
  };

  const reset = () => { setF(EMPTY); setErrors({}); setFileName(''); if (fileRef.current) fileRef.current.value = ''; };
  const Err = ({ k }) => (errors[k] ? <p role="alert" className="mt-1.5 text-xs text-red-500">{errors[k]}</p> : null);
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  if (loading) return <div className="card p-6"><LoadingSpinner text="Analyzing email using AI…" size={36} /></div>;

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
      <div className="mb-6 inline-flex rounded-xl border border-line bg-bg p-1" role="tablist">
        {[['paste', 'Paste Email', Mail], ['upload', 'Upload Email', Upload]].map(([k, label, Icon]) => (
          <button type="button" key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === k ? 'bg-brand-500/15 text-brand-400' : 'text-muted hover:text-fg'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {mode === 'upload' && (
        <div className="mb-5">
          <label htmlFor="eml" className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors hover:bg-panel2 ${errors.file ? 'border-red-500' : 'border-line'}`}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
            {fileName ? <FileText size={28} className="text-brand-400" /> : <Upload size={28} className="text-muted" />}
            <span className="text-sm font-medium">{fileName || 'Drop a .eml file here or click to browse'}</span>
            <span className="text-xs text-muted">Only .eml files up to 1 MB</span>
          </label>
          <input id="eml" ref={fileRef} type="file" accept=".eml" className="sr-only" onChange={(e) => onFile(e.target.files[0])} />
          <Err k="file" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="sender" className="label">Sender</label><input id="sender" type="email" className={cls('sender')} value={f.sender} onChange={set('sender')} placeholder="sender@example.com" /><Err k="sender" /></div>
        <div><label htmlFor="receiver" className="label">Receiver</label><input id="receiver" type="email" className={cls('receiver')} value={f.receiver} onChange={set('receiver')} placeholder="you@example.com" /><Err k="receiver" /></div>
      </div>
      <div className="mt-4"><label htmlFor="subject" className="label">Subject</label><input id="subject" className={cls('subject')} value={f.subject} onChange={set('subject')} placeholder="Email subject" /></div>
      <div className="mt-4"><label htmlFor="body" className="label">Email Body</label><textarea id="body" rows={8} className={cls('body')} value={f.body} onChange={set('body')} placeholder="Paste the email text here" /><Err k="body" /></div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary"><Search size={16} />Analyze Email</button>
        <button type="button" className="btn btn-ghost" onClick={reset}><X size={16} />Clear</button>
      </div>
      <Disclaimer className="mt-5">Your email content is processed for analysis. Avoid uploading confidential information in demo environments.</Disclaimer>
    </form>
  );
}
