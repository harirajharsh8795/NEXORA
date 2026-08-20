import type { PipelineStage } from '../../types';
import './StageCard.css';

interface StageCardProps {
  stage: PipelineStage;
  isSelected: boolean;
  onHover: () => void;
  onClick: () => void;
  stageNumber: number;
}

export default function StageCard({ stage, isSelected, onHover, onClick, stageNumber }: StageCardProps) {
  return (
    <button
      className={`stage-card-compact glass-card ${isSelected ? 'stage-card-compact--selected' : ''}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      onTouchStart={onClick}
      aria-selected={isSelected}
      role="tab"
      type="button"
    >
      <div className="stage-compact__glow-bar" />
      
      <div className="stage-compact__top">
        <span className="stage-compact__num">0{stageNumber}</span>
        <span className="stage-compact__icon" aria-hidden="true">{stage.icon}</span>
      </div>

      <div className="stage-compact__body">
        <h4 className="stage-compact__title">{stage.name}</h4>
        
        {/* In-Place Animated Description Reveal on Hover */}
        <div className="stage-compact__desc-wrapper">
          <div className="stage-compact__desc-inner">
            <p className="stage-compact__desc">{stage.description}</p>
          </div>
        </div>
      </div>

      <div className="stage-compact__footer">
        <span className={`stage-compact__dot ${isSelected ? 'stage-compact__dot--active' : ''}`} />
        <span className="stage-compact__status-text">{isSelected ? 'Active Live' : 'Verified'}</span>
      </div>
    </button>
  );
}







