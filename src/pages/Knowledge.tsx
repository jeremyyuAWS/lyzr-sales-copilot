import { Database } from 'lucide-react';

export default function Knowledge() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-2xl p-6">
            <Database className="h-12 w-12 stroke-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Knowledge Base</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Manage your knowledge sources, collections, and curated content sets.
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
