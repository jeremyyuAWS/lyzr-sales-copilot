import { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

export default function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-2xl shadow-lg p-6
        ${hover ? 'glass-hover transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
