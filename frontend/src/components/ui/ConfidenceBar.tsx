import './ConfidenceBar.css';

interface ConfidenceBarProps {
  value: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConfidenceBar({
  value,
  label,
  showPercentage = true,
  size = 'md',
}: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);
  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  // Color logic: green if >= 85%, amber if >= 60%, red if < 60%
  const getColorClass = () => {
    if (percentage >= 85) return 'confidence-bar--high';
    if (percentage >= 60) return 'confidence-bar--medium';
    return 'confidence-bar--low';
  };

  return (
    <div className={`confidence-bar confidence-bar--${size}`}>
      {(label || showPercentage) && (
        <div className="confidence-bar__header">
          {label && <span className="confidence-bar__label">{label}</span>}
          {showPercentage && (
            <span className={`confidence-bar__value ${getColorClass()}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="confidence-bar__track">
        <div
          className={`confidence-bar__fill ${getColorClass()}`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
    </div>
  );
}
