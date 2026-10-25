export default function StatCard({ icon: Icon, label, value, caption, tone = 'text-brand-400' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-panel2 ${tone}`}><Icon size={18} /></span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {caption && <p className="mt-1 text-xs text-muted">{caption}</p>}
    </div>
  );
}
