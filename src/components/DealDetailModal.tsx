import { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, DollarSign, Calendar, Users, Briefcase, Activity, Send, MessageSquare, Loader2, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { supabase, Deal } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type DealDetailModalProps = {
  dealId: string | null;
  onClose: () => void;
};

export default function DealDetailModal({ dealId, onClose }: DealDetailModalProps) {
  const { profile } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [context, setContext] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [showFeedbackFor, setShowFeedbackFor] = useState<string | null>(null);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [isEditingCloudProvider, setIsEditingCloudProvider] = useState(false);
  const [editedCloudProvider, setEditedCloudProvider] = useState('');

  useEffect(() => {
    if (dealId) {
      loadDeal();
      loadRecommendations();
      loadActivities();
      loadComments();
      loadVotes();
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

    if (dealData) {
      setDeal(dealData);
      setEditedNotes(dealData.notes || '');
      setEditedCloudProvider(dealData.cloud_provider || '');
    }
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

  const loadVotes = async () => {
    if (!dealId || !profile) return;

    const { data } = await supabase
      .from('recommendation_feedback')
      .select('recommendation_id, vote')
      .eq('deal_id', dealId)
      .eq('user_id', profile.id);

    if (data) {
      const votesMap: Record<string, 'up' | 'down'> = {};
      data.forEach((v) => {
        votesMap[v.recommendation_id] = v.vote;
      });
      setVotes(votesMap);
    }
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

  const handleVote = async (recId: string, assetId: string, voteType: 'up' | 'down') => {
    if (!profile || !dealId) return;

    if (voteType === 'down') {
      setShowFeedbackFor(recId);
      return;
    }

    try {
      const existing = await supabase
        .from('recommendation_feedback')
        .select('id')
        .eq('recommendation_id', recId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (existing.data) {
        await supabase
          .from('recommendation_feedback')
          .update({ vote: voteType })
          .eq('id', existing.data.id);
      } else {
        await supabase
          .from('recommendation_feedback')
          .insert({
            recommendation_id: recId,
            deal_id: dealId,
            asset_id: assetId,
            user_id: profile.id,
            vote: voteType,
          });
      }

      setVotes({ ...votes, [recId]: voteType });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmitFeedback = async (recId: string, assetId: string) => {
    if (!profile || !dealId || !feedbackReason) return;
    if (feedbackReason === 'other' && !otherReasonText.trim()) return;

    try {
      const existing = await supabase
        .from('recommendation_feedback')
        .select('id')
        .eq('recommendation_id', recId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (existing.data) {
        await supabase
          .from('recommendation_feedback')
          .update({
            vote: 'down',
            feedback_reason: feedbackReason,
            feedback_notes: feedbackReason === 'other' ? otherReasonText : null,
          })
          .eq('id', existing.data.id);
      } else {
        await supabase
          .from('recommendation_feedback')
          .insert({
            recommendation_id: recId,
            deal_id: dealId,
            asset_id: assetId,
            user_id: profile.id,
            vote: 'down',
            feedback_reason: feedbackReason,
            feedback_notes: feedbackReason === 'other' ? otherReasonText : null,
          });
      }

      setVotes({ ...votes, [recId]: 'down' });
      setShowFeedbackFor(null);
      setFeedbackReason('');
      setOtherReasonText('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!dealId) return;

    try {
      const { error } = await supabase
        .from('deals')
        .update({ notes: editedNotes })
        .eq('id', dealId);

      if (!error) {
        setDeal({ ...deal!, notes: editedNotes });
        setIsEditingNotes(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleSaveCloudProvider = async () => {
    if (!dealId) return;

    try {
      const { error } = await supabase
        .from('deals')
        .update({ cloud_provider: editedCloudProvider })
        .eq('id', dealId);

      if (!error) {
        setDeal({ ...deal!, cloud_provider: editedCloudProvider });
        setIsEditingCloudProvider(false);
      }
    } catch (error) {
      console.error('Error saving cloud provider:', error);
    }
  };

  if (!dealId) return null;

  const daysSinceActivity = activities.length > 0
    ? Math.floor((Date.now() - new Date(activities[0].created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {!deal ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Cloud Provider</h3>
                  {!isEditingCloudProvider && (
                    <button
                      onClick={() => setIsEditingCloudProvider(true)}
                      className="text-xs text-gray-600 hover:text-black transition-colors"
                    >
                      {deal?.cloud_provider ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
                {isEditingCloudProvider ? (
                  <div className="space-y-2">
                    <select
                      value={editedCloudProvider}
                      onChange={(e) => setEditedCloudProvider(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Select cloud provider...</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">Google Cloud Platform</option>
                      <option value="Oracle Cloud">Oracle Cloud</option>
                      <option value="IBM Cloud">IBM Cloud</option>
                      <option value="Alibaba Cloud">Alibaba Cloud</option>
                      <option value="Multi-Cloud">Multi-Cloud</option>
                      <option value="On-Premise">On-Premise</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCloudProvider}
                        className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-xs font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingCloudProvider(false);
                          setEditedCloudProvider(deal?.cloud_provider || '');
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    {deal?.cloud_provider || <span className="italic text-gray-400">No cloud provider specified</span>}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Deal Notes</h3>
                  {!isEditingNotes && (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-xs text-gray-600 hover:text-black transition-colors"
                    >
                      {deal?.notes ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add notes about this deal..."
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-xs font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes(deal?.notes || '');
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {deal?.notes || <span className="italic text-gray-400">No notes added yet</span>}
                  </p>
                )}
              </div>

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
                    AI Recommendations ({recommendations.length})
                  </h3>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full capitalize">
                            {rec.asset.category?.replace('_', ' ') || rec.asset.type}
                          </span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">
                            {Math.round(rec.confidence_score * 100)}% match
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-2">{rec.asset.title}</h4>

                        <div className="bg-blue-50 rounded-lg p-2.5 mb-3 border border-blue-100">
                          <p className="text-xs font-medium text-blue-900 mb-1">Why this fits:</p>
                          <p className="text-xs text-blue-800">{rec.reason}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {rec.asset.url && (
                            <a
                              href={rec.asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Asset
                            </a>
                          )}

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleVote(rec.id, rec.asset_id, 'up')}
                              className={`p-2 rounded-lg border transition-colors ${
                                votes[rec.id] === 'up'
                                  ? 'bg-green-50 border-green-300 text-green-700'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                              title="This is helpful"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleVote(rec.id, rec.asset_id, 'down')}
                              className={`p-2 rounded-lg border transition-colors ${
                                votes[rec.id] === 'down'
                                  ? 'bg-red-50 border-red-300 text-red-700'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                              title="Not relevant"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {showFeedbackFor === rec.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-900 mb-2">Why isn't this helpful?</p>
                            <div className="space-y-2 mb-3">
                              {[
                                { value: 'already_shown', label: 'Already showed this to customer' },
                                { value: 'not_interested', label: 'Customer not interested in use case' },
                                { value: 'wrong_industry', label: "Doesn't match customer's industry" },
                                { value: 'wrong_stage', label: 'Wrong deal stage' },
                                { value: 'competitor', label: 'They prefer a competitor solution' },
                                { value: 'outdated', label: 'Content is outdated' },
                                { value: 'too_technical', label: 'Too technical for this audience' },
                                { value: 'other', label: 'Other reason' },
                              ].map((option) => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                  <input
                                    type="radio"
                                    name={`feedback-${rec.id}`}
                                    value={option.value}
                                    checked={feedbackReason === option.value}
                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                    className="text-black focus:ring-black"
                                  />
                                  <span className="text-xs text-gray-700">{option.label}</span>
                                </label>
                              ))}
                            </div>

                            {feedbackReason === 'other' && (
                              <div className="mb-3">
                                <textarea
                                  value={otherReasonText}
                                  onChange={(e) => setOtherReasonText(e.target.value)}
                                  placeholder="Please provide more details..."
                                  rows={3}
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSubmitFeedback(rec.id, rec.asset_id)}
                                disabled={!feedbackReason || (feedbackReason === 'other' && !otherReasonText.trim())}
                                className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                              >
                                Submit Feedback
                              </button>
                              <button
                                onClick={() => {
                                  setShowFeedbackFor(null);
                                  setFeedbackReason('');
                                  setOtherReasonText('');
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
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
        </>
        )}
      </div>
    </div>
  );
}
