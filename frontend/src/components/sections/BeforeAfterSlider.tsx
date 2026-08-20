import { useState, useRef, useCallback } from 'react';
import SectionHeader from '../ui/SectionHeader';
import StatusBadge from '../ui/StatusBadge';
import ConfidenceBar from '../ui/ConfidenceBar';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // pointer capture released automatically
      }
    }
  };

  return (
    <section id="transformation" className="before-after-section">
      <div className="before-after-section__inner">
        <SectionHeader
          tag="BEFORE vs AFTER INTELLIGENCE"
          title="See the Transformation in"
          titleAccent="Real-Time"
          subtitle="Drag the slider left or right to compare raw, incomplete distributor SKUs with NEXORA's LOV-validated, evidence-backed output."
        />

        <div
          ref={containerRef}
          className={`slider-container glass-card ${isDragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Base Layer: Raw Input (Left side visible when slider moves right) */}
          <div className="slider-panel slider-panel--raw">
            <div className="slider-side__badge slider-side__badge--raw">
              ⚠️ RAW DISTRIBUTOR INPUT (BEFORE)
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
                <span className="raw-label">Supplier Brand:</span>
                <code className="raw-val raw-val--missing">-- No Supplier Brand --</code>
              </div>
              <div className="raw-row">
                <span className="raw-label">Part Manuf:</span>
                <code className="raw-val">Freud Inc (2435)</code>
              </div>

              <div className="raw-gaps-warning">
                <span className="warning-title">🚨 Catalog Quality Issues Identified:</span>
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

          {/* Overlay Layer: Enriched Output (Clipped from left by sliderPos%) */}
          <div
            className="slider-panel slider-panel--enriched"
            style={{
              clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
            }}
          >
            <div className="slider-side__badge slider-side__badge--enriched">
              ✨ NEXORA ENRICHED COMMERCE OUTPUT (AFTER)
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

          {/* Divider Line */}
          <div
            className="slider-divider-line"
            style={{ left: `${sliderPos}%` }}
          />

          {/* Drag Handle Grip Element */}
          <div
            className="slider-drag-handle"
            style={{ left: `${sliderPos}%` }}
            title="Drag left or right to compare raw vs enriched catalog data"
          >
            <div className="drag-handle-inner">
              <i className="fa-solid fa-arrows-left-right"></i>
            </div>
          </div>
        </div>

        {/* Sync Range Control Bar */}
        <div className="slider-control-bar">
          <span className="control-label">Raw Catalog (0%)</span>
          <input
            type="range"
            min="2"
            max="98"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="slider-input-visible"
            aria-label="Before/After comparison slider position"
          />
          <span className="control-label">Enriched Catalog (100%)</span>
          <span className="control-val">{Math.round(sliderPos)}% Enriched</span>
        </div>
      </div>
    </section>
  );
}

