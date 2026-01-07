import { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, DollarSign, Calendar, Users, Briefcase, Activity, Send, MessageSquare, Loader2 } from 'lucide-react';
import { supabase, Deal } from '../lib/supabase';

type DealDetailModalProps = {
  dealId: string | null;
  onClose: () => void;
};

export default function DealDetailModal({ dealId, onClose }: DealDetailModalProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [context, setContext] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (dealId) {
      loadDeal();
      loadRecommendations();
      loadActivities();
      loadComments();
    }
  }, [dealId]);

  const loadDeal = async () => {
    if (!dealId) return;

    const { data: dealData } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .maybeSingle();

    const { data: contextData } = await supabase
      .from('deal_context')
      .select('*')
      .eq('deal_id', dealId)
      .maybeSingle();

    if (dealData) setDeal(dealData);
    if (contextData) setContext(contextData);
  };

  const loadRecommendations = async () => {
    if (!dealId) return;

    const { data } = await supabase
      .from('recommendations')
      .select(`
        *,
        asset:assets(*)
      `)
      .eq('deal_id', dealId)
      .order('confidence_score', { ascending: false })
      .limit(6);

    if (data) setRecommendations(data);
  };

  const loadActivities = async () => {
    if (!dealId) return;

    const { data } = await supabase
      .from('deal_activities')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setActivities(data);
  };

  const loadComments = async () => {
    if (!dealId) return;

    const { data } = await supabase
      .from('deal_comments')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (data) setComments(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !dealId || !deal) return;

    setIsSyncing(true);

    try {
      const { data: commentData, error: insertError } = await supabase
        .from('deal_comments')
        .insert({
          deal_id: dealId,
          comment_text: newComment.trim(),
          synced_to_hubspot: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!dealId || !deal) return null;

  const daysSinceActivity = activities.length > 0
    ? Math.floor((Date.now() - new Date(activities[0].created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{deal.company_name}</h2>
              {deal.hubspot_url && (
                <a
                  href={deal.hubspot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>HubSpot</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                {deal.stage}
              </span>
              {deal.industry && <span>{deal.industry}</span>}
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">${deal.amount.toLocaleString()}</span>
              </div>
              {deal.close_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(deal.close_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-0 hover:opacity-70 focus:outline-none ml-4"
          >
            <X className="h-5 w-5 stroke-black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {context?.primary_use_case && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-900">Primary Use Case</h3>
                  <p className="text-sm text-gray-700">{context.primary_use_case}</p>
                </div>
              )}

              {context?.description && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-900">Description</h3>
                  <p className="text-sm text-gray-700">{context.description}</p>
                </div>
              )}

              {context?.meeting_notes && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-900">Latest Notes</h3>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{context.meeting_notes}</p>
                  </div>
                </div>
              )}

              {activities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2">
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{activity.activity_title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{activity.activity_type}</div>
                          </div>
                          <div className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                            {rec.asset.type}
                          </span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">
                            {Math.round(rec.confidence_score * 100)}% match
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{rec.asset.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{rec.reason}</p>
                        {rec.asset.url && (
                          <a
                            href={rec.asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-black hover:underline mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Asset
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h3>

                <div className="space-y-3 mb-3">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-sm text-gray-700">{comment.comment_text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          {comment.synced_to_hubspot && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-xs">
                              Synced to HubSpot
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={isSyncing}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSyncing}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isSyncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
