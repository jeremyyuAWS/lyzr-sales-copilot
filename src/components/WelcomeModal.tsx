import { X, Sparkles, Users, Target, Shield } from 'lucide-react';

type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
};

export default function WelcomeModal({ isOpen, onClose, onStartTour }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:opacity-70 transition-opacity"
        >
          <X className="h-5 w-5 stroke-black" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black rounded-xl p-3">
              <Sparkles className="h-6 w-6 stroke-white" />
            </div>
            <h2 className="text-3xl font-bold">Sales Enablement Copilot</h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Business Value</h3>
              <p className="text-gray-700 leading-relaxed">
                Accelerate your sales process with AI-powered deal intelligence. Find the perfect demo,
                case study, or proof point in seconds for confirmed customers like <span className="font-semibold">RingCentral</span>, <span className="font-semibold">NVIDIA</span>, <span className="font-semibold">Prudential</span>, and more.
                Every recommendation is grounded in your deal context with proven AE insights, helping you close faster with greater confidence.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Agents
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Discovery Agent</h4>
                  <p className="text-sm text-gray-600">
                    Surfaces 22 curated assets (demos, case studies, videos, decks, one-pagers, sales plays) based on deal stage, industry, and persona
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Context Agent</h4>
                  <p className="text-sm text-gray-600">
                    Maintains deal intelligence across 13 confirmed customer deals with team comments, milestones, and next actions
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Curation Agent</h4>
                  <p className="text-sm text-gray-600">
                    Learns from 40+ AE comments and asset usage patterns to improve recommendations
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Key Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span><strong>13 Real Customer Deals</strong> - RingCentral, NVIDIA, Prudential, HPE, Warby Parker, Bajaj Allianz, ETS, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span><strong>22 Curated Assets</strong> - Rich metadata with "When to Use", "How AEs Position", and "Common Next Steps"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span><strong>AE Insights</strong> - Realistic comments from Reid, Praveen, Anju, Siva, and Jeremy sharing real deal wins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span><strong>Timeline View</strong> - Grouped milestones (Overdue, Today, This Week, Later) with visual indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span><strong>Smart Recommendations</strong> - AI suggests assets based on deal context, stage, and similar wins</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Responsible AI
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI recommendations are transparent, explainable, and based on clear business logic.
                Every suggestion includes reasoning, confidence scores, and source attribution.
                Human judgment remains central to all sales decisions.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-200 space-y-3">
              {onStartTour && (
                <button
                  onClick={() => {
                    onClose();
                    onStartTour();
                  }}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Start Product Tour
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {onStartTour ? 'Skip Tour' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
