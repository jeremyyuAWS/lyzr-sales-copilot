import { CheckCircle, AlertTriangle, TrendingUp, Target, Users, Calendar, Zap, Sparkles } from 'lucide-react';

type DealInsightsProps = {
  query: string;
  onClose: () => void;
};

export default function DealInsights({ query, onClose }: DealInsightsProps) {
  const extractDealInfo = (text: string) => {
    const stageMatch = text.match(/stage:\s*(.+?)(?:\n|$)/i);
    const amountMatch = text.match(/amount:\s*\$?([\d,]+)k?/i);
    const closeDateMatch = text.match(/close\s+date:\s*(.+?)(?:\n|$)/i);
    const competitorsMatch = text.match(/competitors?:\s*(.+?)(?:\n|$)/i);

    return {
      stage: stageMatch ? stageMatch[1].trim() : 'Unknown',
      amount: amountMatch ? amountMatch[1] : '0',
      closeDate: closeDateMatch ? closeDateMatch[1].trim() : 'Unknown',
      competitors: competitorsMatch ? competitorsMatch[1].trim() : 'Unknown',
    };
  };

  const dealInfo = extractDealInfo(query);

  const insights = [
    {
      type: 'positive',
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Strong Position',
      description: 'Technical validation stage with pilot running shows high engagement and product-market fit. 50 engineers actively using the solution indicates good adoption.',
      color: 'bg-green-50 border-green-200 text-green-900',
      iconColor: 'text-green-600',
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Competitive Risk',
      description: 'ServiceNow and Zendesk AI are strong competitors with existing market presence. Need to differentiate on AI capabilities and industry-specific features.',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      iconColor: 'text-yellow-600',
    },
    {
      type: 'opportunity',
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Expansion Potential',
      description: 'Success with Enterprise Support Copilot pilot can lead to expansion across other engineering teams and business units. NVIDIA has 20,000+ employees.',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
    },
  ];

  const nextSteps = [
    {
      priority: 'high',
      action: 'Share customer success stories from similar tech companies',
      reasoning: 'Build confidence by showing proven results in comparable environments',
      timeline: 'This Week',
    },
    {
      priority: 'high',
      action: 'Schedule executive business review with VP Enterprise Support',
      reasoning: 'Secure buy-in from economic buyer and discuss ROI metrics from pilot',
      timeline: 'This Week',
    },
    {
      priority: 'medium',
      action: 'Prepare competitive battle card against ServiceNow and Zendesk',
      reasoning: 'Address competitor comparisons proactively with clear differentiation',
      timeline: 'Next Week',
    },
    {
      priority: 'medium',
      action: 'Create expansion roadmap showing phase 2-3 opportunities',
      reasoning: 'Position this as a strategic partnership, not just a point solution',
      timeline: 'Next Week',
    },
  ];

  const recommendedAssets = [
    {
      title: 'Enterprise Support AI - Customer Success Story',
      type: 'Case Study',
      reason: 'Similar industry and use case with proven ROI metrics',
    },
    {
      title: 'AI vs Traditional Support Tools - Comparison Guide',
      type: 'Battle Card',
      reason: 'Direct comparison against ServiceNow and Zendesk AI',
    },
    {
      title: 'Technical Support Copilot Demo',
      type: 'Demo',
      reason: 'Shows advanced AI capabilities for engineering support teams',
    },
  ];

  return (
    <div className="py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Deal Health Analysis</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Back to Search
          </button>
        </div>
        <p className="text-gray-600">AI-powered insights and prescriptive recommendations for your deal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Deal Stage</span>
          </div>
          <p className="text-xl font-bold">{dealInfo.stage}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Deal Value</span>
          </div>
          <p className="text-xl font-bold">${dealInfo.amount}K ARR</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Expected Close</span>
          </div>
          <p className="text-xl font-bold">{dealInfo.closeDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-gray-700" />
          <h3 className="text-xl font-bold">Key Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${insight.color}`}>
              <div className="flex items-start gap-3">
                <div className={insight.iconColor}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-gray-700" />
          <h3 className="text-xl font-bold">Recommended Next Steps</h3>
        </div>
        <div className="space-y-3">
          {nextSteps.map((step, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      step.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {step.priority}
                    </span>
                    <span className="text-xs text-gray-500">{step.timeline}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{step.action}</h4>
                  <p className="text-xs text-gray-600">{step.reasoning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-700" />
          <h3 className="text-xl font-bold">Recommended Assets to Share</h3>
        </div>
        <div className="space-y-3">
          {recommendedAssets.map((asset, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                      {asset.type}
                    </span>
                    <h4 className="font-semibold text-sm">{asset.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{asset.reason}</p>
                </div>
                <button className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 text-xs font-medium">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
