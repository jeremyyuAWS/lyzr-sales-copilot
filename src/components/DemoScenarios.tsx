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
Close date: Targeting end of Q2
Cloud provider: AWS`,
  },
  {
    id: 'follow-up-email',
    label: 'Generate Follow-up Email',
    description: 'Create personalized follow-up with recommended assets',
    color: 'bg-green-500 hover:bg-green-600',
    icon: <Mail className="h-4 w-4" />,
    demoText: `Write a follow-up email to Accenture M&A after yesterday's discovery call.

Meeting recap:
- Discussed their need for AI-powered deal intelligence and due diligence automation
- Pain points: Manual document analysis taking 3-4 weeks per deal, high error rates
- Timeline: Want to pilot on 2 active deals starting next month
- Budget: $300k+ approved for FY2024
- Key contact: Marcus Thompson (VP M&A Operations)

Email should:
- Thank them for their time and recap key discussion points
- Reference our Dev Factory case study (financial services M&A automation)
- Include link to our document analysis demo video
- Propose next steps: technical deep-dive with their M&A team next week
- Professional, concise tone`,
  },
  {
    id: 'asset-recommendation',
    label: 'Find Best Assets',
    description: 'Get AI recommendations for demos, case studies, and proofs',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: <Target className="h-4 w-4" />,
    demoText: `I'm preparing for a call with Under Armour next week. Can you recommend the most relevant assets from our content library?

Context:
- Industry: Retail/Athletic Apparel
- Use case: PLM Assistant for product intelligence and market insights
- Stage: Discovery
- Pain points: Slow product development cycles, disconnected market data, need real-time market intelligence
- Key decision makers: VP Product Development, Director of Innovation

Please search our content library and recommend:
1. Best demo videos to share
2. Relevant case studies from similar industries
3. Technical proofs or ROI calculators
4. Battle cards if competing with legacy systems`,
  },
  {
    id: 'quick-insights',
    label: 'Deal Insights',
    description: 'Analyze deal health and get strategic recommendations',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: <Zap className="h-4 w-4" />,
    demoText: `Analyze the health and risk factors for my NVIDIA Enterprise Support Copilot deal:

Current status:
- Deal stage: Technical Validation
- Amount: $450k ARR
- Close date: End of Q3 (90 days away)
- Last activity: Demo 2 weeks ago
- Key stakeholders: VP Enterprise Support, Director of Customer Success
- Champion: Engineering Manager (Sarah Chen)
- Competitors: ServiceNow, Zendesk AI
- Pilot status: Running with 50 engineers for 3 weeks

Concerns:
- Haven't heard back since the pilot started
- Procurement team not yet engaged
- Security review not initiated

What's the deal health score? What risks should I address? What are the next critical actions?`,
  },
];

type DemoScenariosProps = {
  onScenarioClick: (demoText: string) => void;
};

export default function DemoScenarios({ onScenarioClick }: DemoScenariosProps) {
  const [isOpen, setIsOpen] = useState(false);

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
