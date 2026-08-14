import type { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export default function StatCard({ value, label, sublabel, icon, accentColor }: StatCardProps) {
  return (
    <div className="stat-card">
      {icon && (
        <div className="stat-card__icon" style={accentColor ? { color: accentColor } : undefined}>
          {icon}
        </div>
      )}
      <div
        className="stat-card__value"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {value}
      </div>
      <div className="stat-card__label">{label}</div>
      {sublabel && <div className="stat-card__sublabel">{sublabel}</div>}
    </div>
  );
}
