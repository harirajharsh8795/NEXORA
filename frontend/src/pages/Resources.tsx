import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FileText, HelpCircle, GraduationCap, Book } from 'lucide-react';

const sections = [
  { icon: BookOpen, title: 'Blog', desc: 'Latest insights on product data intelligence.', href: '/blog' },
  { icon: FileText, title: 'Case Studies', desc: 'Demo scenarios showing NEXORA in action.', href: '/case-studies' },
  { icon: HelpCircle, title: 'FAQ', desc: 'Common questions about NEXORA.', href: '/faq' },
  { icon: GraduationCap, title: 'Guides', desc: 'Step-by-step guides for product data enrichment.', href: '/resources' },
  { icon: Book, title: 'Glossary', desc: 'Key terms in product data intelligence.', href: '/resources' },
];

export default function Resources() {
  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Resources</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Learn & Explore</h1>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sections.map(({ icon: Icon, title, desc, href }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={href} className="glass-card p-6 block h-full group hover:border-electric-500/20 transition-colors">
                  <Icon className="w-8 h-8 text-electric-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white group-hover:text-electric-400 transition-colors">{title}</h3>
                  <p className="text-sm text-nexora-400 mt-1">{desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
