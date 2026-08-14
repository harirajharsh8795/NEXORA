import type { ReactNode } from 'react';
import './SectionHeader.css';

interface SectionHeaderProps {
  tag?: string;        // e.g. "CORE FEATURES", "WHY NEXORA"
  title: string;       // Main heading
  titleAccent?: string; // Italic/accent portion of the heading
  subtitle?: string;   // Description paragraph
  align?: 'left' | 'center';
  children?: ReactNode;
}

export default function SectionHeader({
  tag,
  title,
  titleAccent,
  subtitle,
  align = 'center',
  children,
}: SectionHeaderProps) {
  return (
    <div className={`section-header section-header--${align}`}>
      {tag && <span className="section-header__tag">{tag}</span>}
      <h2 className="section-header__title font-serif">
        {title}
        {titleAccent && (
          <>
            {' '}
            <em className="section-header__accent">{titleAccent}</em>
          </>
        )}
      </h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
