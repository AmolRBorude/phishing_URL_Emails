import { ShieldCheck } from 'lucide-react';
export default function RecommendationCard({ text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-panel2 p-4">
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-400" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
