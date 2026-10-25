import { Link } from 'react-router-dom';
import { Link2, Mail, Shield } from 'lucide-react';
import { Logo } from './Sidebar';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0b1a3a] via-[#0a1630] to-[#07101f] p-12 text-slate-100 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <Link to="/"><Logo /></Link>
        <div className="relative">
          <Shield size={44} className="text-brand-400" />
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight">Check suspicious links and emails before anyone clicks.</h2>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3"><Link2 size={16} className="text-brand-400" />URLs analysed with a CNN + BiLSTM model</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-brand-400" />Emails analysed with a Transformer / LLM</li>
          </ul>
        </div>
        <p className="relative text-xs text-slate-400">Analysis results come from the backend API.</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 block lg:hidden"><Logo /></Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
