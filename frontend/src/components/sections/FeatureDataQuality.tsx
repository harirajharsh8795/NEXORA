import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './FeatureDataQuality.css';

export default function FeatureDataQuality() {
  return (
    <section id="features" className="feature-section">
      <div className="feature-section__inner">
        <div className="feature-layout">
          {/* Left Column: Copy */}
          <div className="feature-copy">
            <span className="feature-num">FEATURE 01</span>
            <SectionHeader
              title="LOV-Constrained Governance &"
              titleAccent="Deterministic Normalization"
              subtitle="Pure LLM models hallucinate invalid values and unstandardized UOMs. NEXORA forces all extracted attributes through a deterministic List of Values (LOV) engine and UOM standardizer."
            />

            <ul className="feature-checklist">
              <li className="feature-check-item">
                <span className="check-icon">🛡️</span>
                <div>
                  <strong>Evidence-Grounded Guardrails:</strong>
                  <p>Candidate values are checked against approved taxonomy LOVs and source evidence. Unsupported or invalid values are automatically rejected or routed to human review.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">📐</span>
                <div>
                  <strong>Deterministic UOM Engine:</strong>
                  <p>Converts arbitrary strings ('inch', 'inches', 'in.') to canonical UOM codes ('in') and standardizes numerical values.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">🔗</span>
                <div>
                  <strong>Full Evidence Provenance Graph:</strong>
                  <p>Every attribute, entity name, and description is bound to a verified source URL, PDF snippet, or deterministic rule.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Card */}
          <div className="feature-visual">
            <Card className="feature-card">
              <div className="card-top-bar">
                <span className="card-pill card-pill--cyan">LOV Engine v2.4</span>
                <span className="card-pill card-pill--purple">UOM Standardizer</span>
              </div>

              <h4 className="feature-card-title">Triplets Normalization Flow</h4>

              <div className="normalization-list">
                <div className="norm-item">
                  <div className="norm-input">
                    <span className="norm-tag norm-tag--raw">RAW</span>
                    <code>"3/8 CPLG"</code>
                  </div>
                  <span className="norm-arrow">→</span>
                  <div className="norm-output">
                    <span className="norm-tag norm-tag--valid">LOV VALID</span>
                    <span className="norm-res">Size: <strong>3/8</strong> | UOM: <strong>in</strong></span>
                  </div>
                </div>

                <div className="norm-item">
                  <div className="norm-input">
                    <span className="norm-tag norm-tag--raw">RAW</span>
                    <code>"BRS"</code>
                  </div>
                  <span className="norm-arrow">→</span>
                  <div className="norm-output">
                    <span className="norm-tag norm-tag--valid">LOV VALID</span>
                    <span className="norm-res">Material: <strong>Brass</strong></span>
                  </div>
                </div>

                <div className="norm-item">
                  <div className="norm-input">
                    <span className="norm-tag norm-tag--raw">RAW</span>
                    <code>"150#"</code>
                  </div>
                  <span className="norm-arrow">→</span>
                  <div className="norm-output">
                    <span className="norm-tag norm-tag--valid">LOV VALID</span>
                    <span className="norm-res">Pressure: <strong>150</strong> | UOM: <strong>lb</strong></span>
                  </div>
                </div>
              </div>

              <div className="lov-badge-box">
                <span className="lov-stat-title">LOV Validation Pass Rate</span>
                <div className="lov-bar-outer">
                  <div className="lov-bar-inner" style={{ width: '100%' }} />
                </div>
                <span className="lov-stat-val">100.0% Benchmark LOV &amp; UOM Compliant</span>
              </div>

            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
