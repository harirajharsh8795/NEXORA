import StatCard from '../ui/StatCard';
import './StatsBar.css';

export default function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="stats-bar__inner">
        <div className="stats-grid">
          <StatCard
            value="1,000"
            label="Raw SKUs Processed"
            sublabel="100% full dataset coverage with 0 dropouts"
            accentColor="var(--nexora-purple)"
          />

          <StatCard
            value="100%"
            label="Manufacturer Resolution"
            sublabel="Zero unmapped vendor entities across 77 mfrs"
            accentColor="var(--nexora-cyan)"
          />

          <StatCard
            value="3,462"
            label="LOV Attributes Extracted"
            sublabel="Standardized triplets with UOM normalization"
            accentColor="var(--nexora-pink)"
          />

          <StatCard
            value="68.4%"
            label="Auto-Approved Split"
            sublabel="Confidence ≥ 85% passed without human intervention"
            accentColor="var(--color-success)"
          />
        </div>
      </div>
    </section>
  );
}
