import { Calendar, AlertTriangle, Clock, CheckCircle2, Target, FileText, Eye, Users, Flag, Repeat } from 'lucide-react';

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
  demo: Target,
  proposal: FileText,
  review: Eye,
  meeting: Users,
  deadline: Flag,
  follow_up: Repeat,
};

const MILESTONE_LABELS = {
  demo: 'Demo',
  proposal: 'Proposal',
  review: 'Review',
  meeting: 'Meeting',
  deadline: 'Deadline',
  follow_up: 'Follow-up',
};

type MilestoneGroup = {
  label: string;
  milestones: Milestone[];
  color: string;
};

export default function UpcomingMilestones({ milestones, onMilestoneClick }: UpcomingMilestonesProps) {
  const groupedMilestones = (): MilestoneGroup[] => {
    const overdue = milestones.filter(m => m.is_overdue);
    const today = milestones.filter(m => !m.is_overdue && m.days_until === 0);
    const thisWeek = milestones.filter(m => !m.is_overdue && m.days_until > 0 && m.days_until <= 7);
    const later = milestones.filter(m => !m.is_overdue && m.days_until > 7);

    return [
      { label: 'Overdue', milestones: overdue, color: 'red' },
      { label: 'Today', milestones: today, color: 'orange' },
      { label: 'This Week', milestones: thisWeek, color: 'yellow' },
      { label: 'Later', milestones: later, color: 'gray' },
    ].filter(group => group.milestones.length > 0);
  };
  const groups = groupedMilestones();

  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold">Upcoming Milestones</h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">All caught up! No upcoming milestones in the next 30 days</p>
        </div>
      </div>
    );
  }

  const renderMilestone = (milestone: Milestone) => {
    const Icon = MILESTONE_ICONS[milestone.type];

    return (
      <button
        key={milestone.id}
        onClick={() => onMilestoneClick(milestone.deal_id)}
        className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div className={`p-2 rounded-lg flex-shrink-0 ${
          milestone.is_overdue
            ? 'bg-red-100'
            : milestone.days_until === 0
            ? 'bg-orange-100'
            : milestone.days_until <= 7
            ? 'bg-yellow-100'
            : 'bg-gray-100'
        }`}>
          <Icon className={`h-4 w-4 ${
            milestone.is_overdue
              ? 'text-red-700'
              : milestone.days_until === 0
              ? 'text-orange-700'
              : milestone.days_until <= 7
              ? 'text-yellow-700'
              : 'text-gray-700'
          }`} />
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
              {MILESTONE_LABELS[milestone.type]}
            </span>
            <span className="text-xs font-semibold text-gray-900 truncate">
              {milestone.company_name}
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-black">
            {milestone.title}
          </h4>
          {milestone.notes && (
            <p className="text-xs text-gray-600 line-clamp-2">{milestone.notes}</p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          {milestone.is_overdue ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-red-700 mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-red-700">{Math.abs(milestone.days_until)}d overdue</span>
            </div>
          ) : milestone.days_until === 0 ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-orange-700 mb-1">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-orange-700">Today</span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">
                {new Date(milestone.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {milestone.days_until === 1 ? 'Tomorrow' : `in ${milestone.days_until}d`}
              </span>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold">Upcoming Milestones</h3>
          <span className="text-sm text-gray-500">({milestones.length})</span>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className={`text-xs font-bold uppercase tracking-wide ${
                group.color === 'red' ? 'text-red-700' :
                group.color === 'orange' ? 'text-orange-700' :
                group.color === 'yellow' ? 'text-yellow-700' :
                'text-gray-600'
              }`}>
                {group.label}
              </h4>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className={`text-xs font-semibold ${
                group.color === 'red' ? 'text-red-700' :
                group.color === 'orange' ? 'text-orange-700' :
                group.color === 'yellow' ? 'text-yellow-700' :
                'text-gray-600'
              }`}>
                {group.milestones.length}
              </span>
            </div>
            <div className="space-y-1">
              {group.milestones.slice(0, group.label === 'Later' ? 3 : undefined).map(renderMilestone)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
