import { Mail, CheckCircle, Edit2, Send } from 'lucide-react';
import { useState } from 'react';

type FollowUpEmailProps = {
  query: string;
  onClose: () => void;
};

export default function FollowUpEmail({ query, onClose }: FollowUpEmailProps) {
  const [copied, setCopied] = useState(false);

  const extractEmailInfo = (text: string) => {
    const contactMatch = text.match(/contact:\s*(.+?)(?:\(|$)/i);
    const companyMatch = text.match(/email to\s+(.+?)\s+(?:after|M&A)/i);

    return {
      contact: contactMatch ? contactMatch[1].trim() : 'Contact',
      company: companyMatch ? companyMatch[1].trim() : 'the prospect',
    };
  };

  const info = extractEmailInfo(query);

  const emailSubject = `Following up on our conversation`;
  const emailBody = `Hi ${info.contact},

Thank you for taking the time to meet with me yesterday. I enjoyed learning more about ${info.company}'s approach to M&A operations and the challenges you're facing with manual document analysis.

Based on our discussion, I wanted to share a few resources that directly address your needs:

🎯 **Dev Factory Case Study**
Our financial services client reduced M&A due diligence time by 65% using our AI-powered document analysis platform. They're now processing deals 3-4x faster with higher accuracy.
[Link to case study]

🎥 **Document Analysis Demo**
A 10-minute walkthrough showing how our AI handles complex financial documents, contract reviews, and risk identification in real-time.
[Link to demo]

Given your timeline to pilot on 2 active deals next month and the $300k+ budget approval, I'd love to schedule a technical deep-dive with your M&A team. This would give them hands-on experience with the platform and allow us to discuss specific integration requirements.

**Proposed Next Steps:**
• Technical deep-dive session with your M&A team (60 mins)
• Review pilot deal scope and success metrics
• Discuss implementation timeline and support model

Would next Tuesday or Wednesday work for you and the team?

Looking forward to helping ${info.company} transform your deal intelligence process.

Best regards,
[Your Name]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-gray-700" />
            <div>
              <h2 className="text-3xl font-bold">Follow-up Email Generated</h2>
              <p className="text-gray-600">Personalized based on your meeting context</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Back to Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500">TO:</span>
            <span className="text-sm font-medium">{info.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">SUBJECT:</span>
            <span className="text-sm font-medium">{emailSubject}</span>
          </div>
        </div>

        <div className="p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
            {emailBody}
          </pre>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">AI Recommendations Included</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Personalized greeting and meeting recap</li>
              <li>✓ Relevant case study reference (Dev Factory - Financial Services)</li>
              <li>✓ Demo video link for technical validation</li>
              <li>✓ Clear call-to-action with proposed next steps</li>
              <li>✓ Professional tone optimized for B2B enterprise sales</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Edit2 className="h-5 w-5" />
              Copy to Edit
            </>
          )}
        </button>
        <button
          className="px-6 py-3 border-2 border-black rounded-xl hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
        >
          <Send className="h-5 w-5" />
          Send via Email
        </button>
      </div>

      <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Recommended Assets Referenced</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-black text-white text-xs rounded-full">Case Study</span>
              <span className="text-sm font-medium">Dev Factory - M&A Automation</span>
            </div>
            <span className="text-xs text-gray-500">Financial Services</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-black text-white text-xs rounded-full">Demo</span>
              <span className="text-sm font-medium">Document Analysis Platform</span>
            </div>
            <span className="text-xs text-gray-500">10 min video</span>
          </div>
        </div>
      </div>
    </div>
  );
}
