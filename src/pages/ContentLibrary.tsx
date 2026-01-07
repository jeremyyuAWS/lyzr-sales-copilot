import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, BarChart3, History, Eye, Users, TrendingUp, Star, MessageSquare } from 'lucide-react';
import { supabase, Asset, Profile, AssetCategory } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ContentForm from '../components/ContentForm';
import VersionHistory from '../components/VersionHistory';
import ContentAnalytics from '../components/ContentAnalytics';
import AssetDetailModal from '../components/AssetDetailModal';
import Toast from '../components/Toast';

type ViewMode = 'table' | 'grid';
type ContentTab = 'all' | AssetCategory | 'analytics';
type SortBy = 'recent' | 'popular' | 'views';

const categoryLabels: Record<AssetCategory, string> = {
  concept_demo: 'Concept Demos',
  case_study: 'Case Studies',
  testimonial: 'Testimonials',
  one_pager: 'One-Pagers',
  video: 'Videos',
  tutorial: 'Tutorials',
  sales_play: 'Sales Plays',
  proof: 'Proofs',
  deck: 'Decks',
  blueprint: 'Blueprints',
  other: 'Other',
};

export default function ContentLibrary() {
  const { profile } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [showAssetDetail, setShowAssetDetail] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTab, setActiveTab] = useState<ContentTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assetUsage, setAssetUsage] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<SortBy>('popular');
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [personaFilter, setPersonaFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [cloudFilter, setCloudFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isAdmin = profile?.role === 'Admin';

  useEffect(() => {
    loadAssets();
    loadProfiles();
    loadAssetUsage();
    loadCommentCounts();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [searchQuery, statusFilter, activeTab, assets, sortBy, industryFilter, personaFilter, stageFilter, cloudFilter]);

  const loadAssetUsage = async () => {
    const { data } = await supabase
      .from('linked_assets')
      .select('asset_id');

    if (data) {
      const usage: Record<string, number> = {};
      data.forEach((link) => {
        usage[link.asset_id] = (usage[link.asset_id] || 0) + 1;
      });
      setAssetUsage(usage);
    }
  };

  const loadCommentCounts = async () => {
    const { data } = await supabase
      .from('asset_comments')
      .select('asset_id');

    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((comment) => {
        counts[comment.asset_id] = (counts[comment.asset_id] || 0) + 1;
      });
      setCommentCounts(counts);
    }
  };

  const loadProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');

    if (data) {
      setProfiles(data);
    }
  };

  const loadAssets = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setAssets(data);
      setFilteredAssets(data);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (activeTab !== 'all' && activeTab !== 'analytics') {
      filtered = filtered.filter(asset => asset.category === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query) ||
        asset.industry_tags.some(tag => tag.toLowerCase().includes(query)) ||
        asset.persona_tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    if (industryFilter) {
      filtered = filtered.filter(asset => asset.industry_tags.includes(industryFilter));
    }

    if (personaFilter) {
      filtered = filtered.filter(asset => asset.persona_tags.includes(personaFilter));
    }

    if (stageFilter) {
      filtered = filtered.filter(asset => asset.stage_tags.includes(stageFilter));
    }

    if (cloudFilter) {
      filtered = filtered.filter(asset => asset.cloud_tags.includes(cloudFilter));
    }

    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (sortBy === 'views') {
      filtered = [...filtered].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (sortBy === 'recent') {
      filtered = [...filtered].sort((a, b) =>
        new Date(b.last_accessed_at || b.created_at).getTime() -
        new Date(a.last_accessed_at || a.created_at).getTime()
      );
    }

    setFilteredAssets(filtered);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleViewHistory = (assetId: string) => {
    setSelectedAssetId(assetId);
    setShowVersionHistory(true);
  };

  const handleViewAsset = async (assetId: string) => {
    await supabase
      .from('assets')
      .update({
        view_count: assets.find(a => a.id === assetId)!.view_count + 1,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', assetId);

    loadAssets();
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssetDetail(true);
  };

  const handleViewAssetClick = () => {
    setToast({
      message: 'In production, this would open the actual asset file or link',
      type: 'info',
    });
  };

  const getCategoryCount = (category: AssetCategory) => {
    return assets.filter(a => a.category === category).length;
  };

  const getProfileName = (profileId: string | null) => {
    if (!profileId) return '-';
    const profile = profiles.find(p => p.id === profileId);
    return profile?.full_name || '-';
  };

  const categoryTabs: Array<{ id: ContentTab; label: string }> = [
    { id: 'all', label: 'All Content' },
    { id: 'concept_demo', label: categoryLabels.concept_demo },
    { id: 'case_study', label: categoryLabels.case_study },
    { id: 'testimonial', label: categoryLabels.testimonial },
    { id: 'one_pager', label: categoryLabels.one_pager },
    { id: 'deck', label: categoryLabels.deck },
    { id: 'blueprint', label: categoryLabels.blueprint },
    { id: 'sales_play', label: categoryLabels.sales_play },
    { id: 'analytics', label: 'Analytics' },
  ];

  if (activeTab === 'analytics') {
    return <ContentAnalytics assets={assets} profiles={profiles} assetUsage={assetUsage} onBack={() => setActiveTab('all')} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Content Library</h2>
          <p className="text-sm text-gray-600 mt-1">Browse, preview, and reuse sales demos, case studies, and assets—ranked by usage, popularity, and peer feedback. Click any item to see details and how other AEs are using it.</p>
        </div>
        <button
          onClick={() => {
            setEditingAsset(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Content
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label}
                {tab.id !== 'all' && tab.id !== 'analytics' && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-xs rounded">
                    {getCategoryCount(tab.id as AssetCategory)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content by title, description, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Recently Used</option>
              <option value="views">Most Views</option>
            </select>

            {isAdmin && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            )}

            <div className="flex gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Filter by:</span>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
            >
              <option value="">All Industries</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="SaaS">SaaS</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology</option>
            </select>

            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
            >
              <option value="">All Personas</option>
              <option value="AE">AE</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="VP Sales">VP Sales</option>
              <option value="CRO">CRO</option>
              <option value="IT">IT</option>
              <option value="CISO">CISO</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
            >
              <option value="">All Stages</option>
              <option value="Discovery">Discovery</option>
              <option value="Demo">Demo</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
            </select>

            <select
              value={cloudFilter}
              onChange={(e) => setCloudFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-xs"
            >
              <option value="">All Cloud Providers</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">GCP</option>
            </select>

            {(searchQuery || statusFilter || industryFilter || personaFilter || stageFilter || cloudFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setIndustryFilter('');
                  setPersonaFilter('');
                  setStageFilter('');
                  setCloudFilter('');
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <ContentForm
          asset={editingAsset}
          profiles={profiles}
          onClose={() => {
            setShowForm(false);
            setEditingAsset(null);
          }}
          onSave={() => {
            loadAssets();
            setShowForm(false);
            setEditingAsset(null);
          }}
        />
      )}

      {showVersionHistory && (
        <VersionHistory
          assetId={selectedAssetId}
          profiles={profiles}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      {showAssetDetail && selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          profiles={profiles}
          usageCount={assetUsage[selectedAsset.id] || 0}
          onClose={() => {
            setShowAssetDetail(false);
            setSelectedAsset(null);
            loadAssets();
            loadCommentCounts();
          }}
          onViewAsset={handleViewAssetClick}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tags</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Contacts</th>
                {isAdmin && <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>}
                <th className="px-6 py-3 text-left text-sm font-semibold">Engagement</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                    No content found
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleAssetClick(asset)}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{asset.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{asset.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {categoryLabels[asset.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.industry_tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {asset.industry_tags.length > 2 && (
                          <span className="px-2 py-0.5 text-xs text-gray-500">
                            +{asset.industry_tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {asset.contact_ae_id && (
                          <div className="text-gray-900">{getProfileName(asset.contact_ae_id)}</div>
                        )}
                        {asset.external_contacts.length > 0 && (
                          <div className="text-gray-600">+{asset.external_contacts.length} external</div>
                        )}
                        {!asset.contact_ae_id && asset.external_contacts.length === 0 && '-'}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          asset.status === 'published' ? 'bg-green-100 text-green-800' :
                          asset.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span>{asset.view_count}</span>
                        </div>
                        {commentCounts[asset.id] > 0 && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <MessageSquare className="h-3 w-3" />
                            <span>{commentCounts[asset.id]}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewHistory(asset.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Version History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        {(asset.created_by === profile?.id || isAdmin) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(asset);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        )}
                        {asset.url && (
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAsset(asset.id);
                            }}
                            className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                  {categoryLabels[asset.category]}
                </span>
                {isAdmin && (
                  <span className={`px-2 py-1 text-xs rounded ${
                    asset.status === 'published' ? 'bg-green-100 text-green-800' :
                    asset.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{asset.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {asset.industry_tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{asset.view_count}</span>
                  </div>
                  {commentCounts[asset.id] > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <MessageSquare className="h-3 w-3" />
                      <span>{commentCounts[asset.id]}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(asset.created_by === profile?.id || isAdmin) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(asset);
                      }}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      Edit
                    </button>
                  )}
                  {asset.url && (
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAsset(asset.id);
                      }}
                      className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
