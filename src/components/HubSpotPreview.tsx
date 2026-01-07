import { useState, useEffect } from 'react';
import { CheckCircle, Edit3, X, ExternalLink, Calendar, DollarSign, Users, FileText, CheckSquare, TrendingUp, Mail, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type HubSpotUpdate = {
  dealStage: string;
  dealStagePrevious: string;
  dealAmount: number;
  closeDate: string;
  notes: string;
  contacts: Array<{ name: string; title: string; role: string }>;
  tasks: Array<{ title: string; dueDate: string; priority: string }>;
  cloudProvider?: string;
  isNewDeal?: boolean;
};

type FollowUpEmail = {
  subject: string;
  body: string;
};

type RecommendedAsset = {
  id: string;
  title: string;
  type: string;
  reason: string;
  url: string;
};

type NextAction = {
  id: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
};

type HubSpotPreviewProps = {
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
  context?: string;
};

export default function HubSpotPreview({ onConfirm, onEdit, onCancel, context = '' }: HubSpotPreviewProps) {
  const { profile } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'upvote' | 'downvote' | null>>({});

  const extractCloudProvider = (text: string): string | undefined => {
    const match = text.match(/cloud provider:\s*(\w+)/i);
    return match ? match[1] : undefined;
  };

  const extractAmount = (text: string): number => {
    const dealSizeMatch = text.match(/deal\s+size:\s*[~$]?(\d+)k/i);
    if (dealSizeMatch) return parseInt(dealSizeMatch[1]) * 1000;

    const budgetMatch = text.match(/budget:\s*\$?([\d,]+)k?\s*-?\s*\$?([\d,]+)k?/i);
    if (budgetMatch) {
      const low = parseInt(budgetMatch[1].replace(/,/g, ''));
      const high = parseInt(budgetMatch[2].replace(/,/g, ''));
      return Math.round((low + high) / 2) * (budgetMatch[1].length <= 3 ? 1000 : 1);
    }

    return 280000;
  };

  const extractDate = (text: string): string => {
    const dateMatch = text.match(/close\s+date:\s*(.+?)(?:\n|$)/i);
    if (dateMatch) return dateMatch[1].trim();

    const targetMatch = text.match(/targeting\s+(.+?)(?:\n|$)/i);
    if (targetMatch) return targetMatch[1].trim();

    return '2024-06-30';
  };

  const extractContacts = (text: string): Array<{ name: string; title: string; role: string }> => {
    const contacts: Array<{ name: string; title: string; role: string }> = [];

    const attendeeMatch = text.match(/attendees?:(.+?)(?:\n\n|\n[A-Z])/is);
    if (attendeeMatch) {
      const attendeeText = attendeeMatch[1];
      const nameMatches = attendeeText.matchAll(/([A-Z][a-z]+\s+[A-Z][a-z]+)\s*\(([^)]+)\)/g);
      for (const match of nameMatches) {
        const name = match[1];
        const title = match[2];
        let role = 'Stakeholder';
        if (title.toLowerCase().includes('ceo') || title.toLowerCase().includes('cto')) {
          role = 'Decision Maker';
        } else if (title.toLowerCase().includes('vp') || title.toLowerCase().includes('director')) {
          role = 'Technical Champion';
        }
        contacts.push({ name, title, role });
      }
    }

    if (contacts.length === 0) {
      contacts.push(
        { name: 'Sarah Chen', title: 'CTO', role: 'Decision Maker' },
        { name: 'Mike Rodriguez', title: 'VP Engineering', role: 'Technical Champion' }
      );
    }

    return contacts;
  };

  const extractTasks = (text: string): Array<{ title: string; dueDate: string; priority: string }> => {
    const tasks: Array<{ title: string; dueDate: string; priority: string }> = [];

    const nextStepsMatch = text.match(/next steps?:(.+?)(?:\n\n|\n[A-Z][a-z]+:|$)/is);
    if (nextStepsMatch) {
      const stepsText = nextStepsMatch[1];
      const stepMatches = stepsText.matchAll(/[-•]\s*(.+?)(?:\n|$)/g);
      for (const match of stepMatches) {
        const step = match[1].trim();
        if (step.length > 5) {
          const priority = step.toLowerCase().includes('urgent') || step.toLowerCase().includes('asap') ? 'high' : 'medium';
          const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          tasks.push({ title: step, dueDate, priority });
        }
      }
    }

    if (tasks.length === 0) {
      tasks.push(
        { title: 'Schedule technical deep-dive with DevOps team', dueDate: '2024-03-18', priority: 'high' },
        { title: 'Share healthcare compliance case study', dueDate: '2024-03-16', priority: 'high' },
        { title: 'Send pricing proposal', dueDate: '2024-03-20', priority: 'medium' }
      );
    }

    return tasks;
  };

  const isNewDeal = context.toLowerCase().includes('warby parker') ||
                    context.toLowerCase().includes('david gilboa') ||
                    context.toLowerCase().includes('create a new deal');

  const hubspotUpdate: HubSpotUpdate = {
    dealStage: 'Technical Validation',
    dealStagePrevious: 'Discovery',
    dealAmount: extractAmount(context),
    closeDate: extractDate(context),
    notes: context.trim(),
    contacts: extractContacts(context),
    tasks: extractTasks(context),
    cloudProvider: extractCloudProvider(context),
    isNewDeal: isNewDeal,
  };

  const followUpEmail: FollowUpEmail = {
    subject: 'TechFlow Solutions - Next Steps & Resources',
    body: `Hi Sarah and Mike,

Thank you for the productive conversation today about TechFlow's AWS migration initiative. I'm excited about the opportunity to help streamline your deployment process for 200+ microservices.

Key Takeaways:
• Current challenge: 3-4 hour manual deployment per service
• Goal: Automated, secure deployment with SOC 2 & HIPAA compliance
• Timeline: Pilot in Q2, full rollout by Q3
• Budget: $250k-$300k approved

Next Steps:
1. Technical deep-dive with your DevOps team (scheduling for next week)
2. Review attached healthcare compliance case study
3. Pricing proposal by end of week

I've included a relevant case study from a similar healthcare company that migrated 300+ services to AWS with our platform. I think you'll find their results compelling.

Looking forward to our technical session!

Best regards,
Alex`,
  };

  const recommendedAssets: RecommendedAsset[] = [
    {
      id: '1',
      title: 'Healthcare Compliance Case Study - MedTech Corp',
      type: 'Case Study',
      reason: 'Similar industry, SOC 2 & HIPAA requirements, 300+ microservices',
      url: '#',
    },
    {
      id: '2',
      title: 'AWS Migration Demo - Enterprise Scale',
      type: 'Demo',
      reason: 'Shows automated deployment for 200+ services',
      url: '#',
    },
    {
      id: '3',
      title: 'Security & Compliance One-Pager',
      type: 'One-Pager',
      reason: 'Addresses SOC 2 and HIPAA concerns directly',
      url: '#',
    },
  ];

  const nextActions: NextAction[] = [
    { id: '1', action: 'Schedule technical deep-dive with DevOps team', priority: 'high', dueDate: 'This Week' },
    { id: '2', action: 'Send healthcare compliance case study', priority: 'high', dueDate: 'Today' },
    { id: '3', action: 'Prepare pricing proposal ($250k-$300k range)', priority: 'medium', dueDate: 'End of Week' },
    { id: '4', action: 'Research Harness and GitLab competitive positioning', priority: 'medium', dueDate: 'Next Week' },
  ];

  useEffect(() => {
    if (profile?.id) {
      loadFeedback();
    }
  }, [profile]);

  const loadFeedback = async () => {
    if (!profile?.id) return;

    try {
      const { data } = await supabase
        .from('asset_recommendation_feedback')
        .select('asset_id, feedback_type')
        .eq('user_id', profile.id)
        .eq('context', context);

      if (data) {
        const feedbackMap: Record<string, 'upvote' | 'downvote' | null> = {};
        data.forEach(item => {
          feedbackMap[item.asset_id] = item.feedback_type as 'upvote' | 'downvote';
        });
        setFeedback(feedbackMap);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const handleFeedback = async (assetId: string, type: 'upvote' | 'downvote') => {
    if (!profile?.id) return;

    const currentFeedback = feedback[assetId];
    const newFeedback = currentFeedback === type ? null : type;

    setFeedback(prev => ({ ...prev, [assetId]: newFeedback }));

    try {
      if (newFeedback === null) {
        await supabase
          .from('asset_recommendation_feedback')
          .delete()
          .eq('user_id', profile.id)
          .eq('asset_id', assetId)
          .eq('context', context);
      } else {
        await supabase
          .from('asset_recommendation_feedback')
          .upsert({
            user_id: profile.id,
            asset_id: assetId,
            context: context,
            feedback_type: newFeedback,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,asset_id,context'
          });
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      setFeedback(prev => ({ ...prev, [assetId]: currentFeedback }));
    }
  };

  const handleConfirm = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSynced(true);
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  if (synced) {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-500 shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Successfully Synced!</h3>
        <p className="text-gray-600">
          HubSpot has been updated with deal information, contacts, and tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">HubSpot Update Ready</h3>
              <p className="text-sm text-gray-600">Review and confirm before syncing</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-700" />
            <h4 className="font-semibold text-gray-900">Deal Updates</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Deal Stage</div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="line-through text-gray-400">{hubspotUpdate.dealStagePrevious}</span>
                  <span>→</span>
                  <span className="text-blue-600">{hubspotUpdate.dealStage}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Deal Amount</span>
              </div>
              <span className="font-semibold text-gray-900">
                ${hubspotUpdate.dealAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Close Date</span>
              </div>
              <span className="font-medium text-gray-900">
                {new Date(hubspotUpdate.closeDate).toLocaleDateString()}
              </span>
            </div>
            {hubspotUpdate.cloudProvider && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Cloud Provider</span>
                </div>
                <span className="font-medium text-gray-900">
                  {hubspotUpdate.cloudProvider}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-700" />
            <h4 className="font-semibold text-gray-900">Meeting Notes</h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{hubspotUpdate.notes}</p>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-700" />
            <h4 className="font-semibold text-gray-900">New Contacts Detected</h4>
          </div>
          <div className="space-y-2">
            {hubspotUpdate.contacts.map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.title}</div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {contact.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="h-4 w-4 text-gray-700" />
            <h4 className="font-semibold text-gray-900">Tasks to Create</h4>
          </div>
          <div className="space-y-2">
            {hubspotUpdate.tasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-gray-700" />
          <h4 className="font-semibold text-gray-900">Follow-up Email Draft</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Subject</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{followUpEmail.subject}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Body</label>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {followUpEmail.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-gray-700" />
          <h4 className="font-semibold text-gray-900">Recommended Assets to Share</h4>
        </div>
        <div className="space-y-3">
          {recommendedAssets.map((asset) => (
            <div key={asset.id} className="p-4 bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                      {asset.type}
                    </span>
                    <h5 className="font-semibold text-gray-900 text-sm">{asset.title}</h5>
                  </div>
                  <p className="text-xs text-gray-600">{asset.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(asset.id, 'upvote')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback[asset.id] === 'upvote'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-white text-gray-400 hover:text-green-600'
                    }`}
                    title="This is helpful"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback(asset.id, 'downvote')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback[asset.id] === 'downvote'
                        ? 'bg-red-100 text-red-700'
                        : 'hover:bg-white text-gray-400 hover:text-red-600'
                    }`}
                    title="Not relevant"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                  <a
                    href={asset.url}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600"
                    title="View asset"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="h-5 w-5 text-gray-700" />
          <h4 className="font-semibold text-gray-900">Recommended Next Actions</h4>
        </div>
        <div className="space-y-2">
          {nextActions.map((action) => (
            <div key={action.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-900">{action.action}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{action.dueDate}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  action.priority === 'high' ? 'bg-red-100 text-red-700' :
                  action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {action.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hubspotUpdate.isNewDeal && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">New Deal Creation</h4>
              <p className="text-sm text-blue-800">
                This will create a new Deal in HubSpot with {hubspotUpdate.contacts.map(c => c.name).join(' and ')} as contacts. Review and approve before syncing to HubSpot.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleConfirm}
          disabled={syncing}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {syncing ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Syncing to HubSpot...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Confirm & Sync to HubSpot</span>
            </>
          )}
        </button>
        <button
          onClick={onEdit}
          className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors flex items-center gap-2"
        >
          <Edit3 className="h-5 w-5" />
          <span>Edit</span>
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
