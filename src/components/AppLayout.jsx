import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
