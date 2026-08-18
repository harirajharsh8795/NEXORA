import StatCard from '../ui/StatCard';
import './StatsBar.css';

export default function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="stats-bar__inner">
        <div className="stats-grid">
          <StatCard
            value="1,000"
            label="Benchmark SKUs Processed"
            sublabel="Full 1,000 input SKUs processed without batch errors"
            accentColor="var(--nexora-purple)"
          />

          <StatCard
            value="3,278 / sec"
            label="Deterministic Pipeline Speed"
            sublabel="0.305ms/SKU local benchmark (Live search latency-bound)"
            accentColor="var(--nexora-cyan)"
          />

          <StatCard
            value="3,462"
            label="LOV Attributes Extracted"
            sublabel="100% LOV & UOM compliance on tested benchmark"
            accentColor="var(--nexora-pink)"
          />

          <StatCard
            value="70.1%"
            label="Auto-Approved Rate"
            sublabel="Confidence ≥85% auto-approved; 29.9% routed to HITL review"
            accentColor="var(--color-success)"
          />

        </div>
      </div>
    </section>
  );
}
