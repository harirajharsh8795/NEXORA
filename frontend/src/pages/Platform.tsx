import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Brain, Sparkles, ShieldCheck, Zap, ArrowRight, Layers, FileSearch, Users, Bot } from 'lucide-react';

export default function Platform() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Platform</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">The NEXORA Platform</h1>
            <p className="mt-4 text-lg text-nexora-300 max-w-2xl mx-auto">End-to-end product intelligence: from raw data ingestion to commerce-ready output.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Database, title: 'Data Ingestion', desc: 'Import from Excel, CSV, PDF, images, URLs and manufacturer documents.' },
              { icon: Brain, title: 'Product Understanding', desc: 'AI agents extract entities, resolve abbreviations and understand product identity.' },
              { icon: Sparkles, title: 'Intelligent Enrichment', desc: 'RAG-powered retrieval fills missing attributes from manufacturer sources.' },
              { icon: ShieldCheck, title: 'Validation Engine', desc: 'LOV, UOM, taxonomy and business rule validation for every field.' },
              { icon: Layers, title: 'Category Intelligence', desc: 'Category-specific rules, allowed values and attribute ordering.' },
              { icon: FileSearch, title: 'Evidence & Traceability', desc: 'Every value has source evidence, confidence and provenance.' },
              { icon: Users, title: 'Human Review', desc: 'Low-confidence records escalated for expert review.' },
              { icon: Bot, title: 'Agent Orchestration', desc: '8 specialized AI agents working in pipeline.' },
              { icon: Zap, title: 'Commerce Activation', desc: 'Export structured, validated product records to any channel.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 hover:border-electric-500/20 transition-colors">
                <Icon className="w-6 h-6 text-electric-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-nexora-400">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25">
              Try the Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
