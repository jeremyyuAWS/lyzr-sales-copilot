import { Search } from 'lucide-react';

type GlassTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
};

export default function GlassTextarea({ value, onChange, placeholder, className = '', rows = 7 }: GlassTextareaProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-6 top-6 h-5 w-5 stroke-gray-400" />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full glass-input rounded-2xl px-14 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none"
      />
    </div>
  );
}
