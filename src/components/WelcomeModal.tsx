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
                case study, or proof point in seconds, not hours. Every recommendation is grounded in your
                deal context, helping you close faster with greater confidence.
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
                    Surfaces relevant assets based on deal stage, industry, and cloud provider
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Context Agent</h4>
                  <p className="text-sm text-gray-600">
                    Maintains deal intelligence and generates personalized recommendations
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1">Curation Agent</h4>
                  <p className="text-sm text-gray-600">
                    Learns from your interactions to improve future recommendations
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
                  <span>AI-powered asset discovery grounded in deal context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span>Deal-centric pipeline with intelligent recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span>Conversation history for continuous context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span>Curated knowledge base with smart tagging</span>
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
