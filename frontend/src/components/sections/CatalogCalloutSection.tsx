import { useRouter } from '../../context/RouterContext';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './CatalogCalloutSection.css';

export default function CatalogCalloutSection() {
  const { navigate } = useRouter();

  return (
    <section id="catalog-teaser" className="catalog-callout-section">
      <div className="catalog-callout__inner">
        <SectionHeader
          tag="LIVE CATALOG INTELLIGENCE WORKSPACE"
          title="Interactive Product Catalog"
          titleAccent="Workspace"
          subtitle="Transform raw manufacturer data into validated, evidence-grounded, 252-column commerce-ready product intelligence."
        />

        <Card className="catalog-callout__card glass-card">
          <div className="catalog-callout__header">
            <div className="catalog-callout__badge">
              <span className="callout__pulse" />
              <span>NEXORA Catalog Workspace</span>
            </div>
            <div className="catalog-callout__stats-mini">
              <span className="callout__stat-pill">⚡ 1,000 SKUs Processed</span>
              <span className="callout__stat-pill callout__stat-pill--green">✅ 70.0% Auto-Approved</span>
              <span className="callout__stat-pill callout__stat-pill--purple">📥 252-Column Export Ready</span>
            </div>
          </div>

          <div className="catalog-callout__grid">
            <div className="catalog-callout__feature">
              <span className="callout__icon">📤</span>
              <div className="callout__feature-content">
                <h4>Dynamic Dataset Ingestion</h4>
                <p>Upload evaluator CSV/XLSX files dynamically to run full multi-stage enrichment with custom input datasets.</p>
              </div>
            </div>

            <div className="catalog-callout__feature">
              <span className="callout__icon">🛡️</span>
              <div className="callout__feature-content">
                <h4>Source Grounding & Evidence</h4>
                <p>Inspect Tier-1 manufacturer spec sheets, verified URLs, and explainable HITL human-in-the-loop review reason codes.</p>
              </div>
            </div>

            <div className="catalog-callout__feature">
              <span className="callout__icon">🎯</span>
              <div className="callout__feature-content">
                <h4>LOV & UOM Standardizer</h4>
                <p>Enforce strict Unilog dictionary rules, zero-LLM decimal inch fraction conversions, and title character bounds.</p>
              </div>
            </div>

            <div className="catalog-callout__feature">
              <span className="callout__icon">📦</span>
              <div className="callout__feature-content">
                <h4>CX1 Commerce Delivery Export</h4>
                <p>Generate clean, 252-column standard delivery CSV exports formatted directly for e-commerce catalog ingestion.</p>
              </div>
            </div>
          </div>

          <div className="catalog-callout__action-bar">
            <div className="callout__action-text">
              <span className="callout__action-title">Ready to test your catalog data?</span>
              <span className="callout__action-sub">Open the dedicated workspace to upload files, search SKUs, and view evidence.</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<span>→</span>}
              onClick={() => navigate('/catalog')}
            >
              Open Catalog Workspace
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
