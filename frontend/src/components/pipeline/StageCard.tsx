import type { PipelineStage } from '../../types';
import './StageCard.css';

interface StageCardProps {
  stage: PipelineStage;
  isSelected: boolean;
  onClick: () => void;
}

export default function StageCard({ stage, isSelected, onClick }: StageCardProps) {
  return (
    <button
      className={`stage-card glass-card ${isSelected ? 'stage-card--selected' : ''}`}
      onClick={onClick}
      aria-expanded={isSelected}
    >
      <div className="stage-card__header">
        <span className="stage-num">0{stage.id}</span>
        <span className="stage-icon">{stage.icon}</span>
      </div>
      <h4 className="stage-name">{stage.name}</h4>
      <p className="stage-short-desc">{stage.description}</p>
      <div className="stage-status-indicator">
        <span className="status-dot" />
        <span>Completed</span>
      </div>
    </button>
  );
}
