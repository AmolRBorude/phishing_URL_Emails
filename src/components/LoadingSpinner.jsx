import { Loader2 } from 'lucide-react';
export default function LoadingSpinner({ text, size = 28 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted" role="status" aria-live="polite">
      <Loader2 size={size} className="animate-spin text-brand-400" />
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}
