import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenu }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const submit = (e) => { e.preventDefault(); navigate(`/history${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); };
  const initials = (user?.name || 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <button className="rounded-lg p-2 hover:bg-panel2 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <form onSubmit={submit} className="relative max-w-md flex-1" role="search">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-9" placeholder="Search scans by URL, subject or ID" aria-label="Search scans" />
      </form>
      <div className="ml-auto flex items-center gap-2" ref={ref}>
        <div className="relative">
          <button className="relative rounded-xl p-2.5 hover:bg-panel2" onClick={() => setOpen((o) => !o)} aria-label="Notifications" aria-expanded={open}>
            <Bell size={18} />
          </button>
          {open && (
            <div className="card absolute right-0 mt-2 w-72 p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted">Notifications</p>
              <p className="px-3 pb-3 text-sm text-muted">No notifications yet.</p>
            </div>
          )}
        </div>
        <button className="flex items-center gap-2.5 rounded-xl p-1.5 pr-3 hover:bg-panel2" onClick={() => navigate('/profile')} aria-label="Open profile">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-blue-500 text-xs font-bold text-white">{initials}</span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight">{user?.name}</span>
            <span className="block text-xs text-muted">{user?.role}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
