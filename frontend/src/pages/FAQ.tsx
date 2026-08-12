import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is NEXORA?', a: 'NEXORA is an AI-powered product intelligence platform that transforms incomplete industrial product data into verified, structured and commerce-ready product records. It combines AI generation with deterministic validation and evidence traceability.' },
  { q: 'How does product enrichment work?', a: 'NEXORA uses a pipeline of specialized AI agents to extract, resolve, classify, enrich and validate product attributes. It retrieves missing information from manufacturer documentation using RAG (Retrieval-Augmented Generation) and validates every generated value against controlled vocabularies.' },
  { q: 'How does NEXORA prevent hallucinations?', a: 'NEXORA uses LOV (List of Values) constraints to ensure AI-generated attribute values are factually correct. Every generated value is validated against category-specific rules, UOM standards and controlled vocabularies. Low-confidence outputs are flagged for human review instead of being auto-approved.' },
  { q: 'What is LOV validation?', a: 'LOV (List of Values) validation ensures that attribute values match pre-defined allowed values for each product category. For example, if a fitting\'s material is restricted to [Brass, Bronze, Stainless Steel, Copper, PVC], the AI cannot output "Metal" — it must use one of the allowed values.' },
  { q: 'How does source evidence work?', a: 'Every enriched attribute has a provenance trail: the source document or URL where the information was found, the evidence snippet, the extraction agent, the normalization rule applied, and the validation result. This creates full traceability from raw input to final value.' },
  { q: 'Can NEXORA process PDFs?', a: 'Yes. NEXORA can ingest product data from Excel, CSV, PDF, images, technical documents, manufacturer websites and product descriptions. The Data Ingestion pipeline extracts structured information from unstructured sources.' },
  { q: 'Can it process Excel files?', a: 'Yes. Excel (XLSX) and CSV are primary input formats. NEXORA can process thousands of SKUs from a single spreadsheet, extracting product information from description fields and part numbers.' },
  { q: 'Can it use product images?', a: 'NEXORA supports product image ingestion as supplementary evidence. While the primary extraction pipeline focuses on text-based product data, images can provide additional validation context.' },
  { q: 'How does human review work?', a: 'When NEXORA encounters low-confidence values (typically below 85%), ambiguous mappings, or conflicting sources, it flags the record for human review. Reviewers see the current value, suggested alternatives, evidence and confidence scores, and can approve, reject or edit each field.' },
  { q: 'Can it scale to 1000+ products?', a: 'NEXORA is designed for industrial-scale catalogs. The demo environment processes the UniHack 1,000-item dataset, and the architecture supports batch processing of tens of thousands of SKUs.' },
  { q: 'How does NEXORA integrate with existing systems?', a: 'NEXORA provides REST API endpoints, webhook notifications, and export capabilities (CSV, Excel, JSON). It can integrate with PIM (Product Information Management), ERP, and e-commerce platforms to deliver commerce-ready product data.' },
  { q: 'What industries does NEXORA support?', a: 'NEXORA is built for industrial B2B commerce, supporting categories including Abrasives, Appliances, Electrical, Fittings, Faucets, HVAC, Lighting, Plumbing, Power Tools and more. Each category has specific validation rules and allowed values.' },
  { q: 'What makes NEXORA different from generic AI tools?', a: 'Unlike generic AI, NEXORA applies deterministic validation rules, controlled vocabulary constraints, UOM standardization, entity resolution and evidence-backed enrichment. It doesn\'t just generate fluent text — it generates factually correct, validated product data.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <p className="text-sm text-electric-400 font-medium uppercase tracking-widest mb-4">FAQ</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Frequently Asked Questions</h1>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-nexora-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-nexora-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
