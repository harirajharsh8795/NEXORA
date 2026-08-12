import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb, Shield, Brain, Layers, Sparkles, Users } from 'lucide-react';

const principles = [
  { icon: Brain, title: 'Intelligence First', desc: 'Every product record is understood, not just stored.' },
  { icon: Shield, title: 'Validation Always', desc: 'AI outputs are verified against deterministic rules and controlled vocabularies.' },
  { icon: Lightbulb, title: 'Evidence Everything', desc: 'Every generated value has traceable source evidence and confidence scores.' },
  { icon: Users, title: 'Human in the Loop', desc: 'Low-confidence records are escalated for human review instead of hallucinated.' },
  { icon: Layers, title: 'Category Aware', desc: 'Different product categories have different rules, attributes and validation logic.' },
  { icon: Sparkles, title: 'Commerce Ready', desc: 'Output is structured, normalized and ready for any commerce platform or AI agent.' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">About NEXORA</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Building the intelligence layer for industrial product data.
            </h1>
            <p className="mt-6 text-lg text-nexora-300 max-w-2xl mx-auto">
              NEXORA was created to solve one of the most persistent problems in industrial commerce: 
              product data is fragmented, incomplete and inconsistent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-nexora-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-electric-400" />
                <h2 className="text-2xl font-bold text-white">Mission</h2>
              </div>
              <p className="text-nexora-300 leading-relaxed">
                Transform fragmented industrial product data into verified, structured 
                and commerce-ready product intelligence — with full evidence traceability 
                and human oversight.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-violet-400" />
                <h2 className="text-2xl font-bold text-white">Vision</h2>
              </div>
              <p className="text-nexora-300 leading-relaxed">
                A world where every industrial product is discoverable, comparable and 
                purchasable — by humans and AI agents alike — through structured, 
                validated product intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Core Principles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className="glass-card p-6 hover:border-white/[0.12] transition-colors"
              >
                <Icon className="w-8 h-8 text-electric-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-nexora-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-padding bg-nexora-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Technology</h2>
          <p className="text-nexora-300 leading-relaxed mb-8">
            NEXORA combines large language models with deterministic validation engines, 
            retrieval-augmented generation (RAG), entity resolution, and controlled vocabulary 
            enforcement to produce product intelligence that is both AI-generated and rule-verified.
          </p>
          <p className="text-sm text-nexora-500 italic">
            AI generates. Deterministic logic validates. Evidence explains. Humans resolve uncertainty.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to transform your product data?</h2>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all"
          >
            Request a Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
