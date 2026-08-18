import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './IntegrationsSection.css';

export default function IntegrationsSection() {
  const integrationCategories = [
    {
      icon: '🗃️',
      category: 'PIM Systems',
      description: 'Designed for schema compatibility with CX1, Akeneo, Syndigo, and custom Product Information Management platforms.'
    },
    {
      icon: '🏢',
      category: 'ERP Platforms',
      description: 'Schema-compatible formatting for invoice, line item, and logistics descriptions.'
    },
    {
      icon: '🛒',
      category: 'E-Commerce Storefronts',
      description: 'Structured, commerce-ready output formatted for digital distributor storefronts.'
    },
    {
      icon: '📊',
      category: 'Data Warehouses',
      description: 'Export compatible with standard data warehouse formats (CSV/JSON/Parquet).'
    },
    {
      icon: '⚡',
      category: 'REST API Endpoints',
      description: 'Standard REST endpoints for single-SKU dynamic enrichment and batch ingestion.'
    },
    {
      icon: '🏛️',
      category: 'Master Data Systems',
      description: 'Golden record structure and canonical taxonomy lookup for distributor catalogs.'
    },
    {
      icon: '🖼️',
      category: 'Digital Assets & Specs',
      description: 'Structured extraction of product image links, specification sheet PDFs, and instruction manuals.'
    },
    {
      icon: '📦',
      category: 'Distributor Delivery',
      description: '252-column CSV/XLSX delivery format exporter tuned for Unilog industrial catalog standards.'
    }
  ];

  return (
    <section className="integrations-section">
      <div className="integrations-section__inner">
        <SectionHeader
          tag="ENTERPRISE CONNECTIVITY"
          title="Designed for Integration Across Your"
          titleAccent="Data Stack"
          subtitle="NEXORA outputs schema-aligned delivery formats and standard REST API endpoints for seamless catalog integration."
        />

        <div className="integrations-grid">
          {integrationCategories.map((item, idx) => (
            <Card key={idx} className="integration-card">
              <div className="integration-icon">{item.icon}</div>
              <div className="integration-badge">Schema-Compatible Destination</div>
              <h3 className="integration-category">{item.category}</h3>
              <p className="integration-desc">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="integrations-disclaimer">
          <span>ℹ️ Potential Integration Targets: System names represent standard target platforms compatible with NEXORA's 252-column export schema.</span>
        </div>
      </div>
    </section>
  );
}

