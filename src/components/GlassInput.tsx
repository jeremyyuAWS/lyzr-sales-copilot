import { Search } from 'lucide-react';

type GlassInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function GlassInput({ value, onChange, placeholder, className = '' }: GlassInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 stroke-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass-input rounded-2xl px-14 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
      />
    </div>
  );
}
