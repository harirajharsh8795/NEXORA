import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import './ManualVsAgent.css';

export default function ManualVsAgent() {
  const comparisonRows = [
    {
      metric: 'Enrichment Speed',
      manual: '30–60 Minutes / SKU',
      agent: '2.5 Seconds / SKU',
      winner: 'agent'
    },
    {
      metric: 'LOV Compliance',
      manual: 'Inconsistent (~62% compliance)',
      agent: '100% LOV Guardrail Enforcement',
      winner: 'agent'
    },
    {
      metric: 'UOM Standardization',
      manual: 'Mixed (in, inches, ", in.)',
      agent: 'Deterministic Canonical UOMs',
      winner: 'agent'
    },
    {
      metric: 'Entity Resolution',
      manual: 'Manual Google Search & Guesswork',
      agent: '27,000+ Master Lookup + RAG',
      winner: 'agent'
    },
    {
      metric: 'Traceability & Provenance',
      manual: 'No audit trail for values',
      agent: 'Evidence Graph for every field',
      winner: 'agent'
    },
    {
      metric: 'Cost at 10,000 SKUs',
      manual: '$150,000+ ($15/SKU labor)',
      agent: '$1,200 ($0.12/SKU API compute)',
      winner: 'agent'
    }
  ];

  return (
    <section className="comparison-section">
      <div className="comparison-section__inner">
        <SectionHeader
          tag="PARADIGM SHIFT"
          title="Manual Operations vs"
          titleAccent="NEXORA Multi-Agent"
          subtitle="Compare legacy human-in-the-loop catalog enrichment with NEXORA's evidence-backed multi-agent system."
        />

        <Card className="comparison-table-card">
          <div className="comparison-table">
            <div className="table-header">
              <div className="th-cell th-cell--metric">Metric / Dimension</div>
              <div className="th-cell th-cell--manual">❌ Legacy Manual Process</div>
              <div className="th-cell th-cell--agent">⚡ NEXORA AI Pipeline</div>
            </div>

            {comparisonRows.map((row, idx) => (
              <div key={idx} className="table-row">
                <div className="td-cell td-cell--metric">{row.metric}</div>
                <div className="td-cell td-cell--manual">{row.manual}</div>
                <div className="td-cell td-cell--agent">
                  <span className="winner-check">✓</span> {row.agent}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
