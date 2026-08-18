import Button from '../ui/Button';
import { useRouter } from '../../context/RouterContext';
import './HeroSection.css';

export default function HeroSection() {
  const { navigate } = useRouter();

  return (
    <section className="hero">
      <div className="hero__background">
        <div className="hero__glow hero__glow--cyan" />
        <div className="hero__glow hero__glow--purple" />
      </div>

      <div className="hero__inner">
        {/* Left Column: Copy & CTAs */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-pulse" />
            <span className="hero__badge-text">Enterprise Edition 2026</span>
            <span className="hero__badge-divider">•</span>
            <span className="hero__badge-accent">Evidence-Grounded Multi-Agent Pipeline</span>
          </div>

          <h1 className="hero__title">
            Transform Raw SKUs into <br />
            <span className="text-gradient">Commerce-Ready</span> Content
          </h1>

          <p className="hero__subtitle">
            NEXORA is an evidence-driven Product Intelligence Engine that ingests incomplete, raw distributor SKUs, resolves canonical entities with source grounding, standardizes UOMs, and generates LOV-validated product catalogs at scale.
          </p>

          <div className="hero__ctas">
            <Button variant="primary" size="lg" icon={<span>→</span>} onClick={() => navigate('/catalog')}>
              Open Live Catalog Workspace
            </Button>
            <Button variant="outline" size="lg" icon={<span>⚡</span>} onClick={() => navigate('#roi-calculator')}>
              Calculate ROI
            </Button>
          </div>

          <div className="hero__proof-pills">
            <div className="hero__proof-item">
              <span className="hero__proof-icon">✅</span>
              <span><strong>1,000 SKUs</strong> Benchmark Processed</span>
            </div>
            <div className="hero__proof-item">
              <span className="hero__proof-icon">🎯</span>
              <span><strong>Canonical Manufacturer</strong> Resolution</span>
            </div>
            <div className="hero__proof-item">
              <span className="hero__proof-icon">🛡️</span>
              <span><strong>Evidence-Grounded</strong> Validation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Card Preview / Agent Pipeline Card */}
        <div className="hero__visual">
          <div className="hero__card glass-card">
            <div className="hero__card-header">
              <div className="hero__card-status">
                <span className="hero__status-dot" />
                <span className="hero__status-title">Representative Pipeline Example</span>
              </div>

              <span className="hero__sku-badge">SKU #1000 Verified</span>
            </div>

            <div className="hero__card-body">
              <div className="hero__raw-block">
                <span className="hero__block-label">RAW INPUT (CSV Row #482)</span>
                <code className="hero__code-snippet">
                  MPN: 3/8 CPLG BRS 150#<br />
                  Desc: 3/8 CPLG BRS 150# — Coupling<br />
                  Brand: -- Unbranded --<br />
                  Manuf: Freud Inc (2435)
                </code>
              </div>

              <div className="hero__transform-arrow">
                <span>↓ NEXORA Multi-Agent Intelligence Engine ↓</span>
              </div>

              <div className="hero__enriched-block">
                <span className="hero__block-label hero__block-label--accent">ENRICHED OUTPUT (LOV Validated)</span>
                <div className="hero__enriched-meta">
                  <div className="hero__meta-row">
                    <span className="hero__meta-key">Canonical Manufacturer:</span>
                    <span className="hero__meta-val">Freud Inc.</span>
                  </div>
                  <div className="hero__meta-row">
                    <span className="hero__meta-key">Resolved Brand:</span>
                    <span className="hero__meta-val">Freud Industrial</span>
                  </div>
                  <div className="hero__meta-row">
                    <span className="hero__meta-key">Classpath:</span>
                    <span className="hero__meta-val">Tools &amp; Hardware &gt; Abrasives &gt; Sanding Discs</span>
                  </div>
                  <div className="hero__meta-row">
                    <span className="hero__meta-key">Attributes:</span>
                    <span className="hero__meta-val hero__meta-val--badge">Size: 3/8 in • Material: Brass • Rating: 150 lb</span>
                  </div>
                  <div className="hero__meta-row">
                    <span className="hero__meta-key">Confidence Score:</span>
                    <span className="hero__meta-val hero__meta-val--green">98.4% (Auto-Approved)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero__card-footer">
              <div className="hero__confidence-mini">
                <span>Provenance Audit: <strong>100% Traceable</strong></span>
              </div>
              <span className="hero__badge-tag">PIM Export Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
