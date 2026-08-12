import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'dark' | 'light';
  className?: string;
}

export default function Logo({ variant = 'full', theme = 'dark', className = '' }: LogoProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-nexora-900';

  if (variant === 'icon') {
    return (
      <Link to="/" className={`inline-flex items-center ${className}`} aria-label="NEXORA Home">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="NEXORA Home">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <span className={`font-bold text-base tracking-tight ${textColor}`}>NEXORA</span>
      </Link>
    );
  }

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="NEXORA Home">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center shadow-lg shadow-electric-500/20">
        <span className="text-white font-bold text-base">N</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-lg tracking-tight leading-none ${textColor}`}>NEXORA</span>
        <span className="text-[10px] text-nexora-400 tracking-widest uppercase leading-none mt-0.5">Intelligence</span>
      </div>
    </Link>
  );
}
