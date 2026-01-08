import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Cloud, Sparkles, FileText, LayoutGrid, List, Filter, Target, TrendingUp, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Activity, Clock, CheckSquare, Square, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import DealDetailModal from '../components/DealDetailModal';
import UpcomingMilestones from '../components/UpcomingMilestones';
import DealHealthBreakdown from '../components/DealHealthBreakdown';
import { supabase, Deal } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type DealsProps = {
  onNavigate: (page: string, dealId?: string) => void;
};

const STAGES = ['Discovery', 'Demo', 'Technical Validation', 'Proposal', 'Negotiation', 'Closed Won'];

const CLOUD_COLORS: Record<string, string> = {
  AWS: 'bg-orange-50 text-orange-700 border-orange-200',
  Azure: 'bg-blue-50 text-blue-700 border-blue-200',
  GCP: 'bg-green-50 text-green-700 border-green-200',
  'Multi-Cloud': 'bg-gray-50 text-gray-700 border-gray-200',
};

const CLOUD_ICONS: Record<string, string> = {
  AWS: '☁️',
  Azure: '☁️',
  GCP: '☁️',
  'Multi-Cloud': '☁️',
};

type ViewMode = 'kanban' | 'timeline';

export default function Deals({ onNavigate }: DealsProps) {
  const { profile } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealContexts, setDealContexts] = useState<Record<string, any>>({});
  const [recommendations, setRecommendations] = useState<Record<string, any[]>>({});
  const [activities, setActivities] = useState<Record<string, any[]>>({});
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [cloudFilter, setCloudFilter] = useState<string>('all');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDeals();
    loadRecommendations();
    loadActivities();
    loadMilestones();
    loadTasks();
  }, []);

  const loadDeals = async () => {
    const { data: dealsData } = await supabase
      .from('deals')
      .select('*')
      .order('close_date', { ascending: true });

    const { data: contextsData } = await supabase
      .from('deal_context')
      .select('*');

    if (dealsData) {
      setDeals(dealsData);
      const mostRecentSync = dealsData.reduce((latest: Date | null, deal: any) => {
        if (deal.last_synced_at) {
          const syncDate = new Date(deal.last_synced_at);
          return !latest || syncDate > latest ? syncDate : latest;
        }
        return latest;
      }, null);
      setLastSyncTime(mostRecentSync);
    }
    if (contextsData) {
      const contextsMap: Record<string, any> = {};
      contextsData.forEach((ctx) => {
        contextsMap[ctx.deal_id] = ctx;
      });
      setDealContexts(contextsMap);
    }
  };

  const loadRecommendations = async () => {
    const { data } = await supabase
      .from('recommendations')
      .select(`
        *,
        asset:assets(*)
      `)
      .order('confidence_score', { ascending: false });

    if (data) {
      const recsMap: Record<string, any[]> = {};
      data.forEach((rec) => {
        if (!recsMap[rec.deal_id]) {
          recsMap[rec.deal_id] = [];
        }
        recsMap[rec.deal_id].push(rec);
      });
      setRecommendations(recsMap);
    }
  };

  const loadActivities = async () => {
    const { data } = await supabase
      .from('deal_activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const activitiesMap: Record<string, any[]> = {};
      data.forEach((activity) => {
        if (!activitiesMap[activity.deal_id]) {
          activitiesMap[activity.deal_id] = [];
        }
        activitiesMap[activity.deal_id].push(activity);
      });
      setActivities(activitiesMap);
    }
  };

  const loadMilestones = async () => {
    const { data: milestonesData } = await supabase
      .from('deal_milestones')
      .select('*, deal:deals(company_name)')
      .eq('completed', false)
      .gte('due_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('due_date', { ascending: true });

    if (milestonesData) {
      const enrichedMilestones = milestonesData.map(m => {
        const dueDate = new Date(m.due_date);
        const now = new Date();
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...m,
          company_name: m.deal?.company_name || 'Unknown',
          is_overdue: diffDays < 0,
          days_until: diffDays,
        };
      });
      setMilestones(enrichedMilestones);
    }
  };

  const loadTasks = async () => {
    const { data } = await supabase
      .from('deal_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const tasksMap: Record<string, any[]> = {};
      data.forEach((task) => {
        if (!tasksMap[task.deal_id]) {
          tasksMap[task.deal_id] = [];
        }
        tasksMap[task.deal_id].push(task);
      });
      setTasks(tasksMap);
    }
  };

  const calculateCompletenessScore = (deal: Deal, context: any): number => {
    let score = 0;
    let total = 0;

    const checks = [
      { value: deal.company_name, weight: 5 },
      { value: deal.amount > 0, weight: 5 },
      { value: deal.close_date, weight: 5 },
      { value: deal.industry, weight: 10 },
      { value: context?.description, weight: 15 },
      { value: context?.primary_use_case, weight: 15 },
      { value: context?.cloud_provider, weight: 10 },
      { value: context?.primary_persona, weight: 10 },
      { value: context?.meeting_notes, weight: 15 },
      { value: context?.technical_requirements, weight: 5 },
      { value: context?.pain_points?.length > 0, weight: 5 },
    ];

    checks.forEach(check => {
      total += check.weight;
      if (check.value) score += check.weight;
    });

    return Math.round((score / total) * 100);
  };

  const getCompletenessColor = (score: number): string => {
    if (score >= 75) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getCompletenessIcon = (score: number) => {
    if (score >= 75) return <CheckCircle2 className="h-3.5 w-3.5" />;
    if (score >= 50) return <AlertCircle className="h-3.5 w-3.5" />;
    return <AlertCircle className="h-3.5 w-3.5" />;
  };

  const getDaysSinceLastActivity = (dealId: string): number | null => {
    const dealActivities = activities[dealId];
    if (!dealActivities || dealActivities.length === 0) return null;

    const lastActivity = dealActivities[0];
    const daysDiff = Math.floor((Date.now() - new Date(lastActivity.created_at).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const filteredDeals = cloudFilter === 'all'
    ? deals
    : deals.filter(deal => dealContexts[deal.id]?.cloud_provider === cloudFilter);

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter((deal) => deal.stage === stage);
    return acc;
  }, {} as Record<string, Deal[]>);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getNextActionColor = (deal: Deal): string => {
    if (!deal.next_action_due_date) return 'bg-gray-50 text-gray-700 border-gray-200';
    const dueDate = new Date(deal.next_action_due_date);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-red-50 text-red-700 border-red-200';
    if (diffDays <= 1) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const context = dealContexts[deal.id];
    const dealRecs = recommendations[deal.id] || [];
    const dealTasks = tasks[deal.id] || [];
    const hasNotes = context?.meeting_notes && context.meeting_notes.trim().length > 0;
    const hasUseCase = context?.primary_use_case && context.primary_use_case.trim().length > 0;
    const completenessScore = calculateCompletenessScore(deal, context);
    const daysSinceActivity = getDaysSinceLastActivity(deal.id);
    const isStale = daysSinceActivity !== null && daysSinceActivity >= 7;
    const hasHealthFlags = deal.health_flags && deal.health_flags.length > 0;

    return (
      <GlassCard
        hover
        className="cursor-pointer group"
        onClick={() => setSelectedDealId(deal.id)}
      >
        <div className="space-y-3">
          {deal.next_action && (
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${getNextActionColor(deal)}`}>
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="flex-1">Next: {deal.next_action}</span>
            </div>
          )}

          <div>
            <h4 className="font-bold text-base group-hover:text-black transition-colors mb-2">
              {deal.company_name}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {deal.industry && (
                <span className="text-xs text-gray-500">{deal.industry}</span>
              )}
              {deal.tier && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-xs font-medium flex-shrink-0">
                  {deal.tier}
                </span>
              )}
              {context?.cloud_provider && (
                <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex-shrink-0 ${CLOUD_COLORS[context.cloud_provider] || 'bg-gray-100 text-gray-800'}`}>
                  {CLOUD_ICONS[context.cloud_provider]} {context.cloud_provider}
                </div>
              )}
              {isStale && (
                <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium flex-shrink-0">
                  Needs Attention
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${getCompletenessColor(completenessScore)}`}>
              {getCompletenessIcon(completenessScore)}
              <span>{completenessScore}% Complete</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>${(deal.amount / 1000).toFixed(0)}K</span>
            </div>
            {deal.close_date && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{new Date(deal.close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          {hasUseCase && (
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <div className="flex items-start gap-2">
                <Target className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  {truncateText(context.primary_use_case, 80)}
                </p>
              </div>
            </div>
          )}

          {hasNotes && (
            <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
              <div className="flex items-start gap-2">
                <FileText className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  {truncateText(context.meeting_notes, 100)}
                </p>
              </div>
            </div>
          )}

          {hasHealthFlags && (
            <div className="border-t border-gray-200 pt-3">
              <DealHealthBreakdown
                flags={deal.health_flags}
                daysSinceActivity={daysSinceActivity}
              />
            </div>
          )}

          {dealTasks.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTasks(prev => ({ ...prev, [deal.id]: !prev[deal.id] }));
                }}
                className="w-full flex items-center justify-between mb-2 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-gray-700" />
                  <span className="text-xs font-medium text-gray-900">
                    Tasks ({dealTasks.filter(t => t.status === 'completed').length}/{dealTasks.length})
                  </span>
                </div>
                <span className="text-xs text-gray-500">{expandedTasks[deal.id] ? '−' : '+'}</span>
              </button>

              {expandedTasks[deal.id] && (
                <div className="space-y-1.5">
                  {dealTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-start gap-2 px-2 py-1.5 bg-gray-50 rounded text-xs">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : task.status === 'overdue' ? (
                        <AlertCircle className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {dealRecs.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-medium text-black">{dealRecs.length} AI Recommendations</span>
                </div>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div className="space-y-1.5">
                {dealRecs.slice(0, 2).map((rec, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{rec.asset.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{rec.asset.type} • {Math.round(rec.confidence_score * 100)}% match</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activities[deal.id] && activities[deal.id].length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Activity className="h-3.5 w-3.5" />
                <span>
                  Last activity: {daysSinceActivity === 0 ? 'Today' : daysSinceActivity === 1 ? 'Yesterday' : `${daysSinceActivity} days ago`}
                </span>
              </div>
            </div>
          )}

          {dealRecs.length === 0 && !hasNotes && (!activities[deal.id] || activities[deal.id].length === 0) && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-400 italic">Add context to get AI recommendations</p>
            </div>
          )}
        </div>
      </GlassCard>
    );
  };

  const cloudProviders = ['all', 'AWS', 'Azure', 'GCP', 'Multi-Cloud'];
  const activeCloudDeals = cloudProviders.slice(1).map(provider =>
    deals.filter(d => dealContexts[d.id]?.cloud_provider === provider).length
  );

  const formatSyncTime = (date: Date | null): string => {
    if (!date) return 'Never';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {lastSyncTime && (
        <div className="mb-4 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">HubSpot Connected</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last sync: {formatSyncTime(lastSyncTime)}</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <UpcomingMilestones
        milestones={milestones}
        onMilestoneClick={(dealId) => setSelectedDealId(dealId)}
      />

      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">My Deals</h1>
          <p className="text-sm text-gray-600 mt-1">
            {deals.length} active {deals.length === 1 ? 'deal' : 'deals'} in pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Stage View</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Timeline View</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={cloudFilter}
              onChange={(e) => setCloudFilter(e.target.value)}
              className="text-sm font-medium border-none focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">All Clouds ({deals.length})</option>
              <option value="AWS">AWS ({activeCloudDeals[0]})</option>
              <option value="Azure">Azure ({activeCloudDeals[1]})</option>
              <option value="GCP">GCP ({activeCloudDeals[2]})</option>
              <option value="Multi-Cloud">Multi-Cloud ({activeCloudDeals[3]})</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {STAGES.map((stage) => (
              <div key={stage} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                  <h3 className="font-bold text-base">{stage}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      {dealsByStage[stage].length} {dealsByStage[stage].length === 1 ? 'deal' : 'deals'}
                    </p>
                    {dealsByStage[stage].length > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm font-semibold text-gray-900">
                          ${dealsByStage[stage].reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {dealsByStage[stage].map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  {dealsByStage[stage].length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {(() => {
              const dealsByDate: Record<string, Deal[]> = {
                'Overdue': [],
                'Today': [],
                'This Week': [],
                'Next Week': [],
                'Later': [],
              };

              filteredDeals.forEach((deal) => {
                if (!deal.next_action_due_date) {
                  dealsByDate['Later'].push(deal);
                  return;
                }

                const dueDate = new Date(deal.next_action_due_date);
                const now = new Date();
                const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                  dealsByDate['Overdue'].push(deal);
                } else if (diffDays === 0) {
                  dealsByDate['Today'].push(deal);
                } else if (diffDays <= 7) {
                  dealsByDate['This Week'].push(deal);
                } else if (diffDays <= 14) {
                  dealsByDate['Next Week'].push(deal);
                } else {
                  dealsByDate['Later'].push(deal);
                }
              });

              return Object.entries(dealsByDate).map(([timeframe, timeframeDeals]) => {
                if (timeframeDeals.length === 0) return null;

                return (
                  <div key={timeframe}>
                    <div className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-base ${
                          timeframe === 'Overdue' ? 'text-red-700' :
                          timeframe === 'Today' ? 'text-orange-700' :
                          'text-gray-900'
                        }`}>
                          {timeframe}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            {timeframeDeals.length} {timeframeDeals.length === 1 ? 'deal' : 'deals'}
                          </p>
                          <span className="text-gray-400">•</span>
                          <p className="text-sm font-semibold text-gray-900">
                            ${timeframeDeals.reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {timeframeDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  </div>
                );
              }).filter(Boolean);
            })()}

            {filteredDeals.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No deals match the current filter
              </div>
            )}
          </div>
        </div>
      )}

      <DealDetailModal
        dealId={selectedDealId}
        onClose={() => setSelectedDealId(null)}
      />
    </div>
  );
}
