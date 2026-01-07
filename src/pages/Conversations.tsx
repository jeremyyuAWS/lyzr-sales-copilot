import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from '../components/GlassCard';

type ConversationType = {
  id: string;
  title: string;
  updated_at: string;
  messages: MessageType[];
};

type MessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

const mockConversations: ConversationType[] = [
  {
    id: '1',
    title: 'NVIDIA Enterprise Demo',
    updated_at: '2024-01-06T10:30:00',
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'NVIDIA is interested in our AI agent platform. What should I highlight in the demo?',
        created_at: '2024-01-06T10:30:00',
      },
      {
        id: '1-2',
        role: 'assistant',
        content: `Great opportunity! For **NVIDIA**, I recommend focusing on:\n\n### Key Demo Points:\n- **GPU-optimized inference** - our platform is built for high-performance computing\n- **Multi-agent orchestration** capabilities\n- **Real-time model deployment** and monitoring\n\n### Success Metrics:\nThis demo configuration has a **78% conversion rate** with enterprise AI companies.\n\n**Next Steps:** I can prepare a custom demo environment showcasing integration with their existing ML pipelines. Would you like me to schedule this for tomorrow?`,
        created_at: '2024-01-06T10:31:00',
      },
      {
        id: '1-3',
        role: 'user',
        content: 'Yes, and also provide case studies of similar AI workloads',
        created_at: '2024-01-06T10:32:00',
      },
      {
        id: '1-4',
        role: 'assistant',
        content: `I've prepared **3 relevant case studies**:\n\n1. **AI Research Lab** - 40% efficiency gain in model deployment\n2. **Computer Vision Startup** - Reduced inference latency by 60%\n3. **NLP Platform** - Processed 2M+ agent interactions/day\n\nAll materials include:\n- ✓ Architecture diagrams\n- ✓ Performance benchmarks\n- ✓ ROI analysis\n\n*Demo environment will be ready tomorrow at 2 PM.*`,
        created_at: '2024-01-06T10:33:00',
      },
    ],
  },
  {
    id: '2',
    title: 'Competitor Analysis - CrewAI',
    updated_at: '2024-01-05T14:15:00',
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'The prospect is evaluating us against CrewAI. What are our differentiators?',
        created_at: '2024-01-05T14:15:00',
      },
      {
        id: '2-2',
        role: 'assistant',
        content: `### Lyzr vs CrewAI Comparison\n\n**Key Advantages:**\n\n| Feature | Lyzr | CrewAI |\n|---------|------|--------|\n| Enterprise Support | 24/7 Dedicated | Community-based |\n| Deployment Time | **2 weeks** | 6-8 weeks |\n| Security Compliance | SOC 2, HIPAA | Limited |\n| Pre-built Agents | 50+ | ~10 |\n\n**Why customers choose us:**\n- ✓ Production-ready out of the box\n- ✓ Enterprise-grade security\n- ✓ Advanced orchestration & monitoring\n- ✓ Proven ROI with Fortune 500 companies\n\nI have a detailed **battlecard** and **win-loss analysis** ready to share. Our win rate against CrewAI is **73%** when these materials are presented early.`,
        created_at: '2024-01-05T14:16:00',
      },
    ],
  },
  {
    id: '3',
    title: 'LangChain Migration for Accenture',
    updated_at: '2024-01-04T09:45:00',
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'Accenture is currently using LangChain. How do we position a migration?',
        created_at: '2024-01-04T09:45:00',
      },
      {
        id: '3-2',
        role: 'assistant',
        content: `Perfect timing! **Accenture** is an ideal migration candidate.\n\n### Migration Value Proposition:\n\n**Pain Points with LangChain:**\n- Complex orchestration logic\n- Limited production monitoring\n- Heavy custom coding required\n- Difficult to scale across teams\n\n**Lyzr Advantages:**\n- 🚀 **Faster deployment** - drag-and-drop agent builder\n- 📊 **Built-in observability** - real-time monitoring & analytics\n- 🔧 **Lower maintenance** - managed infrastructure\n- 👥 **Team collaboration** - multi-user workflows\n\n### Pricing:\nFor enterprise organizations like **Accenture** (10,000+ employees):\n- **Custom Enterprise tier** at $150-250k annually\n- Includes dedicated CSM, priority support, custom integrations\n\n*Average migration time: 4-6 weeks with full support*`,
        created_at: '2024-01-04T09:46:00',
      },
    ],
  },
  {
    id: '4',
    title: 'Under Armour Use Case',
    updated_at: '2024-01-03T16:20:00',
    messages: [
      {
        id: '4-1',
        role: 'user',
        content: 'Under Armour wants to use AI agents for customer support. What\'s our recommendation?',
        created_at: '2024-01-03T16:20:00',
      },
      {
        id: '4-2',
        role: 'assistant',
        content: `Excellent use case for **Under Armour**!\n\n### Recommended Solution:\n\n**Customer Support AI Agent Suite** including:\n\n1. **Product Recommendation Agent**\n   - Personalized product suggestions\n   - Size & fit guidance\n   - Integration with product catalog\n\n2. **Order Management Agent**\n   - Order tracking & updates\n   - Return & exchange processing\n   - Shipping information\n\n3. **FAQ & Knowledge Agent**\n   - Instant answers to common questions\n   - Warranty & care instructions\n   - Store locator\n\n### Expected Outcomes:\n- 📉 **40% reduction** in support tickets\n- ⚡ **60% faster** response times\n- 😊 **25% increase** in customer satisfaction\n- 💰 **$2M+ annual savings** in support costs\n\n**Retail Success Stories:**\n- Similar fashion retailer saw 45% CSAT improvement\n- Sports equipment company reduced support costs by $1.5M\n\n*I can prepare a retail-specific demo with Under Armour branding.*`,
        created_at: '2024-01-03T16:21:00',
      },
    ],
  },
  {
    id: '5',
    title: 'AWS Bedrock Comparison',
    updated_at: '2024-01-02T11:00:00',
    messages: [
      {
        id: '5-1',
        role: 'user',
        content: 'Prospect is considering building on AWS Bedrock directly. How do we position Lyzr?',
        created_at: '2024-01-02T11:00:00',
      },
      {
        id: '5-2',
        role: 'assistant',
        content: `### Lyzr vs AWS Bedrock\n\n**TL;DR:** Bedrock is infrastructure, Lyzr is a complete platform.\n\n---\n\n**Build vs Buy Analysis:**\n\n| Aspect | Building on Bedrock | Using Lyzr |\n|--------|---------------------|------------|\n| Time to Production | 6-12 months | **2-4 weeks** |\n| Dev Resources | 5-8 engineers | 1-2 engineers |\n| Total Cost (Year 1) | $800k-1.2M | **$150-250k** |\n| Maintenance | High, ongoing | Managed for you |\n\n**What Lyzr Provides Beyond Bedrock:**\n\n✅ **Agent orchestration** framework\n✅ **Memory & context** management\n✅ **Built-in monitoring** & analytics\n✅ **Pre-built integrations** (150+ tools)\n✅ **Security & compliance** layer\n✅ **Team collaboration** features\n✅ **Version control** & deployment\n\n**Best Positioning:**\n> *"Bedrock is great infrastructure. Lyzr helps you build production AI applications on top of it **10x faster**. We complement AWS rather than compete."*\n\n**Note:** We actually *support* Bedrock as a model provider! Customers can use Bedrock models through Lyzr's platform.\n\n*Win rate when positioned correctly: **68%***`,
        created_at: '2024-01-02T11:02:00',
      },
    ],
  },
  {
    id: '6',
    title: 'Q4 Enterprise Wins Review',
    updated_at: '2024-01-01T15:30:00',
    messages: [
      {
        id: '6-1',
        role: 'user',
        content: 'What were our biggest wins in Q4 and what made them successful?',
        created_at: '2024-01-01T15:30:00',
      },
      {
        id: '6-2',
        role: 'assistant',
        content: `## Q4 2024 Enterprise Wins\n\n### Top Deals Closed:\n\n**1. NVIDIA** - $425k ACV\n- Use case: Multi-agent system for internal AI research\n- Key factor: GPU-optimized performance benchmarks\n- Sales cycle: 3 months\n\n**2. Accenture** - $380k ACV\n- Use case: Client-facing AI consulting platform\n- Key factor: White-label capabilities + SOC 2 compliance\n- Sales cycle: 5 months\n\n**3. Under Armour** - $275k ACV\n- Use case: Customer support automation\n- Key factor: Retail success stories + fast implementation\n- Sales cycle: 2 months\n\n---\n\n### Winning Patterns:\n\n📊 **Competitive Landscape:**\n- vs **CrewAI**: Won 73% (12 of 16 deals)\n- vs **LangChain**: Won 68% (8 of 12 deals)\n- vs **Bedrock direct**: Won 65% (11 of 17 deals)\n\n🎯 **Success Factors:**\n1. Early demo (within first 2 meetings)\n2. Industry-specific case studies\n3. Clear ROI calculator\n4. Executive sponsorship secured\n5. Security/compliance docs shared early\n\n💡 **Key Insight:** Deals that included a **technical proof-of-concept** had an **89% close rate** vs 54% without POC.\n\n*Average deal size grew 34% QoQ from $145k to $195k*`,
        created_at: '2024-01-01T15:31:00',
      },
    ],
  },
];

export default function Conversations() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationType>(mockConversations[0]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <div className="w-80 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Conversation History</h2>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`
                w-full text-left p-3 rounded-lg transition-colors mb-1
                ${selectedConversation?.id === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="font-medium text-sm truncate">{conv.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(conv.updated_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">{selectedConversation.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(selectedConversation.updated_at).toLocaleString()}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {selectedConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' ? (
                <GlassCard className="max-w-3xl">
                  <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-800 prose-table:text-sm">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </GlassCard>
              ) : (
                <div className="max-w-3xl bg-gray-100 rounded-2xl p-4">
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 p-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a follow-up question or request more details..."
                className="flex-1 resize-y min-h-[72px] bg-transparent border-none outline-none text-base placeholder-gray-400"
                rows={3}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
