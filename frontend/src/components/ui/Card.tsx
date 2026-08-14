import type { ReactNode, CSSProperties } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  style,
  hoverable = true,
  onClick,
  padding = 'lg',
}: CardProps) {
  const paddingMap = {
    none: '0',
    sm: 'var(--space-md)',
    md: 'var(--space-lg)',
    lg: 'var(--space-xl)',
  };

  return (
    <div
      className={`nexora-card ${hoverable ? '' : 'nexora-card--no-hover'} ${onClick ? 'nexora-card--clickable' : ''} ${className}`}
      style={{ padding: paddingMap[padding], ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
