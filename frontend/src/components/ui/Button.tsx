import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`nexora-btn nexora-btn--${variant} nexora-btn--${size} ${fullWidth ? 'nexora-btn--full' : ''} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="nexora-btn__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="nexora-btn__icon">{icon}</span>}
    </button>
  );
}
