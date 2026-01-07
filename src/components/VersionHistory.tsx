import { useState, useEffect } from 'react';
import { X, History, Clock, User } from 'lucide-react';
import { supabase, AssetVersion, Profile } from '../lib/supabase';

type VersionHistoryProps = {
  assetId: string;
  profiles: Profile[];
  onClose: () => void;
};

export default function VersionHistory({ assetId, profiles, onClose }: VersionHistoryProps) {
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<AssetVersion | null>(null);

  useEffect(() => {
    loadVersions();
  }, [assetId]);

  const loadVersions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('asset_versions')
      .select('*')
      .eq('asset_id', assetId)
      .order('version_number', { ascending: false });

    if (data) {
      setVersions(data);
      if (data.length > 0) {
        setSelectedVersion(data[0]);
      }
    }
    setLoading(false);
  };

  const getProfileName = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile?.full_name || 'Unknown';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5" />
            <h3 className="text-xl font-bold">Version History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-gray-500">Loading versions...</div>
          </div>
        ) : versions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No version history available</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Versions</h4>
                <div className="space-y-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`
                        w-full text-left p-3 rounded-lg border transition-colors
                        ${selectedVersion?.id === version.id
                          ? 'bg-gray-100 border-gray-300'
                          : 'border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">v{version.version_number}</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          version.status === 'published' ? 'bg-green-100 text-green-800' :
                          version.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {version.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(version.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{getProfileName(version.changed_by)}</span>
                      </div>
                      {version.change_notes && (
                        <div className="text-xs text-gray-700 mt-2 line-clamp-2">
                          {version.change_notes}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedVersion && (
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{selectedVersion.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>Version {selectedVersion.version_number}</span>
                      <span>•</span>
                      <span>{formatDate(selectedVersion.created_at)}</span>
                      <span>•</span>
                      <span>by {getProfileName(selectedVersion.changed_by)}</span>
                    </div>
                  </div>

                  {selectedVersion.change_notes && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">Change Notes</div>
                      <div className="text-sm text-blue-800">{selectedVersion.change_notes}</div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase">Description</label>
                      <p className="text-sm mt-1">{selectedVersion.description || '-'}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase">URL</label>
                      <p className="text-sm mt-1">
                        {selectedVersion.url ? (
                          <a
                            href={selectedVersion.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedVersion.url}
                          </a>
                        ) : '-'}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase">Category</label>
                      <p className="text-sm mt-1">
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {selectedVersion.category}
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Industry Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVersion.industry_tags.length > 0 ? (
                            selectedVersion.industry_tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Persona Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVersion.persona_tags.length > 0 ? (
                            selectedVersion.persona_tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Stage Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVersion.stage_tags.length > 0 ? (
                            selectedVersion.stage_tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Cloud Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedVersion.cloud_tags.length > 0 ? (
                            selectedVersion.cloud_tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase">Contacts</label>
                      <div className="mt-1 space-y-1">
                        {selectedVersion.contact_ae_id && (
                          <div className="text-sm">
                            <span className="text-gray-600">AE:</span> {getProfileName(selectedVersion.contact_ae_id)}
                          </div>
                        )}
                        {selectedVersion.contact_engineer_id && (
                          <div className="text-sm">
                            <span className="text-gray-600">Engineer:</span> {getProfileName(selectedVersion.contact_engineer_id)}
                          </div>
                        )}
                        {selectedVersion.external_contacts.length > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-600">External Contacts:</span>
                            <ul className="ml-4 mt-1 space-y-1">
                              {selectedVersion.external_contacts.map((contact, idx) => (
                                <li key={idx} className="text-sm">
                                  {contact.name} ({contact.email}) - {contact.role} at {contact.company}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {!selectedVersion.contact_ae_id && !selectedVersion.contact_engineer_id && selectedVersion.external_contacts.length === 0 && (
                          <span className="text-sm text-gray-500">No contacts</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
