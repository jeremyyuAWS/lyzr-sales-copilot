import { useState, useEffect } from 'react';
import { X, Eye, Users, Calendar, MessageSquare, Building2, TrendingUp } from 'lucide-react';
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
};

export default function AssetDetailModal({ asset, profiles, usageCount, onClose }: AssetDetailModalProps) {
  const { profile } = useAuth();
  const [comments, setComments] = useState<AssetComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    loadDealsUsingAsset();
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
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
              {asset.url && (
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                >
                  View Asset
                </a>
              )}
            </div>
            <p className="text-gray-700 mt-3">{asset.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">Views</span>
              </div>
              <div className="text-2xl font-bold">{asset.view_count}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Used in Deals</span>
              </div>
              <div className="text-2xl font-bold">{usageCount}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">Comments</span>
              </div>
              <div className="text-2xl font-bold">{comments.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Last Accessed</span>
              </div>
              <div className="text-xs font-medium">
                {asset.last_accessed_at ? formatDate(asset.last_accessed_at) : 'Never'}
              </div>
            </div>
          </div>

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

          {asset.contact_ae_id && (
            <div>
              <h4 className="font-semibold mb-2">Internal Contact</h4>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">{getProfileName(asset.contact_ae_id)}</span>
                  <span className="text-xs text-gray-500">AE Contact</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">AE Comments & Insights</h4>
            <div className="space-y-3 mb-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No comments yet. Be the first to share your insights about this asset.
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{getProfileName(comment.user_id)}</div>
                      <div className="text-xs text-gray-500">{formatDate(comment.created_at)}</div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
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
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
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
