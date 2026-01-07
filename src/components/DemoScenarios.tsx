import { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, Mail, Target, Zap } from 'lucide-react';

type DemoScenario = {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  demoText: string;
};

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'meeting-to-hubspot',
    label: 'Meeting Notes → HubSpot',
    description: 'Paste meeting notes and auto-generate HubSpot updates',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: <FileText className="h-4 w-4" />,
    demoText: `Meeting notes from Warby Parker - 3/15/24

Attendees: David Gilboa (Co-CEO), Jennifer Lee (VP Customer Experience), [Me] Alex

Key discussion points:
- Rolling out LensMate AI to personalize customer sales & support across 200+ retail locations
- Current pain: inconsistent customer experience, manual product recommendations
- Interested in our AI-powered personalization and virtual try-on integration
- Concerned about data privacy and customer consent (CCPA/GDPR compliance)
- Budget: $180k-$220k range approved by leadership
- Timeline: Want to pilot in 10 stores by Q2, full rollout by holiday season

Buying signals:
- Jennifer mentioned "this could transform our in-store experience"
- Already got budget approval and executive sponsorship
- Urgency around holiday season preparation

Competitors mentioned:
- Evaluated generic chatbot solutions but found them too basic
- Prefer our retail-specific AI capabilities

Next steps:
- Schedule demo with store managers and customer experience team
- Share case study from Under Armour retail transformation
- Send pricing proposal by end of week

Deal size: ~$195k ARR
Close date: Targeting end of Q2`,
  },
  {
    id: 'follow-up-email',
    label: 'Generate Follow-up Email',
    description: 'Create personalized follow-up with recommended assets',
    color: 'bg-green-500 hover:bg-green-600',
    icon: <Mail className="h-4 w-4" />,
    demoText: `Generate a follow-up email for Accenture M&A after our discovery call.

Include:
- Summary of their deal intelligence and due diligence automation needs
- Link to our financial services case study (Dev Factory)
- Suggest next steps (technical deep-dive with M&A team)
- Attach relevant demo video showing document analysis capabilities`,
  },
  {
    id: 'asset-recommendation',
    label: 'Find Best Assets',
    description: 'Get AI recommendations for demos, case studies, and proofs',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: <Target className="h-4 w-4" />,
    demoText: `Find the best assets to share with Under Armour.

Deal context:
- Industry: Retail/Athletic Apparel
- Use case: PLM Assistant for product intelligence and market insights
- Stage: Discovery
- Pain points: Slow product development cycles, disconnected market data
- Competitors: Legacy PLM systems, manual processes

What demos, case studies, or proof points should I share?`,
  },
  {
    id: 'quick-insights',
    label: 'Deal Insights',
    description: 'Analyze deal health and get strategic recommendations',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: <Zap className="h-4 w-4" />,
    demoText: `Analyze my NVIDIA deal and provide insights:

- Deal stage: Technical Validation
- Amount: $450k ARR
- Close date: End of Q3
- Key stakeholders: VP Enterprise Support, Director of Customer Success
- Competitors: ServiceNow, Zendesk AI
- Status: Enterprise Support Copilot pilot running with 50 engineers

What should I focus on to win this deal?`,
  },
];

type DemoScenariosProps = {
  onScenarioClick: (demoText: string) => void;
};

export default function DemoScenarios({ onScenarioClick }: DemoScenariosProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
          <Play className="h-4 w-4 text-gray-700" />
          <span className="font-semibold text-gray-900">Demo Scenarios</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            Try it out
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Click any scenario to auto-play
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Click a scenario below to see Sales Copilot in action with realistic demo data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onScenarioClick(scenario.demoText)}
                className={`
                  group flex items-start gap-3 p-4 rounded-xl border-2 border-transparent
                  ${scenario.color} text-white
                  transition-all hover:shadow-lg hover:scale-105
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {scenario.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm mb-1">
                    {scenario.label}
                  </div>
                  <div className="text-xs opacity-90">
                    {scenario.description}
                  </div>
                </div>
                <Play className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
