import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './EnterpriseGrid.css';

export default function EnterpriseGrid() {
  const capabilities = [
    {
      icon: '🛡️',
      title: 'LOV Governance Engine',
      description: 'Guarantees 100% taxonomy compliance. Extracted values must match pre-approved List of Values dictionary or get flagged.'
    },
    {
      icon: '🌐',
      title: 'Multi-Agent RAG Orchestration',
      description: 'Simultaneously queries live manufacturer websites, spec PDFs, and product databases to fill catalog attribute gaps.'
    },
    {
      icon: '🔗',
      title: 'Evidence Provenance Graph',
      description: 'Generates clickable proof audit trails for every field—linking extracted attributes directly to source HTML or PDF pages.'
    },
    {
      icon: '⚖️',
      title: 'Dynamic Confidence Scoring',
      description: 'Calculates weighted scores across entity match, classpath, and attributes. Auto-approves high confidence records.'
    },
    {
      icon: '⚠️',
      title: 'Automated Human Review Queue',
      description: 'Records scoring <85% are automatically routed to the human reviewer dashboard with clear reason codes for rapid triage.'
    },
    {
      icon: '📦',
      title: '252-Column CX1 Export Schema',
      description: 'Produces full delivery format CSV/JSON compatible with Enterprise CX1, Akeneo, Syndigo, and custom enterprise PIMs.'
    }
  ];

  return (
    <section className="enterprise-section">
      <div className="enterprise-section__inner">
        <SectionHeader
          tag="ENTERPRISE CAPABILITIES"
          title="Built for Production-Grade"
          titleAccent="Catalog Management"
          subtitle="Discover the six architectural pillars that make NEXORA trustworthy, scalable, and audit-ready for industrial distributors."
        />

        <div className="capabilities-grid">
          {capabilities.map((cap, idx) => (
            <Card key={idx} className="capability-card">
              <div className="cap-icon">{cap.icon}</div>
              <h3 className="cap-title">{cap.title}</h3>
              <p className="cap-desc">{cap.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
