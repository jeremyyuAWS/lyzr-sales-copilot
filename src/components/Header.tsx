import { HelpCircle } from 'lucide-react';

type HeaderProps = {
  title: string;
  onHelpClick: () => void;
};

export default function Header({ title, onHelpClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={onHelpClick}
        data-tour="help-button"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Help</span>
      </button>
    </header>
  );
}
