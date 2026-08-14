import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './FeatureProductIntelligence.css';

export default function FeatureProductIntelligence() {
  return (
    <section className="feature-section feature-section--alt">
      <div className="feature-section__inner">
        <div className="feature-layout feature-layout--reverse">
          {/* Visual Card (Left) */}
          <div className="feature-visual">
            <Card className="feature-card">
              <div className="card-top-bar">
                <span className="card-pill card-pill--cyan">27,000+ Master Lookup</span>
                <span className="card-pill card-pill--purple">Taxonomy Classifier</span>
              </div>

              <h4 className="feature-card-title">Canonical Manufacturer &amp; Classpath Mapping</h4>

              <div className="entity-resolution-demo">
                <div className="entity-box">
                  <span className="entity-k">RAW VENDOR NAME</span>
                  <div className="entity-v-raw">"Freud Inc (2435)"</div>
                  <div className="entity-match-arrow">↓ Fuzzy Match &amp; Alias Index</div>
                  <div className="entity-v-resolved">
                    <span className="icon">✓</span>
                    <span>CANONICAL: <strong>Freud Inc. (Electrolux Home Products)</strong></span>
                  </div>
                </div>

                <div className="entity-box">
                  <span className="entity-k">UNASSIGNED BRAND RESOLUTION</span>
                  <div className="entity-v-raw">"-- Unbranded --"</div>
                  <div className="entity-match-arrow">↓ Contextual Brand Extraction Agent</div>
                  <div className="entity-v-resolved">
                    <span className="icon">✓</span>
                    <span>RESOLVED: <strong>Freud Industrial®</strong></span>
                  </div>
                </div>

                <div className="taxonomy-badge-tree">
                  <span className="tree-step">Dept: Appliances</span>
                  <span className="tree-sep">&gt;</span>
                  <span className="tree-step">Class: Kitchen</span>
                  <span className="tree-sep">&gt;</span>
                  <span className="tree-step tree-step--accent">Fine Line: Dishwashers</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Copy (Right) */}
          <div className="feature-copy">
            <span className="feature-num">FEATURE 02</span>
            <SectionHeader
              title="Multi-Agent Entity &"
              titleAccent="Taxonomy Intelligence"
              subtitle="79.9% of raw distributor data has missing or unbranded fields. NEXORA resolves vendor names against a 27,000+ manufacturer master database and builds complete 4-tier taxonomy classpaths."
            />

            <ul className="feature-checklist">
              <li className="feature-check-item">
                <span className="check-icon">🏭</span>
                <div>
                  <strong>100% Canonical Manufacturer Match:</strong>
                  <p>Matches raw vendor noise ('Freud Inc (2435)') to official manufacturer names and parent corporations with 100% accuracy.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">🏷️</span>
                <div>
                  <strong>Unbranded Entity Resolution:</strong>
                  <p>Eliminates '-- Unbranded --' placeholders by inferring true brand relationships from MPN structures and spec sheets.</p>
                </div>
              </li>
              <li className="feature-check-item">
                <span className="check-icon">🗂️</span>
                <div>
                  <strong>4-Tier Classpath Taxonomy Engine:</strong>
                  <p>Maps every product into Department &gt; Category Class &gt; Fine Line &gt; Classpath for seamless PIM category navigation.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
