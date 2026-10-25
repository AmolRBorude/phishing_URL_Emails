import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Ctx = createContext(null);
export const useSettings = () => useContext(Ctx);
const DEFAULTS = { darkMode: true, notifications: true, emailAlerts: false };

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('pg_settings')) }; } catch { return DEFAULTS; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('light', !settings.darkMode);
    try { localStorage.setItem('pg_settings', JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);
  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const value = useMemo(() => ({ settings, update }), [settings]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
