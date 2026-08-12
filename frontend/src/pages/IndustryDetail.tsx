import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { categories } from '../data/mockData';

export default function IndustryDetail() {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Industry not found</h1>
          <Link to="/industries" className="text-electric-400 hover:underline text-sm">← Back to Industries</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/industries" className="inline-flex items-center gap-2 text-sm text-nexora-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Industries
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-nexora-400 font-mono text-sm mb-8">{category.classpath}</p>
          </motion.div>

          {/* Category Attributes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Category Attributes</h2>
            <div className="space-y-4">
              {category.attributes.map((attr) => (
                <div key={attr.label} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">{attr.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${attr.required ? 'bg-amber-500/10 text-amber-400' : 'bg-nexora-700 text-nexora-400'}`}>
                      {attr.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  {attr.allowedValues.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {attr.allowedValues.map(v => (
                        <span key={v} className="text-xs bg-nexora-800 text-nexora-300 px-2 py-1 rounded-md font-mono">{v}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-nexora-500 italic mt-1">Free-form value (no LOV constraint)</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Demo: Normalization for Fittings */}
          {slug === 'fittings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12">
              <h2 className="text-xl font-semibold text-white mb-4">Normalization Demo</h2>
              <p className="text-sm text-nexora-400 mb-6">NEXORA normalizes many raw variations into a single canonical value:</p>
              <div className="glass-card p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm text-nexora-500 font-medium mb-3">Raw Input Variations</h3>
                    <div className="space-y-2">
                      {['CPLG', 'COUP', 'COUPLING', 'BRASS CPLG', 'BR COUP'].map(v => (
                        <div key={v} className="font-mono text-sm text-amber-400 bg-nexora-900 px-3 py-2 rounded">{v}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-nexora-500 font-medium mb-3">NEXORA Output</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-nexora-900/50 rounded-lg">
                        <span className="text-xs text-nexora-400">Fitting Type</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">Coupling</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-nexora-900/50 rounded-lg">
                        <span className="text-xs text-nexora-400">Material</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">Brass</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Many-to-one normalization complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25"
            >
              Try NEXORA with {category.name}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
