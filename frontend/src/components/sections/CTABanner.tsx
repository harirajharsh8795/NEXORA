import Button from '../ui/Button';
import './CTABanner.css';

export default function CTABanner() {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner glass-card">
        <div className="cta-banner__glow" />
        <div className="cta-banner__content">
          <span className="cta-tag">READY FOR ENTERPRISE CATALOG ENRICHMENT?</span>
          <h2 className="cta-title">
            Transform Your Product Catalog <br />
            <span className="text-gradient">With Multi-Agent Intelligence</span>
          </h2>
          <p className="cta-subtitle">
            Evidence-grounded enrichment. Deterministic LOV/UOM validation. Traceable product intelligence.
          </p>


          <div className="cta-actions">
            <Button variant="primary" size="lg" icon={<span>🚀</span>} onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Live Catalog Demo
            </Button>
            <Button variant="ghost" size="lg" onClick={() => {
              window.open('https://github.com/harirajharsh8795/NEXORA#readme', '_blank');
            }}>
              View Documentation &amp; Architecture
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
