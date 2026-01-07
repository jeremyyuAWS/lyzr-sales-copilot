import { useState, useEffect } from 'react';
import { Plus, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassTextarea from '../components/GlassTextarea';

export default function Admin() {
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Demo' as 'Demo' | 'Case Study' | 'Deck' | 'Proof' | 'Video' | 'Tutorial' | 'Sales Play',
    description: '',
    url: '',
    industry_tags: '',
    persona_tags: '',
    stage_tags: '',
    cloud_tags: '',
  });

  const assetTypes = ['Demo', 'Case Study', 'Deck', 'Proof', 'Video', 'Tutorial', 'Sales Play'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSuccess(false);

    try {
      await supabase.from('assets').insert({
        title: formData.title,
        type: formData.type,
        description: formData.description,
        url: formData.url,
        industry_tags: formData.industry_tags.split(',').map(t => t.trim()).filter(t => t),
        persona_tags: formData.persona_tags.split(',').map(t => t.trim()).filter(t => t),
        stage_tags: formData.stage_tags.split(',').map(t => t.trim()).filter(t => t),
        cloud_tags: formData.cloud_tags.split(',').map(t => t.trim()).filter(t => t),
        created_by: profile?.id,
      });

      setSuccess(true);
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

      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 2000);
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setUploading(false);
    }
  };

  if (profile?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-gray-600">Upload and manage sales enablement content</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Content
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Content uploaded successfully!</span>
        </div>
      )}

      {showForm && (
        <GlassCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <div className="grid grid-cols-4 gap-3">
                {assetTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as any })}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.type === type
                        ? 'border-black bg-gray-50 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <GlassInput
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter content title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <GlassTextarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the content and its key value propositions"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <GlassInput
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/content"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Industry & Use Case Tags</label>
                <GlassInput
                  type="text"
                  value={formData.industry_tags}
                  onChange={(e) => setFormData({ ...formData, industry_tags: e.target.value })}
                  placeholder="Financial Services, Healthcare, Migration"
                />
                <p className="text-xs text-gray-500 mt-1">Industries and use cases (comma-separated)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Persona Tags</label>
                <GlassInput
                  type="text"
                  value={formData.persona_tags}
                  onChange={(e) => setFormData({ ...formData, persona_tags: e.target.value })}
                  placeholder="CTO, VP Engineering"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stage Tags</label>
                <GlassInput
                  type="text"
                  value={formData.stage_tags}
                  onChange={(e) => setFormData({ ...formData, stage_tags: e.target.value })}
                  placeholder="Discovery, Proof of Concept"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cloud Tags</label>
                <GlassInput
                  type="text"
                  value={formData.cloud_tags}
                  onChange={(e) => setFormData({ ...formData, cloud_tags: e.target.value })}
                  placeholder="AWS, Azure, GCP"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-5 w-5" />
                {uploading ? 'Uploading...' : 'Upload Content'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Content Upload Guidelines</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Content Types</h3>
            <ul className="space-y-1 text-gray-600 ml-4">
              <li><span className="font-medium">Demo:</span> Interactive product demonstrations</li>
              <li><span className="font-medium">Case Study:</span> Customer success stories and outcomes</li>
              <li><span className="font-medium">Deck:</span> Presentation slides and pitch decks</li>
              <li><span className="font-medium">Proof:</span> Technical proof points and benchmarks</li>
              <li><span className="font-medium">Video:</span> Video content and recordings</li>
              <li><span className="font-medium">Tutorial:</span> How-to guides and walkthroughs</li>
              <li><span className="font-medium">Sales Play:</span> Strategic sales frameworks and playbooks</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tagging Best Practices</h3>
            <ul className="space-y-1 text-gray-600 ml-4">
              <li>Use consistent tag names across similar content</li>
              <li>Include 3-7 relevant tags combining industry, use case, and technical topics</li>
              <li>Tag broadly for discoverability, but stay relevant</li>
              <li>Industry tags should match deal industries (e.g., Financial Services, Healthcare)</li>
              <li>Include use cases that describe problems solved (e.g., Cloud Migration, Data Analytics)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
