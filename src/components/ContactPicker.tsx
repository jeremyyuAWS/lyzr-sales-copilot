import { useState } from 'react';
import { Plus, X, User, UserPlus } from 'lucide-react';
import { Profile, ExternalContact } from '../lib/supabase';

type ContactPickerProps = {
  profiles: Profile[];
  selectedAEId: string | null;
  selectedEngineerId: string | null;
  externalContacts: ExternalContact[];
  onAEChange: (id: string | null) => void;
  onEngineerChange: (id: string | null) => void;
  onExternalContactsChange: (contacts: ExternalContact[]) => void;
};

export default function ContactPicker({
  profiles,
  selectedAEId,
  selectedEngineerId,
  externalContacts,
  onAEChange,
  onEngineerChange,
  onExternalContactsChange,
}: ContactPickerProps) {
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [newContact, setNewContact] = useState<ExternalContact>({
    name: '',
    email: '',
    company: '',
    role: '',
  });

  const aes = profiles.filter(p => p.role === 'AE' || p.role === 'Sales Leadership');
  const engineers = profiles.filter(p => p.role === 'Sales Engineer');

  const handleAddExternalContact = () => {
    if (newContact.name && newContact.email) {
      onExternalContactsChange([...externalContacts, newContact]);
      setNewContact({ name: '', email: '', company: '', role: '' });
      setShowExternalForm(false);
    }
  };

  const handleRemoveExternalContact = (index: number) => {
    onExternalContactsChange(externalContacts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Internal Contacts
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Account Executive</label>
            <select
              value={selectedAEId || ''}
              onChange={(e) => onAEChange(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">None</option>
              {aes.map((ae) => (
                <option key={ae.id} value={ae.id}>
                  {ae.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sales Engineer</label>
            <select
              value={selectedEngineerId || ''}
              onChange={(e) => onEngineerChange(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">None</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            External Contacts
          </h4>
          {!showExternalForm && (
            <button
              type="button"
              onClick={() => setShowExternalForm(true)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
            >
              <Plus className="h-3 w-3" />
              Add Contact
            </button>
          )}
        </div>

        {externalContacts.length > 0 && (
          <div className="space-y-2 mb-4">
            {externalContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-600">
                    {contact.email} • {contact.company} • {contact.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExternalContact(index)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showExternalForm && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={newContact.role}
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                  placeholder="CTO"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddExternalContact}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExternalForm(false);
                  setNewContact({ name: '', email: '', company: '', role: '' });
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {externalContacts.length === 0 && !showExternalForm && (
          <p className="text-sm text-gray-500 italic">No external contacts added</p>
        )}
      </div>
    </div>
  );
}
