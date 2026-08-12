import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Demo() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Thank you!</h1>
          <p className="text-nexora-400">We'll be in touch shortly to schedule your demo.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Request Demo</p>
            <h1 className="text-4xl font-bold text-white">See NEXORA in action.</h1>
            <p className="mt-3 text-nexora-300">Schedule a personalized walkthrough of NEXORA's product intelligence capabilities.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-1.5">Name *</label>
                <input required type="text" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none" placeholder="John Smith" />
              </div>
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-1.5">Company *</label>
                <input required type="text" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none" placeholder="Acme Industrial" />
              </div>
            </div>
            <div>
              <label className="text-xs text-nexora-400 font-medium block mb-1.5">Email *</label>
              <input required type="email" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none" placeholder="john@acme.com" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-1.5">Catalog Size</label>
                <select className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Under 1,000 SKUs</option>
                  <option>1,000 - 10,000 SKUs</option>
                  <option>10,000 - 100,000 SKUs</option>
                  <option>100,000+ SKUs</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-nexora-400 font-medium block mb-1.5">Industry</label>
                <select className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none">
                  <option value="">Select...</option>
                  <option>Industrial Distribution</option>
                  <option>Plumbing & HVAC</option>
                  <option>Electrical</option>
                  <option>Construction</option>
                  <option>Manufacturing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-nexora-400 font-medium block mb-1.5">Primary Challenge</label>
              <select className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none">
                <option value="">Select...</option>
                <option>Product data enrichment</option>
                <option>Data quality improvement</option>
                <option>Catalog standardization</option>
                <option>AI-ready product data</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-nexora-400 font-medium block mb-1.5">Message</label>
              <textarea rows={3} className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-electric-500 focus:outline-none resize-none" placeholder="Tell us about your use case..." />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all">
              <Send className="w-4 h-4" /> Request Demo
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
