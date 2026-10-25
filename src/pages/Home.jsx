import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BellRing, Gauge, KeyRound, Link2, Mail, Menu, Search, Siren, X, Zap } from 'lucide-react';
import { Logo } from '../components/Sidebar';
import Disclaimer from '../components/Disclaimer';

const NAV = [['Home', '#home'], ['Features', '#features'], ['How It Works', '#how'], ['About', '#about']];

const FEATURES = [
  { icon: Link2, title: 'URL Detection', text: 'Analyze URL structure using CNN + BiLSTM.' },
  { icon: Mail, title: 'Email Intelligence', text: 'Analyze email content using a Transformer/LLM.' },
  { icon: Gauge, title: 'Risk Assessment', text: 'Combine detection results into an understandable phishing risk score.' },
  { icon: BellRing, title: 'Early Warning', text: 'Provide clear warnings and security recommendations.' },
];
const STEPS = [
  { icon: Search, title: 'Input', text: 'Paste a URL or an email.' },
  { icon: Zap, title: 'AI Analysis', text: 'CNN + BiLSTM for URLs, Transformer/LLM for emails.' },
  { icon: Gauge, title: 'Risk Assessment', text: 'Results become a 0–100 risk score.' },
  { icon: BellRing, title: 'Early Warning', text: 'You get a clear warning and next steps.' },
];

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-brand-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1427] p-5 shadow-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-scan bg-gradient-to-b from-transparent via-brand-400/25 to-transparent" />
        <p className="text-xs text-slate-400">Suspicious link (illustration)</p>
        <div className="mt-2 break-all rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed">
          <span className="text-yellow-400">http://</span>
          <span className="rounded bg-red-500/20 px-0.5 text-red-400">paypal-secure-login</span>
          <span className="rounded bg-red-500/20 px-0.5 text-red-400">.verify-account.xyz</span>
          <span className="text-slate-400">/signin?id=48213</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {['No HTTPS', 'Brand name in subdomain', 'Login keyword', 'Unusual TLD'].map((t) => <span key={t} className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-red-300">{t}</span>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3"><Link2 size={16} className="text-brand-400" /><p className="mt-2 text-xs text-slate-400">URL module</p><p className="text-sm font-semibold text-white">CNN + BiLSTM</p></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3"><Mail size={16} className="text-blue-400" /><p className="mt-2 text-xs text-slate-400">Email module</p><p className="text-sm font-semibold text-white">Transformer / LLM</p></div>
        </div>
      </div>
      <div className="relative -mt-4 ml-auto w-[78%] rounded-2xl border border-white/10 bg-[#0d1a33] p-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400"><Mail size={14} />Email (illustration)</div>
        <p className="mt-2 text-sm font-semibold text-white">Urgent: verify your account</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-1 text-orange-300"><Zap size={11} />Urgent language</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-red-300"><KeyRound size={11} />Credential request</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-red-300"><Siren size={11} />Social engineering</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const link = 'text-sm font-medium text-slate-300 hover:text-white';
  return (
    <div className="bg-[#07101f] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07101f]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" aria-label="PhishGuard AI home"><Logo className="text-white" /></a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {NAV.map(([n, h]) => <a key={n} href={h} className={link}>{n}</a>)}
            <Link to="/login" className={link}>Login</Link>
            <Link to="/register" className="btn btn-primary !py-2">Get Started</Link>
          </nav>
          <button className="rounded-lg p-2 hover:bg-white/10 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden" aria-label="Mobile">
            {NAV.map(([n, h]) => <a key={n} href={h} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-white/10">{n}</a>)}
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-white/10">Login</Link>
            <Link to="/register" className="btn btn-primary mt-1">Get Started</Link>
          </nav>
        )}
      </header>

      <section id="home" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#0f2a5c_0%,#07101f_55%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">AI-Powered Phishing Detection</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">Detect suspicious URLs and phishing emails using deep learning and language intelligence before they become a security threat.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/url-analysis" className="btn btn-primary !px-6 !py-3"><Link2 size={16} />Analyze URL</Link>
              <Link to="/email-analysis" className="btn !px-6 !py-3 border border-white/20 text-white hover:bg-white/10"><Mail size={16} />Analyze Email</Link>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Two detection modules, one clear risk score</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Each input type goes to the model built for it.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-blue-500 text-white"><Icon size={20} /></span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <div className="mt-10 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex flex-1 flex-col items-center gap-3 md:flex-row">
                <div className="w-full flex-1 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Icon size={20} className="text-brand-400" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
                {i < STEPS.length - 1 && <><ArrowDown size={20} className="text-brand-400 md:hidden" /><ArrowRight size={20} className="hidden shrink-0 text-brand-400 md:block" /></>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">About the project</h2>
          <p className="mt-4 text-slate-300">PhishGuard AI is a final-year Computer Engineering project: a multimodal framework for deep identification and early warning of phishing emails and websites. This is the frontend; it shows results returned by the backend API.</p>
          <Link to="/register" className="btn btn-primary mt-8 !px-6 !py-3">Get Started</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto max-w-3xl"><Disclaimer className="justify-center text-center text-slate-400" /></div>
      </footer>
    </div>
  );
}
