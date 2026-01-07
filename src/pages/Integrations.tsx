import { Settings, Check, Link as LinkIcon } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    {
      name: 'HubSpot',
      description: 'Sync deals, contacts, and notes with HubSpot CRM',
      status: 'connected',
      logoUrl: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
    },
    {
      name: 'Salesforce',
      description: 'Connect with Salesforce to manage opportunities and accounts',
      status: 'available',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    },
    {
      name: 'Microsoft Dynamics',
      description: 'Integrate with Dynamics 365 for seamless data flow',
      status: 'available',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_Dynamics_logo.svg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-600">
          Connect your CRM platforms to sync deal data automatically
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.name} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-100 rounded-xl p-3">
                <LinkIcon className="h-6 w-6 stroke-gray-700" />
              </div>
              {integration.status === 'connected' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 text-xs font-medium">
                  <Check className="h-3 w-3" />
                  <span>Connected</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold mb-2">{integration.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

            {integration.status === 'connected' && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Demo Mode Active</span>
                </div>
              </div>
            )}

            {integration.status === 'available' && (
              <button className="w-full mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="bg-white rounded-xl p-3">
            <Settings className="h-5 w-5 stroke-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Demo Mode</h3>
            <p className="text-sm text-gray-600">
              This is a demonstration environment. HubSpot integration is simulated for testing purposes.
              Comments and notes will be synced locally without requiring actual API credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
