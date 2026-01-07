import { MessageCircle, Briefcase, FolderOpen, Settings as SettingsIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile } = useAuth();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const isAdmin = profile?.role === 'Admin';

  const mainItems = [
    { id: 'ask', label: 'Copilot', icon: MessageCircle },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'content', label: 'Content Library', icon: FolderOpen },
  ];

  const workspaceItems = [
    { id: 'integrations', label: 'Integrations', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col" data-tour="sidebar">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">Sales Copilot</h1>
        <p className="text-sm text-gray-600 mt-1">{profile?.full_name}</p>
        <p className="text-xs text-gray-500">{profile?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            data-tour={`${item.id}-nav`}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
              ${currentPage === item.id
                ? 'bg-gray-100 text-black'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}

        {isAdmin && (
          <div className="pt-4">
            <button
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {workspaceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Workspace
            </button>

            {workspaceOpen && (
              <div className="mt-1 space-y-1">
                {workspaceItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${currentPage === item.id
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
