import { AlertCircle, AlertTriangle, Clock, Users, FileText, TrendingDown } from 'lucide-react';

type HealthFlag =
  | 'no_activity'
  | 'missing_economic_buyer'
  | 'no_response_to_proposal'
  | 'competitive_pressure'
  | 'follow_up_overdue'
  | 'missing_technical_champion'
  | 'stalled'
  | 'budget_concerns';

type DealHealthBreakdownProps = {
  flags: HealthFlag[];
  daysSinceActivity?: number;
};

const HEALTH_FLAG_CONFIG: Record<HealthFlag, {
  icon: React.ReactNode;
  label: string;
  description: string;
  severity: 'critical' | 'warning';
  color: string;
}> = {
  no_activity: {
    icon: <Clock className="h-4 w-4" />,
    label: 'No Recent Activity',
    description: 'No engagement in 10+ days',
    severity: 'critical',
    color: 'text-red-700',
  },
  missing_economic_buyer: {
    icon: <Users className="h-4 w-4" />,
    label: 'Missing Economic Buyer',
    description: 'No decision maker identified or engaged',
    severity: 'critical',
    color: 'text-red-700',
  },
  no_response_to_proposal: {
    icon: <FileText className="h-4 w-4" />,
    label: 'Proposal Sent, No Response',
    description: 'Waiting for feedback on proposal',
    severity: 'warning',
    color: 'text-yellow-700',
  },
  competitive_pressure: {
    icon: <TrendingDown className="h-4 w-4" />,
    label: 'Competitive Pressure Detected',
    description: 'Customer evaluating alternative solutions',
    severity: 'warning',
    color: 'text-yellow-700',
  },
  follow_up_overdue: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Follow-up Overdue',
    description: 'Planned follow-up action is past due',
    severity: 'critical',
    color: 'text-red-700',
  },
  missing_technical_champion: {
    icon: <Users className="h-4 w-4" />,
    label: 'No Technical Champion',
    description: 'Need to identify technical stakeholder',
    severity: 'warning',
    color: 'text-yellow-700',
  },
  stalled: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Deal Stalled',
    description: 'No clear next steps or momentum',
    severity: 'critical',
    color: 'text-red-700',
  },
  budget_concerns: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Budget Questions',
    description: 'Pricing or budget concerns raised',
    severity: 'warning',
    color: 'text-yellow-700',
  },
};

export default function DealHealthBreakdown({ flags, daysSinceActivity }: DealHealthBreakdownProps) {
  if (!flags || flags.length === 0) {
    return null;
  }

  const criticalFlags = flags.filter(flag => HEALTH_FLAG_CONFIG[flag]?.severity === 'critical');
  const warningFlags = flags.filter(flag => HEALTH_FLAG_CONFIG[flag]?.severity === 'warning');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-700" />
        <h4 className="font-semibold text-sm">Why This Deal Needs Attention</h4>
      </div>

      <div className="space-y-2">
        {daysSinceActivity !== null && daysSinceActivity !== undefined && daysSinceActivity >= 10 && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-700 mt-0.5">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-red-900">No activity in {daysSinceActivity} days</div>
              <div className="text-xs text-red-700 mt-0.5">Deal at risk of going cold</div>
            </div>
          </div>
        )}

        {criticalFlags.map((flag) => {
          const config = HEALTH_FLAG_CONFIG[flag];
          return (
            <div key={flag} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className={`${config.color} mt-0.5`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-red-900">{config.label}</div>
                <div className="text-xs text-red-700 mt-0.5">{config.description}</div>
              </div>
            </div>
          );
        })}

        {warningFlags.map((flag) => {
          const config = HEALTH_FLAG_CONFIG[flag];
          return (
            <div key={flag} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className={`${config.color} mt-0.5`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-yellow-900">{config.label}</div>
                <div className="text-xs text-yellow-700 mt-0.5">{config.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
