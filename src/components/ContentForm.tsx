import { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { supabase, Asset, Profile, AssetCategory, AssetStatus, ExternalContact } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ContactPicker from './ContactPicker';
import TagInput from './TagInput';

type ContentFormProps = {
  asset: Asset | null;
  profiles: Profile[];
  onClose: () => void;
  onSave: () => void;
};

const categoryOptions: Array<{ value: AssetCategory; label: string }> = [
  { value: 'concept_demo', label: 'Concept Demo' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'one_pager', label: 'One-Pager' },
  { value: 'video', label: 'Video' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'sales_play', label: 'Sales Play' },
  { value: 'proof', label: 'Proof' },
  { value: 'deck', label: 'Deck' },
  { value: 'other', label: 'Other' },
];

export default function ContentForm({ asset, profiles, onClose, onSave }: ContentFormProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'other' as AssetCategory,
    description: '',
    url: '',
    industry_tags: [] as string[],
    persona_tags: [] as string[],
    stage_tags: [] as string[],
    cloud_tags: [] as string[],
    contact_ae_id: null as string | null,
    contact_engineer_id: null as string | null,
    external_contacts: [] as ExternalContact[],
    status: 'draft' as AssetStatus,
    change_notes: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        category: asset.category,
        description: asset.description,
        url: asset.url,
        industry_tags: asset.industry_tags || [],
        persona_tags: asset.persona_tags || [],
        stage_tags: asset.stage_tags || [],
        cloud_tags: asset.cloud_tags || [],
        contact_ae_id: asset.contact_ae_id,
        contact_engineer_id: asset.contact_engineer_id,
        external_contacts: asset.external_contacts || [],
        status: asset.status,
        change_notes: '',
      });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setSaving(true);

    const assetData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      url: formData.url,
      industry_tags: formData.industry_tags,
      persona_tags: formData.persona_tags,
      stage_tags: formData.stage_tags,
      cloud_tags: formData.cloud_tags,
      contact_ae_id: formData.contact_ae_id,
      contact_engineer_id: formData.contact_engineer_id,
      external_contacts: formData.external_contacts,
      status: isDraft ? 'draft' : formData.status,
      updated_at: new Date().toISOString(),
    };

    if (asset) {
      await supabase.from('assets').update(assetData).eq('id', asset.id);
    } else {
      await supabase.from('assets').insert({
        ...assetData,
        created_by: profile?.id,
        view_count: 0,
      });
    }

    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <h3 className="text-xl font-bold">
              {asset ? 'Edit Content' : 'New Content'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-6">
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
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
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
              placeholder="https://"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry Tags</label>
              <TagInput
                tags={formData.industry_tags}
                onChange={(tags) => setFormData({ ...formData, industry_tags: tags })}
                placeholder="e.g., Banking, Healthcare, FinTech"
                colorScheme="blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Persona Tags</label>
              <TagInput
                tags={formData.persona_tags}
                onChange={(tags) => setFormData({ ...formData, persona_tags: tags })}
                placeholder="e.g., CTO, VP Engineering"
                colorScheme="green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stage Tags</label>
              <TagInput
                tags={formData.stage_tags}
                onChange={(tags) => setFormData({ ...formData, stage_tags: tags })}
                placeholder="e.g., Discovery, Demo, Proposal"
                colorScheme="purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cloud Tags</label>
              <TagInput
                tags={formData.cloud_tags}
                onChange={(tags) => setFormData({ ...formData, cloud_tags: tags })}
                placeholder="e.g., AWS, Azure, GCP"
                colorScheme="orange"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ContactPicker
              profiles={profiles}
              selectedAEId={formData.contact_ae_id}
              selectedEngineerId={formData.contact_engineer_id}
              externalContacts={formData.external_contacts}
              onAEChange={(id) => setFormData({ ...formData, contact_ae_id: id })}
              onEngineerChange={(id) => setFormData({ ...formData, contact_engineer_id: id })}
              onExternalContactsChange={(contacts) => setFormData({ ...formData, external_contacts: contacts })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {asset && (
            <div>
              <label className="block text-sm font-medium mb-2">Change Notes</label>
              <textarea
                value={formData.change_notes}
                onChange={(e) => setFormData({ ...formData, change_notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={2}
                placeholder="Describe what changed in this version..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {asset ? 'Update' : 'Create'}
            </button>
            {!asset && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
