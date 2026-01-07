import { useState, useEffect } from 'react';
import { X, Eye, Users, Calendar, MessageSquare, Building2, TrendingUp, Target, Lightbulb, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase, Asset, Profile, Deal } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type AssetComment = {
  id: string;
  asset_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
};

type AssetDetailModalProps = {
  asset: Asset;
  profiles: Profile[];
  usageCount: number;
  onClose: () => void;
  onViewAsset?: () => void;
};

export default function AssetDetailModal({ asset, profiles, usageCount, onClose, onViewAsset }: AssetDetailModalProps) {
  const { profile } = useAuth();
  const [comments, setComments] = useState<AssetComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [relatedAssets, setRelatedAssets] = useState<Asset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    loadDealsUsingAsset();
    loadRelatedAssets();
  }, [asset.id]);

  const loadComments = async () => {
    const { data } = await supabase
      .from('asset_comments')
      .select('*')
      .eq('asset_id', asset.id)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  const loadDealsUsingAsset = async () => {
    const { data: linkedAssets } = await supabase
      .from('linked_assets')
      .select('deal_id')
      .eq('asset_id', asset.id);

    if (linkedAssets && linkedAssets.length > 0) {
      const dealIds = linkedAssets.map(la => la.deal_id);
      const { data: dealsData } = await supabase
        .from('deals')
        .select('*')
        .in('id', dealIds)
        .order('created_at', { ascending: false });

      if (dealsData) {
        setDeals(dealsData);
      }
    }
  };

  const loadRelatedAssets = async () => {
    if (!asset.related_asset_ids || asset.related_asset_ids.length === 0) return;

    const { data } = await supabase
      .from('assets')
      .select('*')
      .in('id', asset.related_asset_ids)
      .limit(3);

    if (data) {
      setRelatedAssets(data);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !profile) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('asset_comments')
      .insert({
        asset_id: asset.id,
        user_id: profile.id,
        comment: newComment.trim(),
      });

    if (!error) {
      setNewComment('');
      loadComments();
    }

    setIsSubmitting(false);
  };

  const getProfileName = (profileId: string) => {
    const p = profiles.find(prof => prof.id === profileId);
    return p?.full_name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const categoryLabels: Record<string, string> = {
    concept_demo: 'Concept Demo',
    case_study: 'Case Study',
    testimonial: 'Testimonial',
    one_pager: 'One-Pager',
    video: 'Video',
    tutorial: 'Tutorial',
    sales_play: 'Sales Play',
    proof: 'Proof',
    deck: 'Deck',
    blueprint: 'Blueprint',
    other: 'Other',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">Asset Details</h2>
          <button
            onClick={onClose}
            className="p-0 hover:opacity-70 focus:outline-none"
          >
            <X className="h-4 w-4 stroke-black" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold mb-2">{asset.title}</h3>
                <span className="px-3 py-1 bg-gray-100 text-sm rounded">
                  {categoryLabels[asset.category]}
                </span>
              </div>
              <button
                onClick={onViewAsset}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
              >
                View Asset
              </button>
            </div>
            <p className="text-gray-700 mt-3">{asset.description}</p>
          </div>

          {asset.when_to_use && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-green-700" />
                <h4 className="font-bold text-green-900">When This Works Best</h4>
              </div>
              <div className="prose prose-sm prose-green max-w-none text-sm text-green-900">
                <ReactMarkdown>{asset.when_to_use}</ReactMarkdown>
              </div>
            </div>
          )}

          {asset.positioning_angle && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-blue-700" />
                <h4 className="font-bold text-blue-900">How AEs Position This Asset</h4>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed italic">
                "{asset.positioning_angle}"
              </p>
            </div>
          )}

          {asset.common_next_steps && asset.common_next_steps.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-5 w-5 text-purple-700" />
                <h4 className="font-bold text-purple-900">Common Next Steps After Sharing</h4>
              </div>
              <div className="space-y-2">
                {asset.common_next_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-purple-900">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">Views</span>
              </div>
              <div className="text-2xl font-bold">{asset.view_count}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Used in Deals</span>
              </div>
              <div className="text-2xl font-bold">{usageCount}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">Comments</span>
              </div>
              <div className="text-2xl font-bold">{comments.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Last Used</span>
              </div>
              <div className="text-xs font-medium">
                {asset.last_accessed_at ? formatDate(asset.last_accessed_at) : 'Never'}
              </div>
            </div>
          </div>

          {(asset.best_for_stages && asset.best_for_stages.length > 0) ||
           (asset.best_for_personas && asset.best_for_personas.length > 0) ||
           asset.momentum_indicator || asset.typical_placement ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold mb-4">Usage Signals</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {asset.best_for_stages && asset.best_for_stages.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Most Effective Stage:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.best_for_stages.map(stage => (
                        <span key={stage} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {asset.best_for_personas && asset.best_for_personas.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Best For Persona:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.best_for_personas.map(persona => (
                        <span key={persona} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {persona}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {asset.typical_placement && (
                  <div>
                    <span className="text-gray-600 font-medium">Typical Placement:</span>
                    <p className="mt-1 text-gray-900">{asset.typical_placement}</p>
                  </div>
                )}
                {asset.momentum_indicator && (
                  <div>
                    <span className="text-gray-600 font-medium">Momentum Impact:</span>
                    <p className="mt-1 text-gray-900">{asset.momentum_indicator}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {asset.what_it_is_not && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-700" />
                <h4 className="font-bold text-yellow-900">What This Is / Is Not</h4>
              </div>
              <div className="prose prose-sm prose-yellow max-w-none text-sm text-yellow-900">
                <ReactMarkdown>{asset.what_it_is_not}</ReactMarkdown>
              </div>
            </div>
          )}

          {relatedAssets.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold mb-4">AEs Also Use These Assets</h4>
              <div className="space-y-3">
                {relatedAssets.map(related => (
                  <div key={related.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{related.title}</div>
                      <div className="text-xs text-gray-600 capitalize">{categoryLabels[related.category]}</div>
                    </div>
                    <button className="text-xs text-black font-medium hover:underline">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">Tags & Filters</h4>
            <div className="space-y-2">
              {asset.industry_tags.length > 0 && (
                <div>
                  <span className="text-xs text-gray-600 font-medium">Industries:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.industry_tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {asset.persona_tags.length > 0 && (
                <div>
                  <span className="text-xs text-gray-600 font-medium">Personas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.persona_tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {asset.stage_tags.length > 0 && (
                <div>
                  <span className="text-xs text-gray-600 font-medium">Stages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.stage_tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {asset.cloud_tags.length > 0 && (
                <div>
                  <span className="text-xs text-gray-600 font-medium">Cloud Providers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.cloud_tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {deals.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Deals Using This Asset ({deals.length})
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {deals.map(deal => (
                  <div key={deal.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <div className="font-medium">{deal.company_name}</div>
                      <div className="text-xs text-gray-600">
                        {deal.stage} • ${deal.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getProfileName(deal.assigned_ae_id)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">AE Comments & Insights</h4>
            <div className="space-y-3 mb-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-xl">
                  No comments yet. Be the first to share your insights about this asset.
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{getProfileName(comment.user_id)}</div>
                      <div className="text-xs text-gray-500">{formatDate(comment.created_at)}</div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience using this asset..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSubmitting ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
