import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { caseStudies } from '../data/mockData';

export default function CaseStudies() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Case Studies</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Demo Scenarios</h1>
            <p className="mt-4 text-nexora-400">Illustrative examples showing how NEXORA could transform industrial product data.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {caseStudies.map((cs, i) => (
              <motion.div key={cs.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/case-studies/${cs.slug}`} className="glass-card p-6 block h-full group hover:border-electric-500/20 transition-colors">
                  {cs.isDemo && <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded mb-3 inline-block">Demo Scenario</span>}
                  <h3 className="text-xl font-semibold text-white group-hover:text-electric-400 transition-colors">{cs.title}</h3>
                  <p className="text-sm text-nexora-400 mt-2">{cs.excerpt}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="text-center p-2 rounded-lg bg-nexora-900/50">
                      <div className="text-lg font-bold text-white">{cs.metrics.skusProcessed.toLocaleString()}</div>
                      <div className="text-xs text-nexora-500">SKUs</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-nexora-900/50">
                      <div className="text-lg font-bold text-emerald-400">{cs.metrics.qualityAfter}%</div>
                      <div className="text-xs text-nexora-500">Quality After</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
