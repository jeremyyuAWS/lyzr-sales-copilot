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
    demoText: `Meeting notes from TechFlow Solutions - 3/15/24

Attendees: Sarah Chen (CTO), Mike Rodriguez (VP Engineering), [Me] Alex

Key discussion points:
- They're migrating 200+ microservices from on-prem to AWS
- Current pain: manual deployment process taking 3-4 hours per service
- Interested in our AI-powered deployment automation
- Concerned about security and compliance (SOC 2, HIPAA requirements)
- Budget: $250k-$300k range approved by finance
- Timeline: Want to start pilot in Q2, full rollout by Q3

Buying signals:
- Sarah mentioned "this is exactly what we need"
- Already got budget approval (good sign!)
- Urgency around Q2 timeline

Competitors mentioned:
- Currently evaluating Harness and GitLab
- Prefer our AI capabilities over competitors

Next steps:
- Schedule technical deep-dive with their DevOps team
- Share case study from similar healthcare company
- Send pricing proposal by end of week

Deal size: ~$280k ARR
Close date: Targeting end of Q2`,
  },
  {
    id: 'follow-up-email',
    label: 'Generate Follow-up Email',
    description: 'Create personalized follow-up with recommended assets',
    color: 'bg-green-500 hover:bg-green-600',
    icon: <Mail className="h-4 w-4" />,
    demoText: `Generate a follow-up email for TechFlow Solutions after our discovery call.

Include:
- Summary of their AWS migration challenge
- Link to our healthcare compliance case study
- Suggest next steps (technical deep-dive)
- Attach relevant demo video`,
  },
  {
    id: 'asset-recommendation',
    label: 'Find Best Assets',
    description: 'Get AI recommendations for demos, case studies, and proofs',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: <Target className="h-4 w-4" />,
    demoText: `Find the best assets to share with TechFlow Solutions.

Deal context:
- Industry: Technology/SaaS
- Use case: AWS migration and deployment automation
- Stage: Discovery
- Pain points: Manual deployments, security/compliance concerns
- Competitors: Harness, GitLab

What demos, case studies, or proof points should I share?`,
  },
  {
    id: 'quick-insights',
    label: 'Deal Insights',
    description: 'Analyze deal health and get strategic recommendations',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: <Zap className="h-4 w-4" />,
    demoText: `Analyze my TechFlow Solutions deal and provide insights:

- Deal stage: Discovery
- Amount: $280k ARR
- Close date: End of Q2
- Key stakeholders: CTO, VP Engineering
- Competitors: Harness, GitLab
- Status: Technical deep-dive scheduled next week

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
