import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './FeatureCommerceReady.css';

export default function FeatureCommerceReady() {
  return (
    <section className="feature-section">
      <div className="feature-section__inner">
        <div className="feature-layout">
          {/* Copy (Left) */}
          <div className="feature-copy">
            <span className="feature-num">FEATURE 03</span>
            <SectionHeader
              title="Omni-Channel Synthesis &"
              titleAccent="252-Column PIM Export"
              subtitle="Different sales channels demand distinct copy formats. NEXORA synthesizes 5 dedicated description types and formats a 252-column master catalog ready for immediate PIM ingestion."
            />

            <ul className="feature-checklist">
              <li className="feature-check-item">
                <span className="check-icon">📱</span>
                <div>
                  <strong>Mobile Bulleted Descriptions:</strong>
                  <p>Concise, bullet-pointed summaries engineered for high conversion on mobile screens and quick scanning.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">🧾</span>
                <div>
                  <strong>Invoice &amp; ERP Formats:</strong>
                  <p>Uppercase character-limited descriptions tailored for billing, POS, and logistics receipts.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">📦</span>
                <div>
                  <strong>252-Column Enterprise CX1 Delivery:</strong>
                  <p>Matches exact column layout specification: MPN, Alt MPN, GTIN, UNSPSC, Specs, PDFs, Image URLs, and Attributes 1..50.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Visual Card (Right) */}
          <div className="feature-visual">
            <Card className="feature-card">
              <div className="card-top-bar">
                <span className="card-pill card-pill--cyan">5 Description Formats</span>
                <span className="card-pill card-pill--purple">CX1 Schema Ready</span>
              </div>

              <h4 className="feature-card-title">Synthesized Channel Formats</h4>

              <div className="formats-stack">
                <div className="format-box">
                  <div className="format-box-header">
                    <span className="format-badge">MOBILE_DESC</span>
                    <span className="format-meta">Bullet Points • 4-Line Max</span>
                  </div>
                  <p className="format-code">
                    • 24" Stainless Steel Top Control Built-In Dishwasher<br />
                    • OrbitClean® wash system with 4x better water coverage<br />
                    • Quiet 49 dBA sound level with floor beam indicator
                  </p>
                </div>

                <div className="format-box">
                  <div className="format-box-header">
                    <span className="format-badge format-badge--inv">INVOICE_DESC</span>
                    <span className="format-meta">Uppercase • ERP Compliant</span>
                  </div>
                  <p className="format-code">
                    FRIGIDAIRE GALLERY 24IN BUILT-IN DISHWASHER SS 49DBA
                  </p>
                </div>

                <div className="format-box">
                  <div className="format-box-header">
                    <span className="format-badge format-badge--seo">RETAIL / MARKETING_DESC</span>
                    <span className="format-meta">SEO Rich • E-Commerce Ready</span>
                  </div>
                  <p className="format-code">
                    Elevate your kitchen cleanup with the Frigidaire Gallery 24-inch Built-In Dishwasher engineered for spot-free cleaning...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
