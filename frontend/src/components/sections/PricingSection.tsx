import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './PricingSection.css';

export default function PricingSection() {
  const tiers = [
    {
      name: 'Prototype / Free',
      price: 'Free',
      period: 'Open Source Demo & Proof of Concept',
      tag: 'UNIHACK EDITION',
      description: 'Ideal for initial distributor catalog cleanup & proof-of-concept validation.',
      features: [
        'Up to 1,000 SKU batch processing',
        'Canonical entity resolution (27K MFRs)',
        'LOV & UOM deterministic validation',
        '5 synthesized description formats',
        'Standard CSV export (252 columns)'
      ],
      cta: 'Explore Prototype',
      variant: 'outline' as const
    },
    {
      name: 'Team Tier',
      price: 'Custom Pricing',
      period: 'Contact us for team deployment',
      tag: 'RECOMMENDED',
      highlighted: true,
      description: 'Full multi-agent pipeline access for distributor catalog & PIM teams.',
      features: [
        'High-throughput continuous SKU processing',
        'Live Manufacturer Spec PDF RAG',
        'Evidence Graph provenance tracking',
        'Automated Human Review Routing Dashboard',
        'Direct FastAPI & Webhook integration',
        'Dedicated SLA & taxonomy customization'
      ],
      cta: 'Contact Us',
      variant: 'primary' as const
    },
    {
      name: 'Enterprise / Custom',
      price: 'Custom Pricing',
      period: 'Tailored SLA & On-Prem Deployment',
      tag: 'Dedicated On-Prem',
      description: 'For industrial conglomerates requiring private LLM deployment and custom LOV schemas.',
      features: [
        'Self-hosted Docker / Kubernetes deployment',
        'Custom private fine-tuned LLMs',
        'Proprietary LOV dictionary integration',
        '24/7 dedicated support & custom connectors'
      ],
      cta: 'Contact Sales Team',
      variant: 'outline' as const
    }
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-section__inner">
        <SectionHeader
          tag="FLEXIBLE DEPLOYMENT TIERS"
          title="Scale Across Any"
          titleAccent="Catalog Volume"
          subtitle="Choose the deployment model that fits your catalog volume—from open-source prototype validation to enterprise multi-agent pipeline sync."
        />

        <div className="pricing-grid">
          {tiers.map((t, idx) => (
            <Card key={idx} className={`pricing-card ${t.highlighted ? 'pricing-card--highlighted' : ''}`}>
              {t.tag && (
                <div className={`pricing-tag ${t.highlighted ? 'pricing-tag--highlighted' : ''}`}>
                  {t.tag}
                </div>
              )}

              <h3 className="pricing-name">{t.name}</h3>
              <p className="pricing-desc">{t.description}</p>

              <div className="pricing-price-box">
                <span className="price-num">{t.price}</span>
                <span className="price-period">{t.period}</span>
              </div>

              <ul className="pricing-features">
                {t.features.map((f, fIdx) => (
                  <li key={fIdx} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pricing-cta-box">
                <Button variant={t.variant} fullWidth size="lg">
                  {t.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
