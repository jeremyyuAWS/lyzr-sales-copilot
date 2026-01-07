import { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export default function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
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
