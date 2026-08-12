import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function DataQualityPage() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Data Quality</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Measure. Monitor. Improve.</h1>
            <p className="mt-4 text-lg text-nexora-300">The N-Score quantifies product data quality across completeness, accuracy, consistency and validation dimensions.</p>
          </motion.div>
          <div className="glass-card p-8 text-center mb-8">
            <div className="text-6xl font-bold gradient-text mb-2">96</div>
            <div className="text-sm text-nexora-400">N-Score / 100</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Completeness', value: '94%' },
                { label: 'Accuracy', value: '97%' },
                { label: 'Consistency', value: '98%' },
                { label: 'LOV Compliance', value: '99%' },
                { label: 'UOM Compliance', value: '100%' },
                { label: 'Evidence Coverage', value: '92%' },
              ].map(m => (
                <div key={m.label} className="p-3 rounded-lg bg-nexora-900/50">
                  <div className="text-lg font-bold text-white">{m.value}</div>
                  <div className="text-xs text-nexora-500">{m.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-nexora-600 mt-4 italic">Demo values — not calculated from actual data</p>
          </div>
          <div className="text-center">
            <Link to="/dashboard/data-quality" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl">
              View Quality Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
