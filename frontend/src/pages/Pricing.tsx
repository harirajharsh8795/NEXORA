import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Prototype',
    price: 'Free',
    period: '',
    desc: 'Try NEXORA with the demo environment.',
    features: ['Up to 100 SKUs', 'Basic enrichment', 'Quality scoring', 'CSV export', 'Demo data access'],
    cta: 'Get Started Free',
    href: '/dashboard',
    featured: false,
  },
  {
    name: 'Team',
    price: 'Coming Soon',
    period: '',
    desc: 'For teams processing real product catalogs.',
    features: ['Up to 10,000 SKUs', 'Full enrichment pipeline', 'Human review queue', 'API access', 'Multiple exports', 'Priority support'],
    cta: 'Join Waitlist',
    href: '/demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations with large-scale catalogs.',
    features: ['Unlimited SKUs', 'Custom validation rules', 'Custom LOV management', 'Dedicated support', 'SLA guarantees', 'On-premise option', 'SSO & RBAC'],
    cta: 'Contact Sales',
    href: '/demo',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Simple, transparent pricing.</h1>
            <p className="mt-4 text-lg text-nexora-300">Start free. Scale as your catalog grows.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -4 }}
                className={`glass-card p-6 sm:p-8 flex flex-col ${
                  plan.featured ? 'border-electric-500/30 ring-1 ring-electric-500/20' : ''
                }`}
              >
                {plan.featured && (
                  <span className="text-xs text-electric-400 font-medium uppercase tracking-widest mb-4">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-nexora-400 text-sm ml-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-nexora-400 mb-6">{plan.desc}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-nexora-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={`w-full text-center py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.featured
                      ? 'bg-gradient-to-r from-electric-500 to-violet-500 text-white shadow-lg shadow-electric-500/20'
                      : 'border border-nexora-600 text-nexora-200 hover:text-white hover:border-nexora-400'
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
