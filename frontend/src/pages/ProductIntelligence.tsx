import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, ShieldCheck, FileSearch, ArrowRight } from 'lucide-react';

export default function ProductIntelligence() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Product Intelligence</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">AI-Powered Product Understanding</h1>
            <p className="mt-4 text-lg text-nexora-300">Transform raw SKU data into structured, enriched and validated product records.</p>
          </motion.div>
          <div className="space-y-6">
            {[
              { icon: Brain, title: 'Understand', desc: 'NEXORA parses raw product descriptions, part numbers and manufacturer data to extract key entities: MPN, manufacturer, brand, product type and material.' },
              { icon: Sparkles, title: 'Enrich', desc: 'Missing attributes are retrieved from manufacturer documentation using RAG. Every enriched value includes source evidence and confidence scoring.' },
              { icon: ShieldCheck, title: 'Validate', desc: 'Every generated value is validated against category-specific LOV constraints, UOM standards and business rules. Invalid values are flagged, not silently accepted.' },
              { icon: FileSearch, title: 'Explain', desc: 'Full provenance for every attribute: source document, evidence snippet, extraction agent, normalization rule and validation result.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex gap-4">
                <Icon className="w-8 h-8 text-electric-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-nexora-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl">
              See It in Action <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
