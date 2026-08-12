import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { caseStudies } from '../data/mockData';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const cs = caseStudies.find(c => c.slug === slug);
  if (!cs) return <div className="pt-20 min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-white mb-2">Not found</h1><Link to="/case-studies" className="text-electric-400 text-sm">← Back</Link></div></div>;

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-nexora-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {cs.isDemo && <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded mb-3 inline-block">Demo Scenario — Illustrative only</span>}
            <h1 className="text-3xl font-bold text-white">{cs.title}</h1>
            <p className="text-nexora-400 mt-3">{cs.excerpt}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'SKUs', value: cs.metrics.skusProcessed.toLocaleString() },
                { label: 'Quality Before', value: `${cs.metrics.qualityBefore}%` },
                { label: 'Quality After', value: `${cs.metrics.qualityAfter}%` },
                { label: 'Time Saved', value: cs.metrics.timeSaved },
              ].map(m => (
                <div key={m.label} className="glass-card p-4 text-center">
                  <div className="text-xl font-bold text-white">{m.value}</div>
                  <div className="text-xs text-nexora-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
