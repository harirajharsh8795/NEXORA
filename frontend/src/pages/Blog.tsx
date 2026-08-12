import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/mockData';
import { Clock } from 'lucide-react';

export default function Blog() {
  const featured = blogPosts.find(p => p.featured);
  const rest = blogPosts.filter(p => !p.featured);

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Insights & Research</h1>
          </motion.div>

          {/* Featured */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Link to={`/blog/${featured.slug}`} className="block glass-card p-6 sm:p-8 mb-8 group hover:border-electric-500/20 transition-colors">
                <span className="text-xs text-electric-400 font-medium uppercase tracking-widest">Featured</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 group-hover:text-electric-400 transition-colors">{featured.title}</h2>
                <p className="text-nexora-400 mt-3 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-nexora-500">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.publishedAt}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Link to={`/blog/${post.slug}`} className="glass-card p-5 block h-full group hover:border-electric-500/20 transition-colors">
                  <span className="text-xs text-electric-400/70 font-medium">{post.category}</span>
                  <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-electric-400 transition-colors">{post.title}</h3>
                  <p className="text-sm text-nexora-400 mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-nexora-500">
                    <span>{post.publishedAt}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
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
