import { motion } from 'framer-motion';
import { Globe, Database, Layers, Webhook, Code } from 'lucide-react';

const integrations = [
  { icon: Database, title: 'PIM Systems', desc: 'Connect to Product Information Management platforms to sync enriched product data.' },
  { icon: Layers, title: 'ERP Systems', desc: 'Export validated product records to your enterprise resource planning system.' },
  { icon: Globe, title: 'Commerce Platforms', desc: 'Push commerce-ready product data to e-commerce platforms and marketplaces.' },
  { icon: Database, title: 'Data Warehouse', desc: 'Stream product intelligence into your data warehouse for analytics.' },
  { icon: Code, title: 'REST API', desc: 'Full REST API for programmatic access to product intelligence capabilities.' },
  { icon: Webhook, title: 'Webhooks', desc: 'Real-time notifications for processing events, validation results and exports.' },
];

export default function Integrations() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Integrations</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Connect Your Stack</h1>
            <p className="mt-4 text-lg text-nexora-300">NEXORA integrates with your existing systems.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {integrations.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 hover:border-electric-500/20 transition-colors">
                <Icon className="w-6 h-6 text-electric-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-nexora-400">{desc}</p>
              </motion.div>
            ))}
          </div>
          {/* API Example */}
          <div className="max-w-2xl mx-auto glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">API Example</h3>
            <pre className="bg-nexora-900 rounded-lg p-4 text-sm font-mono text-nexora-300 overflow-x-auto">
{`POST /api/v1/products/analyze
Content-Type: application/json

{
  "mpn": "3/8 CPLG BRS 150#",
  "manufacturer": "Freud Inc (2435)",
  "description": "3/8 CPLG BRS 150#"
}

// Response
{
  "product_type": "Coupling",
  "material": "Brass",
  "size": "3/8 in",
  "pressure_rating": "150 psi",
  "confidence": 0.97,
  "status": "verified"
}`}
            </pre>
            <p className="text-xs text-nexora-600 mt-3 italic">Demo API structure — backend integration coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
