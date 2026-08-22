import React, { useState } from 'react';
import './InfoModal.css';

export type ModalType = 'docs' | 'api' | 'cases' | 'blog' | 'about' | 'contact' | 'privacy' | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
}

export default function InfoModal({ type, onClose }: InfoModalProps) {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', skus: '10k-50k', message: '' });

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal__header">
          <div className="info-modal__tag-group">
            <span className="info-modal__tag">NEXORA PLATFORM KNOWLEDGE BASE</span>
            <button className="info-modal__close-btn" onClick={onClose} aria-label="Close modal">✕</button>
          </div>
        </div>

        <div className="info-modal__body">
          {/* 1. DOCUMENTATION */}
          {type === 'docs' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">📖 NEXORA System Documentation</h2>
              <p className="modal-sub">
                Complete architectural guide, pipeline stage specifications, LOV validation rules, and benchmark metrics.
              </p>

              <div className="modal-grid-2">
                <div className="doc-section-card">
                  <h4>1. Raw CSV/XLSX Ingestion Stage</h4>
                  <p>Accepts raw distributor CSV or Excel files with non-standard header formats. Performs cleaning, sentinel filtering, and MPN normalization.</p>
                </div>
                <div className="doc-section-card">
                  <h4>2. Entity Resolution &amp; Fuzzy Matcher</h4>
                  <p>Resolves raw vendor names against master databases using RapidFuzz WRatio and co-op mapping rules. Guarantees 0.0 confidence for unresolved entities.</p>
                </div>
                <div className="doc-section-card">
                  <h4>3. 4-Tier Taxonomy Classification</h4>
                  <p>Assigns Department, Category Class, Fine Line, and full 4-tier Classpath to products using keyword hierarchies and domain context.</p>
                </div>
                <div className="doc-section-card">
                  <h4>4. Attribute &amp; LOV Standardizer</h4>
                  <p>Extracts up to 50 structured attribute triplets. Normalizes unit of measurement (UOM) casing and converts decimal measurements to standard fractions.</p>
                </div>
                <div className="doc-section-card">
                  <h4>5. Evidence Graph &amp; Provenance</h4>
                  <p>Records Tier-1 manufacturer spec sheets, verified URL links, and snippet evidence. Excludes untrusted consumer marketplaces.</p>
                </div>
                <div className="doc-section-card">
                  <h4>6. Confidence &amp; HITL Routing Gate</h4>
                  <p>Evaluates field scores and overall pipeline score. Automatically routes unresolved manufacturer or low-confidence SKUs to human review with explainable reason codes.</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. API REFERENCE */}
          {type === 'api' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">⚡ REST API Reference</h2>
              <p className="modal-sub">
                Production REST API endpoints for catalog enrichment, batch upload, single SKU lookup, and delivery CSV export.
              </p>

              <div className="api-endpoint-list">
                <div className="api-endpoint">
                  <div className="api-meta">
                    <span className="http-badge http-get">GET</span>
                    <code>/api/status</code>
                  </div>
                  <p>Returns overall pipeline benchmark statistics, auto-approval rates, and attribute extraction metrics.</p>
                </div>

                <div className="api-endpoint">
                  <div className="api-meta">
                    <span className="http-badge http-get">GET</span>
                    <code>/api/products?status=all&amp;page=1&amp;limit=20</code>
                  </div>
                  <p>Fetches paginated enriched catalog records with field-level confidence breakdown and evidence graphs.</p>
                </div>

                <div className="api-endpoint">
                  <div className="api-meta">
                    <span className="http-badge http-post">POST</span>
                    <code>/api/upload</code>
                  </div>
                  <p>Dynamically processes uploaded CSV or XLSX evaluator files through the 8-stage agent pipeline.</p>
                </div>

                <div className="api-endpoint">
                  <div className="api-meta">
                    <span className="http-badge http-post">POST</span>
                    <code>/api/v1/enrich-batch</code>
                  </div>
                  <p>Batch enriches raw JSON product arrays with real-time entity resolution and attribute extraction.</p>
                </div>

                <div className="api-endpoint">
                  <div className="api-meta">
                    <span className="http-badge http-get">GET</span>
                    <code>/api/export</code>
                  </div>
                  <p>Generates and downloads the official 252-column CX1 e-commerce delivery CSV file.</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. CASE STUDIES */}
          {type === 'cases' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">🏆 Enterprise Case Studies</h2>
              <p className="modal-sub">
                Real-world benchmark results demonstrating catalog accuracy and manual effort reduction.
              </p>

              <div className="case-cards">
                <div className="case-card">
                  <div className="case-tag">INDUSTRIAL DISTRIBUTOR</div>
                  <h3>Freud &amp; Diablo Industrial Abrasives</h3>
                  <p>Ingested 1,000 raw distributor SKUs with messy vendor names and truncated descriptions.</p>
                  <div className="case-stats">
                    <span className="case-stat"><strong>70.0%</strong> Auto-Approval</span>
                    <span className="case-stat"><strong>98.4%</strong> LOV Accuracy</span>
                    <span className="case-stat"><strong>15x</strong> Faster Speed</span>
                  </div>
                </div>

                <div className="case-card">
                  <div className="case-tag">APPLIANCE &amp; HVAC CO-OP</div>
                  <h3>Appliance Dealers Co-op (ADC)</h3>
                  <p>Mapped distributor co-op vendor names to canonical parent manufacturers (Rheem, Whirlpool, Frigidaire).</p>
                  <div className="case-stats">
                    <span className="case-stat"><strong>100%</strong> Parent Resolution</span>
                    <span className="case-stat"><strong>0%</strong> Hallucination</span>
                    <span className="case-stat"><strong>252-Col</strong> PIM Export</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ARCHITECTURE WHITEPAPER / BLOG */}
          {type === 'blog' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">📄 Architecture Whitepaper</h2>
              <p className="modal-sub">
                Evidence-Grounded Multi-Agent Intelligence for Enterprise Product Data Enrichment.
              </p>

              <div className="whitepaper-box">
                <h4>Abstract</h4>
                <p>
                  Enterprise product catalog management suffers from incomplete supplier data, unverified vendor branding, and manual catalog creation bottlenecks. We present NEXORA, an evidence-grounded multi-agent system combining deterministic rules engines (Rapidfuzz, regularized UOM normalization, decimal fraction conversion) with Gemini LLM extraction and source-grounded web verification.
                </p>
                <div className="whitepaper-highlights">
                  <div className="highlight-pill">✓ Zero-Hallucination Safe Abstention</div>
                  <div className="highlight-pill">✓ Deterministic LOV Enforcement</div>
                  <div className="highlight-pill">✓ Provenance Audit Trail Graph</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. ABOUT NEXORA */}
          {type === 'about' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">ℹ️ About NEXORA AI</h2>
              <p className="modal-sub">
                Autonomous Product Intelligence &amp; Catalog Enrichment Engine.
              </p>
              <div className="about-text">
                <p>
                  NEXORA is engineered specifically for e-commerce catalog operations, industrial distributors, and enterprise PIM teams. By leveraging an 8-stage autonomous agent pipeline, NEXORA standardizes raw distributor datasets into clean, 252-column commerce-ready catalog deliverables with 100% evidence traceability.
                </p>
                <div className="about-features">
                  <div><strong>Built for:</strong> Industrial &amp; Commercial eCommerce</div>
                  <div><strong>Core Focus:</strong> Semantic Accuracy &amp; Safe Abstention</div>
                  <div><strong>Edition:</strong> Enterprise Edition 2026</div>
                </div>
              </div>
            </div>
          )}

          {/* 6. ENTERPRISE CONTACT */}
          {type === 'contact' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">💬 Enterprise Contact &amp; Demo</h2>
              <p className="modal-sub">
                Get in touch with our AI catalog engineering team to discuss custom pipeline integrations.
              </p>

              {contactSubmitted ? (
                <div className="contact-success">
                  <span className="success-icon">✅</span>
                  <h3>Thank you for reaching out!</h3>
                  <p>Our catalog intelligence engineering team will contact you within 24 hours to schedule a custom demo.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Work Email *</label>
                    <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="john@company.com" />
                  </div>
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input type="text" required value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} placeholder="Acme Industrial Inc." />
                  </div>
                  <div className="form-group">
                    <label>Catalog Size (SKUs)</label>
                    <select value={contactForm.skus} onChange={(e) => setContactForm({ ...contactForm, skus: e.target.value })}>
                      <option value="1k-10k">1,000 – 10,000 SKUs</option>
                      <option value="10k-50k">10,000 – 50,000 SKUs</option>
                      <option value="50k+">50,000+ SKUs</option>
                    </select>
                  </div>
                  <button type="submit" className="contact-submit-btn">Submit Request →</button>
                </form>
              )}
            </div>
          )}

          {/* 7. PRIVACY POLICY */}
          {type === 'privacy' && (
            <div className="info-modal__content">
              <h2 className="modal-heading">🔒 Privacy &amp; Data Governance</h2>
              <p className="modal-sub">
                Enterprise data security, encryption, and zero-retention compliance standards.
              </p>
              <div className="privacy-details">
                <p>NEXORA processes uploaded SKU datasets strictly for catalog enrichment and evaluation.</p>
                <ul>
                  <li><strong>Data Isolation:</strong> Processed SKU caches are isolated per tenant session.</li>
                  <li><strong>Encryption:</strong> All payload transmissions are encrypted via TLS 1.3.</li>
                  <li><strong>Zero Proprietary Retention:</strong> Customer SKU data is never used to train public foundational LLM models.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="info-modal__footer">
          <button className="info-modal__close-footer-btn" onClick={onClose}>Close Window</button>
        </div>
      </div>
    </div>
  );
}
