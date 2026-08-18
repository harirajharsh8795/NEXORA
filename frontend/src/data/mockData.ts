import catalogData from './catalogData.json';
import type {
  EnrichedProduct,
  PipelineStage,
  FAQItem,
  PricingTier,
  Testimonial,
  TaxonomyCategory
} from '../types';

export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, name: 'Entity Resolution', icon: '⚡', description: 'Resolves vendor names, brand variations & trade names against canonical master databases.', status: 'completed' },
  { id: 2, name: 'Taxonomy Classification', icon: '🗂️', description: 'Hierarchical 4-tier taxonomy mapping (Dept > Class > Fine Line > Classpath).', status: 'completed' },
  { id: 3, name: 'Attribute Extraction', icon: '🔍', description: 'Extracts structured (Label, Value, UOM) triplets from raw specs with regex engines.', status: 'completed' },
  { id: 4, name: 'Content Generation', icon: '✍️', description: 'Synthesizes 6 distinct channel-specific descriptions (Mobile, Invoice, Retail, etc).', status: 'completed' },
  { id: 5, name: 'Manufacturer Enrichment', icon: '🌐', description: 'Discovers verified manufacturer URLs, spec sheet PDFs, and image assets.', status: 'completed' },
  { id: 6, name: 'LOV & UOM Validation', icon: '🛡️', description: 'Validates every value against List of Values (LOV) & standardizes UOMs.', status: 'completed' },
  { id: 7, name: 'Confidence & Review', icon: '⚖️', description: 'Calculates weighted confidence score. Flags score < 85% for human review.', status: 'completed' },
  { id: 8, name: 'Commerce Delivery', icon: '🚀', description: 'Exports schema-compliant 252-column master catalog ready for PIM & AI agents.', status: 'completed' }
];

export const MOCK_TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  { department: 'Appliances & Consumer Electronics', categoryClass: 'Kitchen Appliances', fineLine: 'Built-In Dishwashers', classpath: 'Appliances & Consumer Electronics > Kitchen Appliances > Built-In Dishwashers', skuCount: 142 },
  { department: 'Tools & Hardware', categoryClass: 'Abrasives', fineLine: 'Sanding Belts & Sheets', classpath: 'Tools & Hardware > Abrasives > Coated Abrasives > Sanding Belts & Sheets', skuCount: 198 },
  { department: 'Tools & Hardware', categoryClass: 'Abrasives', fineLine: 'Cut-Off Wheels & Discs', classpath: 'Tools & Hardware > Abrasives > Bonded Abrasives > Cut-Off Wheels', skuCount: 165 },
  { department: 'Tools & Hardware', categoryClass: 'Power Tool Accessories', fineLine: 'Saw Blades', classpath: 'Tools & Hardware > Power Tool Accessories > Saw Blades', skuCount: 220 },
  { department: 'Building Materials', categoryClass: 'Lumber & Decking', fineLine: 'Composite Deck Boards', classpath: 'Building Materials > Decking > Composite Decking Boards', skuCount: 110 },
  { department: 'Electrical & Lighting', categoryClass: 'Lighting', fineLine: 'LED Light Bulbs', classpath: 'Electrical & Lighting > Lighting > Light Bulbs > LED Light Bulbs', skuCount: 115 },
  { department: 'Tools & Hardware', categoryClass: 'Woodworking Machinery', fineLine: 'Stationary Machinery', classpath: 'Tools & Hardware > Woodworking Machinery > Stationary Machinery', skuCount: 50 }
];

export const MOCK_PRODUCTS: EnrichedProduct[] = catalogData as unknown as EnrichedProduct[];


export const MOCK_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Prototype / Evaluation',
    tag: 'Free Trial',
    features: [
      'Up to 1,000 SKUs batch processing',
      '8-Agent Multi-Agent Orchestration',
      'Entity Resolution & Canonical Matching',
      'Standard 4-tier Taxonomy Classification',
      'Regex & LLM Attribute Triplet Extraction',
      'Evidence Graph & Provenance Audit Trail',
      'Interactive Web Dashboard with Review Queue',
      'CSV & JSON catalog export formats'
    ],
    cta: 'Start Free Evaluation'
  },
  {
    name: 'Team / Growth',
    tag: 'Popular',
    highlighted: true,
    features: [
      'Up to 50,000 SKUs per month',
      'Everything in Prototype, plus:',
      'Custom LOV & UOM dictionary ingestion',
      'Multi-source manufacturer PDF spec scraping',
      'Automated Confidence scoring & human review routing',
      'REST API access with webhook callbacks',
      'Dedicated category rules engine tuning',
      'Priority email and Slack support',
      '99.5% uptime SLA'
    ],
    cta: 'Request Growth Access'
  },
  {
    name: 'Enterprise / Custom',
    tag: 'Custom Scale',
    features: [
      'Unlimited SKUs & real-time streaming ingestion',
      'Everything in Team, plus:',
      'Private VPC or on-prem air-gapped deployment',
      'Direct PIM / ERP bi-directional sync (Akeneo, Salsify, SAP)',
      'Custom LLM fine-tuning on proprietary master catalogs',
      'SOC 2 Type II compliance & role-based access control',
      'Custom 250+ column export format mapping',
      '24/7 dedicated solutions architect & enterprise SLA'
    ],
    cta: 'Contact Enterprise Solutions'
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    question: 'How is Nexora different from a traditional PIM (Product Information Management) system?',
    answer: 'Traditional PIMs are static repositories where catalog managers must manually key in attributes, write descriptions, and cross-reference spreadsheets. Nexora is a multi-agent intelligence layer that sits upstream: our pipeline takes messy, incomplete supplier data, enriches and standardizes it with full evidence provenance, and pushes clean, schema-aligned data directly into your PIM or ERP.'
  },
  {
    question: 'How does NEXORA reduce unsupported product attributes?',
    answer: 'NEXORA combines source-grounded retrieval, deterministic LOV/UOM validation, confidence scoring, and human-review routing. Unsupported or conflicting values can be rejected or sent to HITL review.'
  },
  {
    question: 'What happens when a product falls below the 85% confidence threshold?',
    answer: 'Any product with a composite confidence score under 85% is automatically flagged and routed to the Human-in-the-Loop (HITL) Review Queue. The reviewer is shown the exact flagged reasons, raw inputs, proposed values, and side-by-side evidence snippets to approve or edit with one click.'
  },
  {
    question: 'Can Nexora handle large catalogs with thousands of SKUs?',
    answer: 'Yes. Our deterministic in-memory processing layer sustained 3,278 SKUs/sec on the benchmark environment (0.305s total for 1,000 SKUs). Live web search and LLM enrichment are separately latency-bound per unseen SKU.'
  },
  {
    question: 'What input data formats and sources are supported?',
    answer: 'Nexora ingests CSV, Excel (.xlsx), raw JSON payloads, vendor spec PDFs, and live REST API feeds. The pipeline automatically normalizes field name variations across suppliers.'
  }
];


export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Nexora cut our catalog onboarding time from 3 weeks to under 2 hours. The evidence graph gives our enterprise retail partners total confidence in the data accuracy.',
    name: 'Marcus Vance',
    title: 'VP of eCommerce & Catalog Operations',
    company: 'Industrial Supply Direct'
  },
  {
    quote: 'The automated attribute triplet extraction and LOV validation resolved over 15,000 legacy compliance errors without our merchandising team having to touch a spreadsheet.',
    name: 'Elena Rostova',
    title: 'Director of Product Data Governance',
    company: 'Apex Building Products'
  },
  {
    quote: 'Being able to audit the AI reasoning step-by-step with source PDF citations makes Nexora the only enterprise-ready product enrichment solution on the market.',
    name: 'Devin Kulkarni',
    title: 'Chief Technology Officer',
    company: 'Global Retail Commerce Network'
  }
];
