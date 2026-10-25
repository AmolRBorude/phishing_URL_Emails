import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, History as HistoryIcon, LayoutDashboard, Link2, LogOut, Mail, Settings as SettingsIcon, Shield, ShieldCheck, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/url-analysis', label: 'URL Analysis', icon: Link2 },
  { to: '/email-analysis', label: 'Email Analysis', icon: Mail },
  { to: '/history', label: 'Scan History', icon: HistoryIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 text-lg font-bold ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-blue-500 text-white"><Shield size={20} /></span>
      PhishGuard AI
    </span>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const items = user?.role === 'Admin' ? [...ITEMS, { to: '/admin', label: 'Admin', icon: ShieldCheck }] : ITEMS;

  const doLogout = () => { logout(); setConfirm(false); toast.info('You have been logged out.'); navigate('/login'); };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-panel p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Main navigation">
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <Logo />
          <button className="rounded-lg p-1.5 hover:bg-panel2 lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-muted hover:bg-panel2 hover:text-fg'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setConfirm(true)} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-500">
          <LogOut size={18} />Logout
        </button>
      </aside>
      <ConfirmDialog open={confirm} title="Log out?" message="You will need to sign in again to run new scans." confirmLabel="Log out" onConfirm={doLogout} onCancel={() => setConfirm(false)} />
    </>
  );
}
