import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

const ICON = { success: CheckCircle2, error: XCircle, info: Info };
const TONE = { success: 'text-emerald-500', error: 'text-red-500', info: 'text-brand-400' };

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, type, message }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3800);
  }, []);
  const api = useMemo(() => ({
    success: (m) => push('success', m), error: (m) => push('error', m), info: (m) => push('info', m),
  }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => {
          const Icon = ICON[t.type];
          return (
            <div key={t.id} className="card flex animate-toast items-start gap-3 px-4 py-3 text-sm">
              <Icon size={18} className={`mt-0.5 shrink-0 ${TONE[t.type]}`} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
