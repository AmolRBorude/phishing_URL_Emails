import { useEffect } from 'react';
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const h = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cd-title" className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="cd-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
