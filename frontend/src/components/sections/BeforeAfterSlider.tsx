import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import StatusBadge from '../ui/StatusBadge';
import ConfidenceBar from '../ui/ConfidenceBar';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="pipeline" className="before-after-section">
      <div className="before-after-section__inner">
        <SectionHeader
          tag="BEFORE vs AFTER INTELLIGENCE"
          title="See the Transformation in"
          titleAccent="Real-Time"
          subtitle="Compare messy, incomplete manufacturer rows with NEXORA's LOV-validated, evidence-backed SKU output."
        />

        <div className="slider-container glass-card">
          <div className="slider-grid">
            {/* Raw Side (Left) */}
            <div className="slider-card slider-card--raw" style={{ flex: `${sliderPosition}` }}>
              <div className="slider-side__badge slider-side__badge--raw">
                ⚠️ RAW UNILOG DISTRIBUTOR INPUT
              </div>
              <div className="raw-content">
                <div className="raw-row">
                  <span className="raw-label">MPN:</span>
                  <code className="raw-val">3/8 CPLG BRS 150#</code>
                </div>
                <div className="raw-row">
                  <span className="raw-label">Description:</span>
                  <code className="raw-val">3/8 CPLG BRS 150# — Coupling</code>
                </div>
                <div className="raw-row">
                  <span className="raw-label">E1 Brand:</span>
                  <code className="raw-val raw-val--missing">-- Unbranded --</code>
                </div>
                <div className="raw-row">
                  <span className="raw-label">Unilog Brand:</span>
                  <code className="raw-val raw-val--missing">-- No Unilog Brand --</code>
                </div>
                <div className="raw-row">
                  <span className="raw-label">Part Manuf:</span>
                  <code className="raw-val">Freud Inc (2435)</code>
                </div>

                <div className="raw-gaps-warning">
                  <span className="warning-title">🚨 Catalog Gaps Identified:</span>
                  <ul>
                    <li>❌ Brand is unassigned (79.9% dataset issue)</li>
                    <li>❌ Non-standard abbreviations (CPLG, BRS, 150#)</li>
                    <li>❌ Zero structured attributes or UOMs</li>
                    <li>❌ No channel-specific descriptions</li>
                    <li>❌ Missing spec sheet &amp; media links</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enriched Side (Right) */}
            <div className="slider-card slider-card--enriched" style={{ flex: `${100 - sliderPosition}` }}>
              <div className="slider-side__badge slider-side__badge--enriched">
                ✨ NEXORA ENRICHED COMMERCE OUTPUT
              </div>
              <div className="enriched-content">
                <div className="enriched-header">
                  <div>
                    <h4 className="enriched-title">Freud 3/8" Female Brass Pipe Coupling (150 lb Class)</h4>
                    <span className="enriched-classpath">
                      Tools &amp; Hardware &gt; Plumbing &gt; Pipe Fittings &gt; Brass Couplings
                    </span>
                  </div>
                  <StatusBadge status="approved" />
                </div>

                <div className="enriched-grid">
                  <div className="enriched-col">
                    <span className="col-heading">Canonical Entities</span>
                    <div className="meta-item">
                      <span className="meta-k">Manufacturer:</span>
                      <span className="meta-v">Freud Inc. (Canonical)</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-k">Resolved Brand:</span>
                      <span className="meta-v">Freud Industrial</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-k">MPN / Alt MPN:</span>
                      <span className="meta-v">3/8 CPLG BRS 150# / FRD-CPL-38</span>
                    </div>
                  </div>

                  <div className="enriched-col">
                    <span className="col-heading">LOV-Validated Attributes</span>
                    <div className="attributes-triplets">
                      <span className="triplet-tag">Size: <strong>3/8 in</strong></span>
                      <span className="triplet-tag">Connection: <strong>Female NPT</strong></span>
                      <span className="triplet-tag">Material: <strong>Brass</strong></span>
                      <span className="triplet-tag">Pressure Rating: <strong>150 lb</strong></span>
                    </div>
                  </div>
                </div>

                <div className="enriched-desc-preview">
                  <span className="col-heading">Synthesized Mobile Description</span>
                  <p className="mobile-text">
                    • 3/8" Female NPT Threaded Pipe Coupling<br />
                    • Solid Brass Construction for corrosion resistance<br />
                    • Class 150 Pressure Rating up to 300 PSI WOG
                  </p>
                </div>

                <div className="enriched-confidence-bar">
                  <ConfidenceBar value={0.984} label="Multi-Agent Pipeline Confidence" showPercentage />
                </div>
              </div>
            </div>
          </div>

          <div className="slider-control-bar">
            <span className="control-label">Adjust Split Ratio:</span>
            <input
              type="range"
              min="20"
              max="80"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="slider-input-visible"
              aria-label="Before and after split view ratio"
            />
            <span className="control-val">{sliderPosition}% Raw / {100 - sliderPosition}% Enriched</span>
          </div>
        </div>
      </div>
    </section>
  );
}
