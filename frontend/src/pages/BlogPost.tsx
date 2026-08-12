import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { blogPosts } from '../data/mockData';

const blogContent: Record<string, string> = {
  'what-is-product-data-intelligence': `Product Data Intelligence is the practice of using AI, rules engines and evidence-based validation to transform raw, incomplete product information into structured, standardized and commerce-ready product records.\n\nIn industrial B2B commerce, product data arrives from hundreds of manufacturers in wildly inconsistent formats. Part numbers use cryptic abbreviations. Descriptions mix units, materials and specifications without structure. Brands are often missing or marked as "unbranded."\n\nProduct Data Intelligence solves this by applying a pipeline of specialized AI agents — each responsible for understanding, resolving, classifying, extracting, enriching, validating and generating product content.\n\nThe result is a complete, verified product record that can power e-commerce search, filtering, comparison and AI agent discovery.`,
  'lov-constrained-ai-generation': `Large Language Models can generate fluent, grammatically correct text. But fluency is not accuracy. When an AI model generates "Metal" as a material for a brass coupling, it's technically not wrong — but it's not useful for commerce.\n\nLOV-Constrained AI Generation ensures that every generated attribute value is drawn from a pre-approved List of Values (LOV) for that product category. If the allowed materials for fittings are [Brass, Bronze, Stainless Steel, Copper, PVC, Cast Iron], the AI must output one of these — not a synonym, abbreviation or generic term.\n\nThis approach combines the creative power of LLMs with the precision of deterministic validation, producing outputs that are both AI-generated and rule-verified.`,
  'entity-resolution-industrial-products': `In industrial product data, the same concept is represented in dozens of ways. A coupling might appear as CPLG, COUP, COUPLING, Brass CPLG, or BR COUP. A manufacturer might be listed as "3 M Co (5293)" in one system and "3M Company" in another.\n\nEntity Resolution is the process of mapping these variations to canonical, standardized values. NEXORA uses a combination of abbreviation maps, manufacturer master lists, and AI-powered fuzzy matching to resolve entities across the catalog.\n\nThe result is a single source of truth where every product has a canonical manufacturer name, resolved brand, and standardized product type.`,
  'rag-product-enrichment': `RAG (Retrieval-Augmented Generation) is a technique that grounds AI generation in retrieved evidence from trusted sources. Instead of relying solely on an LLM's training data, RAG retrieves relevant manufacturer documentation, specification sheets and product catalogs before generating attribute values.\n\nIn NEXORA, the enrichment pipeline retrieves manufacturer documents, extracts relevant specifications, and uses the retrieved evidence to generate and validate product attributes. Every enriched value includes its source document, evidence snippet and confidence score.\n\nCritically, retrieval and validation are independent operations. The validation engine checks generated values against LOV constraints and UOM standards regardless of how they were generated.`,
  'ai-commerce-machine-readable-products': `AI shopping agents don't browse product pages — they query structured data. When a buyer asks an AI agent to "find a 3/8 inch brass coupling rated for 150 psi," the agent needs to reason over structured attributes: Material = Brass, Size = 3/8 in, Fitting Type = Coupling, Pressure Rating = 150 psi.\n\nIf product data is unstructured or inconsistent, AI agents can't find, compare or recommend products. Product Data Intelligence transforms catalog data into the machine-readable format that AI commerce requires.\n\nNEXORA prepares product data for both human browsing and AI agent discovery, ensuring products are discoverable regardless of how they're searched.`,
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
          <Link to="/blog" className="text-electric-400 hover:underline text-sm">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const content = blogContent[slug || ''] || 'Full article content coming soon.';

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-nexora-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs text-electric-400 font-medium">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-nexora-500">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.publishedAt}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
            </div>

            <div className="mt-10 prose prose-invert max-w-none">
              {content.split('\n\n').map((p, i) => (
                <p key={i} className="text-nexora-300 leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </motion.article>
        </div>
      </section>
    </div>
  );
}
