import { useState, useEffect } from 'react';
import { Plus, Edit2, ExternalLink } from 'lucide-react';
import { supabase, Asset } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Assets() {
  const { profile } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [assetUsage, setAssetUsage] = useState<Record<string, number>>({});

  const [formData, setFormData] = useState({
    title: '',
    type: 'Demo' as 'Demo' | 'Case Study' | 'Deck' | 'Proof',
    description: '',
    url: '',
    industry_tags: '',
    persona_tags: '',
    stage_tags: '',
    cloud_tags: '',
  });

  useEffect(() => {
    loadAssets();
    loadAssetUsage();
  }, []);

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

  useEffect(() => {
    filterAssets();
  }, [searchQuery, typeFilter, assets]);

  const filterAssets = () => {
    let filtered = assets;

    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.industry_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    setFilteredAssets(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const assetData = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      url: formData.url,
      industry_tags: formData.industry_tags.split(',').map(t => t.trim()).filter(Boolean),
      persona_tags: formData.persona_tags.split(',').map(t => t.trim()).filter(Boolean),
      stage_tags: formData.stage_tags.split(',').map(t => t.trim()).filter(Boolean),
      cloud_tags: formData.cloud_tags.split(',').map(t => t.trim()).filter(Boolean),
      created_by: profile?.id,
    };

    if (editingAsset) {
      await supabase.from('assets').update(assetData).eq('id', editingAsset.id);
    } else {
      await supabase.from('assets').insert(assetData);
    }

    resetForm();
    loadAssets();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Demo',
      description: '',
      url: '',
      industry_tags: '',
      persona_tags: '',
      stage_tags: '',
      cloud_tags: '',
    });
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      title: asset.title,
      type: asset.type,
      description: asset.description,
      url: asset.url,
      industry_tags: asset.industry_tags.join(', '),
      persona_tags: asset.persona_tags.join(', '),
      stage_tags: asset.stage_tags.join(', '),
      cloud_tags: asset.cloud_tags.join(', '),
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Assets Library</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by title, description, or tags..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Types</option>
            <option value="Demo">Demo</option>
            <option value="Case Study">Case Study</option>
            <option value="Deck">Deck</option>
            <option value="Proof">Proof</option>
          </select>
          {(searchQuery || typeFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingAsset ? 'Edit Asset' : 'New Asset'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Demo">Demo</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Deck">Deck</option>
                  <option value="Proof">Proof</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Industry Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.industry_tags}
                  onChange={(e) => setFormData({ ...formData, industry_tags: e.target.value })}
                  placeholder="Banking, Healthcare, FinTech"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Persona Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.persona_tags}
                  onChange={(e) => setFormData({ ...formData, persona_tags: e.target.value })}
                  placeholder="CTO, VP Engineering"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stage Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.stage_tags}
                  onChange={(e) => setFormData({ ...formData, stage_tags: e.target.value })}
                  placeholder="Discovery, Demo, Proposal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cloud Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.cloud_tags}
                  onChange={(e) => setFormData({ ...formData, cloud_tags: e.target.value })}
                  placeholder="AWS, Azure, GCP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                {editingAsset ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tags</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Usage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No assets found
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{asset.title}</div>
                  <div className="text-sm text-gray-600">{asset.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                    {asset.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {asset.industry_tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {asset.industry_tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-gray-500">
                        +{asset.industry_tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{assetUsage[asset.id] || 0}</span>
                    <span className="text-sm text-gray-600">deals</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(asset)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {asset.url && (
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ExternalLink className="h-4 w-4" />
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
    </div>
  );
}
