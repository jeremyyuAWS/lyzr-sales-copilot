import { Sparkles, BookOpen, Target, Lightbulb, Mail, TrendingUp } from 'lucide-react';

type PromptPill = {
  id: string;
  label: string;
  icon: React.ReactNode;
  scaffoldText: string;
  cursorPosition?: number;
};

const PROMPT_PILLS: PromptPill[] = [
  {
    id: 'meeting-notes',
    label: 'Paste meeting notes → suggest next steps',
    icon: <Sparkles className="h-4 w-4" />,
    scaffoldText: `Here are my meeting notes from [Enter customer name]:

[Paste meeting notes here]

Based on these notes, please suggest:
- Recommended demos or assets to show
- Relevant case studies or proof points
- Clear next steps to move the deal forward`,
    cursorPosition: 38,
  },
  {
    id: 'demo-recommendation',
    label: 'What demo should I show?',
    icon: <Target className="h-4 w-4" />,
    scaffoldText: `For [Enter customer name], what demo should I show next?

Context:
- Deal stage: [Enter stage - e.g., Discovery, POC, Negotiation]
- Customer use case: [Enter their primary use case]
- Industry: [Enter industry]

What typically resonates in similar deals?`,
    cursorPosition: 5,
  },
  {
    id: 'case-studies',
    label: 'Find relevant case studies or proof',
    icon: <BookOpen className="h-4 w-4" />,
    scaffoldText: `Find relevant case studies or proof points for [Enter customer name].

Their profile:
- Industry: [Enter industry]
- Use case: [Enter use case]
- Deal stage: [Enter stage]

Please prioritize similar customers and proof that builds confidence at this stage.`,
    cursorPosition: 57,
  },
  {
    id: 'what-works',
    label: 'What usually works in deals like this?',
    icon: <Lightbulb className="h-4 w-4" />,
    scaffoldText: `I'm working on a deal with [Enter customer name] in the [Enter industry] industry.

Their use case: [Enter use case]
Deal stage: [Enter stage]

Based on similar deals, what usually works? Please include:
- Common winning patterns
- Effective demos or proof points
- Typical pitfalls to avoid`,
    cursorPosition: 29,
  },
  {
    id: 'follow-up-email',
    label: 'Draft a follow-up email with assets',
    icon: <Mail className="h-4 w-4" />,
    scaffoldText: `Draft a follow-up email for [Enter customer name].

Context from our conversation:
[Enter key discussion points or meeting summary]

Please include:
- A concise summary of the conversation
- Recommended demos or assets to share
- A clear call to action`,
    cursorPosition: 33,
  },
  {
    id: 'whats-new',
    label: "What's new that I can use in deals?",
    icon: <TrendingUp className="h-4 w-4" />,
    scaffoldText: `What new content, demos, or use cases can I use in active deals?

Especially interested in:
- [Enter specific industry, use case, or customer type]

Please highlight recently added or updated content that would be useful for customer conversations.`,
    cursorPosition: 85,
  },
];

type PromptPillsProps = {
  onPillClick: (scaffoldText: string, cursorPosition?: number) => void;
};

export default function PromptPills({ onPillClick }: PromptPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3" data-tour="prompt-pills">
      {PROMPT_PILLS.map((pill) => (
        <button
          key={pill.id}
          onClick={() => onPillClick(pill.scaffoldText, pill.cursorPosition)}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:bg-white/80 hover:shadow-sm transition-all text-sm text-gray-700 hover:text-black"
        >
          <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
            {pill.icon}
          </span>
          <span>{pill.label}</span>
        </button>
      ))}
    </div>
  );
}
