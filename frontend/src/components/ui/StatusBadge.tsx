import './StatusBadge.css';

interface StatusBadgeProps {
  status: 'approved' | 'review' | 'processing' | 'error';
  label?: string;
  size?: 'sm' | 'md';
}

const defaultLabels: Record<StatusBadgeProps['status'], string> = {
  approved: 'Auto Approved',
  review: 'Human Review',
  processing: 'Processing',
  error: 'Error',
};

export default function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const displayLabel = label ?? defaultLabels[status];

  return (
    <span className={`status-badge status-badge--${status} status-badge--${size}`}>
      <span className="status-badge__dot" />
      {displayLabel}
    </span>
  );
}
