import { ArrowLeft, TrendingUp, Eye, FileText, Users, Package } from 'lucide-react';
import { Asset, Profile } from '../lib/supabase';

type ContentAnalyticsProps = {
  assets: Asset[];
  profiles: Profile[];
  assetUsage: Record<string, number>;
  onBack: () => void;
};

export default function ContentAnalytics({ assets, profiles, assetUsage, onBack }: ContentAnalyticsProps) {
  const totalContent = assets.length;
  const publishedContent = assets.filter(a => a.status === 'published').length;
  const draftContent = assets.filter(a => a.status === 'draft').length;
  const totalViews = assets.reduce((sum, asset) => sum + asset.view_count, 0);

  const contentByCategory = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topViewedContent = [...assets]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);

  const mostUsedContent = [...assets]
    .sort((a, b) => (assetUsage[b.id] || 0) - (assetUsage[a.id] || 0))
    .slice(0, 5);

  const unusedContent = assets.filter(a => !assetUsage[a.id] || assetUsage[a.id] === 0);

  const contentByCreator = assets.reduce((acc, asset) => {
    if (asset.created_by) {
      acc[asset.created_by] = (acc[asset.created_by] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCreators = Object.entries(contentByCreator)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([profileId, count]) => ({
      profile: profiles.find(p => p.id === profileId),
      count,
    }));

  const getProfileName = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile?.full_name || 'Unknown';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content Library
        </button>
        <div>
          <h2 className="text-2xl font-bold">Content Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">Performance and usage insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalContent}</div>
          <div className="text-sm text-gray-600">Total Content</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{publishedContent}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalViews}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold mb-1">{draftContent}</div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Content by Category</h3>
          <div className="space-y-3">
            {Object.entries(contentByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${(count / totalContent) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Content by Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Published</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(publishedContent / totalContent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{publishedContent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Draft</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(draftContent / totalContent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{draftContent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Archived</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: `${((totalContent - publishedContent - draftContent) / totalContent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{totalContent - publishedContent - draftContent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Most Viewed Content</h3>
          <div className="space-y-3">
            {topViewedContent.map((asset, index) => (
              <div key={asset.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{asset.title}</div>
                  <div className="text-xs text-gray-600 capitalize">{asset.category.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Eye className="h-3 w-3 text-gray-400" />
                  <span className="font-semibold">{asset.view_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Most Used in Deals</h3>
          <div className="space-y-3">
            {mostUsedContent.map((asset, index) => (
              <div key={asset.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{asset.title}</div>
                  <div className="text-xs text-gray-600 capitalize">{asset.category.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-semibold">{assetUsage[asset.id] || 0}</span>
                  <span className="text-gray-600">deals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {topCreators.map(({ profile, count }, index) => (
              <div key={profile?.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 w-6">{index + 1}</span>
                <div className="flex items-center gap-2 flex-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{profile?.full_name || 'Unknown'}</span>
                </div>
                <span className="text-sm font-semibold">{count} items</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Unused Content</h3>
          <p className="text-sm text-gray-600 mb-4">
            {unusedContent.length} content items have never been linked to a deal
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {unusedContent.slice(0, 10).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{asset.title}</div>
                  <div className="text-xs text-gray-600 capitalize">{asset.category.replace('_', ' ')}</div>
                </div>
                <span className="text-xs text-gray-500 ml-2">{asset.view_count} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
