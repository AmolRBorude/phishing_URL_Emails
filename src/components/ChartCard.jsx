export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      <div className="mt-4 h-64 w-full">{children}</div>
    </section>
  );
}
export const tooltipStyle = { background: '#0d162b', border: '1px solid #223052', borderRadius: 12, color: '#e2e8f5', fontSize: 12 };
