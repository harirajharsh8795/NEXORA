import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Droplets, Zap, Flame, Wind, Lightbulb, Drill, Cpu, Stethoscope, Package } from 'lucide-react';

const industries = [
  { name: 'Fittings', slug: 'fittings', icon: Wrench, desc: 'Pipe fittings, couplings, elbows, tees and industrial connections.', count: 89 },
  { name: 'Faucets', slug: 'faucets', icon: Droplets, desc: 'Kitchen, bathroom, utility and commercial faucets and fixtures.', count: 34 },
  { name: 'Electrical', slug: 'electrical', icon: Zap, desc: 'Electrical components, wiring, tapes, connectors and panels.', count: 67 },
  { name: 'Appliances', slug: 'appliances', icon: Flame, desc: 'Dishwashers, ovens, refrigerators and major household appliances.', count: 42 },
  { name: 'HVAC', slug: 'hvac', icon: Wind, desc: 'Heating, ventilation and air conditioning systems and components.', count: 23 },
  { name: 'Lighting', slug: 'lighting', icon: Lightbulb, desc: 'LED, fluorescent, incandescent bulbs and lighting fixtures.', count: 111 },
  { name: 'Power Tools', slug: 'power-tools', icon: Drill, desc: 'Drills, saws, grinders, sanders and power tool accessories.', count: 78 },
  { name: 'Abrasives', slug: 'abrasives', icon: Package, desc: 'Sanding discs, belts, cut-off wheels, grinding wheels.', count: 156 },
  { name: 'Electronics', slug: 'electronics', icon: Cpu, desc: 'Electronic components, circuits and control systems.', count: 15 },
  { name: 'Medical', slug: 'medical', icon: Stethoscope, desc: 'Medical devices, instruments and healthcare equipment.', count: 8 },
];

export default function Industries() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Industries</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Product intelligence for every industry.</h1>
            <p className="mt-4 text-lg text-nexora-300">Category-specific rules, validation and enrichment for industrial product data.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(({ name, slug, icon: Icon, desc, count }, i) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link to={`/industries/${slug}`} className="glass-card p-6 block h-full hover:border-electric-500/20 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-electric-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-electric-400 transition-colors">{name}</h3>
                  </div>
                  <p className="text-sm text-nexora-400 mb-3">{desc}</p>
                  <span className="text-xs text-nexora-500 font-mono">{count} products</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
