import { Calendar, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

type Milestone = {
  id: string;
  deal_id: string;
  company_name: string;
  title: string;
  type: 'demo' | 'proposal' | 'review' | 'meeting' | 'deadline' | 'follow_up';
  due_date: string;
  notes?: string;
  is_overdue: boolean;
  days_until: number;
};

type UpcomingMilestonesProps = {
  milestones: Milestone[];
  onMilestoneClick: (dealId: string) => void;
};

const MILESTONE_ICONS = {
  demo: '🎯',
  proposal: '📄',
  review: '👁️',
  meeting: '📅',
  deadline: '⏰',
  follow_up: '🔁',
};

export default function UpcomingMilestones({ milestones, onMilestoneClick }: UpcomingMilestonesProps) {
  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold">Upcoming Milestones</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">No upcoming milestones in the next 30 days</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold">Upcoming Milestones</h3>
          <span className="text-sm text-gray-500">({milestones.length} next 30 days)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-red-50 text-red-700 rounded">Overdue</span>
          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded">This Week</span>
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded">Upcoming</span>
        </div>
      </div>

      <div className="space-y-2">
        {milestones.map((milestone) => (
          <button
            key={milestone.id}
            onClick={() => onMilestoneClick(milestone.deal_id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border ${
              milestone.is_overdue
                ? 'bg-red-50 border-red-200'
                : milestone.days_until <= 3
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">{MILESTONE_ICONS[milestone.type]}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${
                    milestone.is_overdue ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    {milestone.title}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs font-medium text-gray-700">{milestone.company_name}</span>
                </div>
                {milestone.notes && (
                  <p className="text-xs text-gray-600">{milestone.notes}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {milestone.is_overdue ? (
                <div className="flex items-center gap-1 text-red-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{Math.abs(milestone.days_until)} days overdue</span>
                </div>
              ) : milestone.days_until === 0 ? (
                <div className="flex items-center gap-1 text-orange-700">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Today</span>
                </div>
              ) : milestone.days_until === 1 ? (
                <div className="flex items-center gap-1 text-yellow-700">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Tomorrow</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">
                    {new Date(milestone.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
