import PageHeader from '../components/PageHeader';
import EmailAnalyzer from '../components/EmailAnalyzer';
import Disclaimer from '../components/Disclaimer';

export default function EmailAnalysis() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Email Phishing Analysis" description="Analyze email content using a Transformer/LLM to detect phishing intent and social-engineering indicators." />
      <EmailAnalyzer />
      <Disclaimer className="mt-4" />
    </div>
  );
}
