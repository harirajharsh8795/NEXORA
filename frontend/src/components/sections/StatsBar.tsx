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
            value="384.9 / sec"
            label="Measured Processing Speed"
            sublabel="2.6ms per SKU • Scalable to 500M+ SKUs/mo"
            accentColor="var(--nexora-cyan)"
          />

          <StatCard
            value="3,462"
            label="LOV Attributes Extracted"
            sublabel="100% LOV compliant with UOM standardization"
            accentColor="var(--nexora-pink)"
          />

          <StatCard
            value="68.0%"
            label="Auto-Approved Split"
            sublabel="Conf ≥ 85% auto-passed; 32% routed to HITL triage"
            accentColor="var(--color-success)"
          />
        </div>
      </div>
    </section>
  );
}
