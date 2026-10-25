import { Info } from 'lucide-react';
export default function Disclaimer({ children = 'AI-based phishing detection is a security aid and does not guarantee detection of every malicious input.', className = '' }) {
  return (
    <p className={`flex items-start gap-2 text-xs text-muted ${className}`}>
      <Info size={14} className="mt-0.5 shrink-0" /> <span>{children}</span>
    </p>
  );
}
