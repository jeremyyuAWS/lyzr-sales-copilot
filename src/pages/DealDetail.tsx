import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, ExternalLink, Link as LinkIcon, X, Sparkles, TrendingUp, DollarSign, Users, Briefcase, AlertCircle, Activity, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from '../components/GlassCard';
import { supabase, Deal, DealContext, Asset } from '../lib/supabase';

type DealDetailProps = {
  dealId: string;
  onNavigate: (page: string) => void;
};

export default function DealDetail({ dealId, onNavigate }: DealDetailProps) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [context, setContext] = useState<DealContext | null>(null);
  const [editing, setEditing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [linkedAssets, setLinkedAssets] = useState<any[]>([]);
  const [similarDeals, setSimilarDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    description: '',
    primary_use_case: '',
    cloud_provider: '',
    primary_persona: '',
    meeting_notes: '',
    technical_requirements: '',
    pain_points: [] as string[],
    competitor_landscape: '',
  });

  useEffect(() => {
    loadDeal();
    loadRecommendations();
    loadLinkedAssets();
    loadSimilarDeals();
    loadActivities();
  }, [dealId]);

  const loadDeal = async () => {
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
    if (contextData) {
      setContext(contextData);
      setFormData({
        description: contextData.description || '',
        primary_use_case: contextData.primary_use_case || '',
        cloud_provider: contextData.cloud_provider || '',
        primary_persona: contextData.primary_persona || '',
        meeting_notes: contextData.meeting_notes || '',
        technical_requirements: contextData.technical_requirements || '',
        pain_points: contextData.pain_points || [],
        competitor_landscape: contextData.competitor_landscape || '',
      });
    }
  };

  const loadRecommendations = async () => {
    const { data } = await supabase
      .from('recommendations')
      .select(`
        *,
        asset:assets(*)
      `)
      .eq('deal_id', dealId)
      .order('confidence_score', { ascending: false });

    if (data) setRecommendations(data);
  };

  const loadActivities = async () => {
    const { data } = await supabase
      .from('deal_activities')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (data) setActivities(data);
  };

  const loadLinkedAssets = async () => {
    const { data } = await supabase
      .from('linked_assets')
      .select(`
        *,
        asset:assets(*)
      `)
      .eq('deal_id', dealId)
      .order('order_index', { ascending: true });

    if (data) setLinkedAssets(data);
  };

  const loadSimilarDeals = async () => {
    if (!deal) return;

    const { data } = await supabase
      .from('deals')
      .select('*')
      .neq('id', dealId)
      .or(`industry.eq.${deal.industry},stage.eq.${deal.stage}`)
      .limit(3);

    if (data) setSimilarDeals(data);
  };

  const handleSave = async () => {
    if (!context) {
      await supabase.from('deal_context').insert({
        deal_id: dealId,
        ...formData,
      });
    } else {
      await supabase
        .from('deal_context')
        .update(formData)
        .eq('id', context.id);
    }

    setEditing(false);
    loadDeal();
  };

  const handleLinkAsset = async (assetId: string) => {
    await supabase.from('linked_assets').insert({
      deal_id: dealId,
      asset_id: assetId,
      linked_by: deal?.assigned_ae_id,
      order_index: linkedAssets.length,
    });

    loadLinkedAssets();
  };

  const handleUnlinkAsset = async (linkedAssetId: string) => {
    await supabase.from('linked_assets').delete().eq('id', linkedAssetId);
    loadLinkedAssets();
  };

  const handleLinkAllRecommendations = async () => {
    const unlinkted = recommendations.filter(
      rec => !linkedAssets.some(linked => linked.asset_id === rec.asset_id)
    );

    for (let i = 0; i < unlinkted.length; i++) {
      await supabase.from('linked_assets').insert({
        deal_id: dealId,
        asset_id: unlinkted[i].asset_id,
        linked_by: deal?.assigned_ae_id,
        order_index: linkedAssets.length + i,
      });
    }

    loadLinkedAssets();
  };

  if (!deal) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => onNavigate('deals')}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pipeline
      </button>

      <GlassCard className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{deal.company_name}</h1>
              {deal.hubspot_url && (
                <a
                  href={deal.hubspot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View in HubSpot</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                {deal.stage}
              </span>
              {deal.industry && (
                <span className="text-sm">{deal.industry}</span>
              )}
              <span className="font-semibold">${deal.amount.toLocaleString()}</span>
              {deal.close_date && (
                <span>Close: {new Date(deal.close_date).toLocaleDateString()}</span>
              )}
            </div>
            {deal.hubspot_id && (
              <div className="mt-2 text-xs text-gray-500">
                HubSpot ID: {deal.hubspot_id}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Deal Context</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              {editing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  placeholder="Describe this deal..."
                />
              ) : (
                <div className="prose prose-sm max-w-none text-gray-700">
                  {formData.description ? (
                    <ReactMarkdown>{formData.description}</ReactMarkdown>
                  ) : (
                    <p>No description</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Use Case</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.primary_use_case}
                  onChange={(e) => setFormData({ ...formData, primary_use_case: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Cloud Migration"
                />
              ) : (
                <p className="text-gray-700">{formData.primary_use_case || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cloud Provider</label>
              {editing ? (
                <select
                  value={formData.cloud_provider}
                  onChange={(e) => setFormData({ ...formData, cloud_provider: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select...</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="Multi-Cloud">Multi-Cloud</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.cloud_provider || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Persona</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.primary_persona}
                  onChange={(e) => setFormData({ ...formData, primary_persona: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., CTO, VP Engineering"
                />
              ) : (
                <p className="text-gray-700">{formData.primary_persona || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meeting Notes</label>
              {editing ? (
                <textarea
                  value={formData.meeting_notes}
                  onChange={(e) => setFormData({ ...formData, meeting_notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={4}
                  placeholder="Paste meeting notes, call summaries, or key discussion points here..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{formData.meeting_notes || 'No notes yet'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technical Requirements</label>
              {editing ? (
                <textarea
                  value={formData.technical_requirements}
                  onChange={(e) => setFormData({ ...formData, technical_requirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  placeholder="Technical specifications, integrations, compliance needs..."
                />
              ) : (
                <p className="text-gray-700 text-sm">{formData.technical_requirements || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Competitor Landscape</label>
              {editing ? (
                <textarea
                  value={formData.competitor_landscape}
                  onChange={(e) => setFormData({ ...formData, competitor_landscape: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={2}
                  placeholder="Who else are they evaluating? What are their concerns?"
                />
              ) : (
                <p className="text-gray-700 text-sm">{formData.competitor_landscape || 'Not specified'}</p>
              )}
            </div>
          </div>

          {context?.pain_points && context.pain_points.length > 0 && !editing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Customer Pain Points
              </h3>
              <div className="flex flex-wrap gap-2">
                {context.pain_points.map((pain, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                    {pain}
                  </span>
                ))}
              </div>
            </div>
          )}

          {context?.decision_makers && Array.isArray(context.decision_makers) && context.decision_makers.length > 0 && !editing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Key Decision Makers
              </h3>
              <div className="space-y-2">
                {context.decision_makers.map((dm: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{dm.name}</div>
                      <div className="text-xs text-gray-600">{dm.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{dm.role}</div>
                    </div>
                    {dm.influence && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        dm.influence === 'high' ? 'bg-green-50 text-green-700 border border-green-200' :
                        dm.influence === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {dm.influence}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Linked Assets</h2>
            {linkedAssets.length === 0 ? (
              <p className="text-gray-500 text-sm">No assets linked yet</p>
            ) : (
              <div className="space-y-2">
                {linkedAssets.map((linked) => (
                  <div
                    key={linked.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{linked.asset.title}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {(linked.asset.category || linked.asset.type)?.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {linked.asset.url && (
                        <a
                          href={linked.asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-200 rounded-lg"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleUnlinkAsset(linked.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {activities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Timeline
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                        {activity.activity_type === 'Meeting Held' && <Users className="h-4 w-4" />}
                        {activity.activity_type === 'Email Sent' && <Briefcase className="h-4 w-4" />}
                        {activity.activity_type === 'Demo Shown' && <Sparkles className="h-4 w-4" />}
                        {activity.activity_type === 'Call Completed' && <Activity className="h-4 w-4" />}
                        {(activity.activity_type === 'Proposal Sent' || activity.activity_type === 'Asset Shared') && <LinkIcon className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-sm">{activity.activity_title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {activity.activity_type}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <Calendar className="h-3 w-3" />
                          {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {activity.activity_notes && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {activity.activity_notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-bold">AI Recommendations</h2>
          </div>
          {recommendations.length > 0 && (
            <button
              onClick={handleLinkAllRecommendations}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Link All
            </button>
          )}
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Add more deal context to get AI-powered asset recommendations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <GlassCard key={rec.id} hover>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-black text-white text-xs rounded-full capitalize">
                    {(rec.asset.category || rec.asset.type)?.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">
                    {Math.round(rec.confidence_score * 100)}% match
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-sm">{rec.asset.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">{rec.reason}</p>
                <div className="flex items-center gap-2 mt-auto">
                  {rec.asset.url && (
                    <a
                      href={rec.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleLinkAsset(rec.asset_id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                    disabled={linkedAssets.some(linked => linked.asset_id === rec.asset_id)}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {linkedAssets.some(linked => linked.asset_id === rec.asset_id) ? 'Linked' : 'Link'}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {similarDeals.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-xl font-bold">Similar Deals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarDeals.map((similarDeal) => (
              <div
                key={similarDeal.id}
                onClick={() => onNavigate('deal-detail', similarDeal.id)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-semibold mb-2">{similarDeal.company_name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stage</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {similarDeal.stage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">${similarDeal.amount.toLocaleString()}</span>
                  </div>
                  {similarDeal.industry && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="text-xs">{similarDeal.industry}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
