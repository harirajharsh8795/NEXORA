import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './IntegrationsSection.css';

export default function IntegrationsSection() {
  const integrationCategories = [
    {
      icon: '🗃️',
      category: 'PIM Systems',
      description: 'Native schema mapping for CX1, Akeneo, Syndigo, and custom Product Information Management platforms.'
    },
    {
      icon: '🏢',
      category: 'ERP Platforms',
      description: 'Invoice, line item, and logistics description sync with Enterprise Resource Planning software.'
    },
    {
      icon: '🛒',
      category: 'E-Commerce Engines',
      description: 'Automated catalog ingestion for B2B distributors and enterprise digital storefronts.'
    },
    {
      icon: '📊',
      category: 'Data Warehouses',
      description: 'Direct SQL & parquet pipeline sync for Snowflake, BigQuery, and enterprise data lakes.'
    },
    {
      icon: '⚡',
      category: 'REST API & Webhooks',
      description: 'High-throughput async endpoint wrappers with real-time webhooks for batch & stream processing.'
    },
    {
      icon: '🏛️',
      category: 'Master Data Management',
      description: 'Golden record synchronization and canonical taxonomy lookup across distributor networks.'
    },
    {
      icon: '🖼️',
      category: 'Digital Asset Management',
      description: 'Automatic association of product images, spec sheet PDFs, SDS docs, and CAD drawings.'
    },
    {
      icon: '📦',
      category: 'Distributor Feeds',
      description: '252-column CSV/JSON schema exporter tuned for industrial distribution standards.'
    }
  ];

  return (
    <section className="integrations-section">
      <div className="integrations-section__inner">
        <SectionHeader
          tag="ENTERPRISE CONNECTIVITY"
          title="Seamless Integration Across Your"
          titleAccent="Data Stack"
          subtitle="NEXORA connects via standard REST APIs, webhooks, and CSV/JSON schema exporters with zero vendor lock-in."
        />

        <div className="integrations-grid">
          {integrationCategories.map((item, idx) => (
            <Card key={idx} className="integration-card">
              <div className="integration-icon">{item.icon}</div>
              <div className="integration-badge">Generic System Category</div>
              <h3 className="integration-category">{item.category}</h3>
              <p className="integration-desc">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="integrations-disclaimer">
          <span>ℹ️ Note: Standard system category architecture shown. All integrations connect via open schema endpoints.</span>
        </div>
      </div>
    </section>
  );
}
