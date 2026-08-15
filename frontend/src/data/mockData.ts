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

export const MOCK_PRODUCTS: EnrichedProduct[] = [
  {
    mfg_part_num: 'PDSH4816AF',
    part_desc: '24" Stainless Steel Built-In Top Control Dishwasher with OrbitClean Wash System, 14 Place Settings',
    raw_manuf: 'Frigidaire Gallery',
    raw_brand: 'Frigidaire',
    manufacturer_name: 'Frigidaire (Electrolux Home Products)',
    brand_name: 'Frigidaire Gallery',
    trade_name: 'OrbitClean® Series',
    manufacturer_part_number: 'PDSH4816AF',
    alternate_part_number: 'FGID2476SF',
    department: 'Appliances',
    category_class: 'Large Appliances',
    fine_line: 'Dishwashers',
    classpath: 'Appliances & Consumer Electronics > Kitchen Appliances > Built-In Dishwashers',
    mobile_desc: '• 24" Built-In Dishwasher in Stainless Steel\n• OrbitClean® wash system with 4x coverage\n• 14 Place Settings with NSF Sanitize cycle\n• Quiet 49 dBA sound level with LED beam',
    invoice_desc: 'FRIGIDAIRE GALLERY 24IN BUILT-IN DISHWASHER SS 49DBA',
    short_desc: 'Frigidaire Gallery 24" Built-In Top Control Stainless Steel Dishwasher.',
    long_desc1: 'The Frigidaire Gallery 24" Built-In Dishwasher features the OrbitClean® Wash System for thorough cleaning with 4x better water coverage and 49 dBA whisper-quiet sound level.',
    retail_desc: 'Elevate your kitchen cleanup with the Frigidaire Gallery 24-inch Built-In Dishwasher.',
    marketing_description: 'Engineered for exceptional performance and spot-free dishwashing with advanced sensors.',
    product_name: 'Frigidaire Gallery 24" Built-In Dishwasher',
    upc: '012505564291',
    gtin: '00012505564291',
    unspsc: '52141505',
    list_price: '$899.00',
    selling_qty: '1',
    selling_uom: 'EA',
    length: '24.25',
    length_uom: 'in',
    width: '24.00',
    width_uom: 'in',
    height: '35.00',
    height_uom: 'in',
    weight: '82.00',
    weight_uom: 'lbs',
    mfr_url: 'https://www.frigidaire.com/en/p/owner-center/product-support/PDSH4816AF',
    ref_urls: ['https://www.frigidaire.com/en/p/kitchen/dishwashers/PDSH4816AF'],
    product_image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80',
    alternate_images: [],
    specification_sheet: 'FRIGIDAIRE_PDSH4816AF_Specification_Sheet.pdf',
    instruction_manual: 'FRIGIDAIRE_PDSH4816AF_Installation_Guide.pdf',
    actual_image_yes_no: 'Yes',
    item_features: [
      'OrbitClean® Wash System delivers 4 times more water coverage',
      'DishSense™ Technology automatically optimizes cycle duration',
      'NSF® Certified Sanitize cycle eliminates 99.9% of bacteria',
      'Smudge-Proof® Stainless Steel resists fingerprints'
    ],
    attributes: [
      { index: 1, label: 'Product Type', value: 'Built-In Dishwasher', uom: '', confidence: 0.98, is_lov_valid: true, is_uom_standardized: true },
      { index: 2, label: 'Tub Material', value: 'Stainless Steel', uom: '', confidence: 0.99, is_lov_valid: true, is_uom_standardized: true },
      { index: 3, label: 'Place Settings', value: '14', uom: 'settings', confidence: 0.96, is_lov_valid: true, is_uom_standardized: true },
      { index: 4, label: 'Sound Level', value: '49', uom: 'dBA', confidence: 0.95, is_lov_valid: true, is_uom_standardized: true },
      { index: 5, label: 'Nominal Width', value: '24', uom: 'in', confidence: 0.99, is_lov_valid: true, is_uom_standardized: true }
    ],
    confidence: {
      manufacturer_confidence: 0.99,
      brand_confidence: 0.98,
      classpath_confidence: 0.98,
      attribute_confidence: 0.96,
      overall_confidence: 0.9775,
      needs_human_review: false,
      flagged_reasons: []
    },
    evidence_graph: {
      product_mpn: 'PDSH4816AF',
      evidences: {
        'Manufacturer': {
          field_name: 'Manufacturer Name',
          value: 'Frigidaire (Electrolux Home Products)',
          confidence: 0.99,
          source_type: 'lov_match',
          source_url: 'https://www.frigidaire.com',
          snippet: 'Canonical manufacturer match against manufacturer_master.json (Electrolux ID: 2435)',
          validated_by_lov: true,
          validated_by_uom: true
        },
        'Sound Level': {
          field_name: 'Sound Level (49 dBA)',
          value: '49 dBA',
          confidence: 0.95,
          source_type: 'document',
          source_url: 'FRIGIDAIRE_PDSH4816AF_Specification_Sheet.pdf',
          snippet: 'Acoustic rating certified at 49 dBA operating level under AHAM DW-1',
          validated_by_lov: true,
          validated_by_uom: true
        }
      }
    }
  },
  {
    mfg_part_num: 'D0724A',
    part_desc: 'Diablo 7-1/4 in. x 24-Tooth Tracking Point Framing Circular Saw Blade with 5/8 in. Arbor',
    raw_manuf: 'Freud Inc',
    raw_brand: 'Diablo',
    manufacturer_name: 'Freud Inc',
    brand_name: 'Diablo',
    trade_name: 'Tracking Point™',
    manufacturer_part_number: 'D0724A',
    department: 'Tools & Hardware',
    category_class: 'Power Tool Accessories',
    fine_line: 'Saw Blades',
    classpath: 'Tools & Hardware > Power Tool Accessories > Saw Blades',
    mobile_desc: '• 7-1/4" Framing circular saw blade with 24 teeth\n• TiCo™ Hi-Density carbide teeth\n• Perma-SHIELD® non-stick coating',
    invoice_desc: 'DIABLO 7-1/4IN 24T FRAMING CIRC SAW BLADE',
    short_desc: 'Diablo 7-1/4" 24-Tooth Carbide Framing Circular Saw Blade.',
    long_desc1: 'Diablo 7-1/4 in. x 24-Tooth Tracking Point Framing Blade delivers up to 5X longer life in framing applications.',
    retail_desc: 'Make rapid framing cuts with Diablo 7-1/4-inch 24-Tooth Carbide blade.',
    marketing_description: 'Designed for framing and construction jobs with laser-cut stabilizer vents.',
    product_name: 'Diablo 7-1/4" 24T Framing Saw Blade',
    upc: '008925134109',
    unspsc: '27112802',
    list_price: '$12.97',
    selling_qty: '1',
    selling_uom: 'EA',
    length: '7.25',
    length_uom: 'in',
    width: '7.25',
    width_uom: 'in',
    weight: '0.65',
    weight_uom: 'lbs',
    mfr_url: 'https://www.diablotools.com/products/D0724A',
    ref_urls: [],
    product_image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    alternate_images: [],
    specification_sheet: 'Diablo_D0724A_Spec_Sheet.pdf',
    actual_image_yes_no: 'Yes',
    item_features: [
      'Tracking Point™ tooth design for straight tracking',
      'TiCo™ Hi-Density Carbide engineered for framing',
      'Perma-SHIELD® Non-Stick Coating resists heat'
    ],
    attributes: [
      { index: 1, label: 'Product Type', value: 'Saw Blade', uom: '', confidence: 0.99, is_lov_valid: true, is_uom_standardized: true },
      { index: 2, label: 'Diameter', value: '7.25', uom: 'in', confidence: 0.98, is_lov_valid: true, is_uom_standardized: true },
      { index: 3, label: 'Number of Teeth', value: '24', uom: '', confidence: 0.99, is_lov_valid: true, is_uom_standardized: true }
    ],
    confidence: {
      manufacturer_confidence: 0.99,
      brand_confidence: 0.99,
      classpath_confidence: 0.98,
      attribute_confidence: 0.97,
      overall_confidence: 0.9825,
      needs_human_review: false,
      flagged_reasons: []
    },
    evidence_graph: {
      product_mpn: 'D0724A',
      evidences: {
        'Manufacturer': {
          field_name: 'Manufacturer Resolution',
          value: 'Freud Inc (Diablo Tools)',
          confidence: 0.99,
          source_type: 'lov_match',
          source_url: 'https://www.diablotools.com',
          snippet: 'Matched brand "Diablo" to parent corporation Freud Inc (Code 2435)',
          validated_by_lov: true,
          validated_by_uom: true
        }
      }
    }
  },
  {
    mfg_part_num: 'SKU-FLAGGED-018',
    part_desc: 'Generic 1/2 in. brass replacement valve fitting with unknown thread spec',
    raw_manuf: 'Acme Hardware Dist',
    raw_brand: 'Unbranded',
    manufacturer_name: 'Acme Hardware Distributors',
    brand_name: 'Unbranded',
    manufacturer_part_number: 'SKU-FLAGGED-018',
    department: 'Tools & Hardware',
    category_class: 'General Hardware',
    fine_line: 'Industrial Hardware',
    classpath: 'Tools & Hardware > General Hardware > Industrial Supplies',
    mobile_desc: '• 1/2" Brass replacement valve fitting',
    invoice_desc: 'ACME BRASS VALVE FITTING 1/2IN REPL',
    short_desc: 'Brass replacement valve fitting 1/2".',
    long_desc1: 'General industrial brass replacement valve fitting for maintenance applications.',
    retail_desc: 'Brass replacement valve fitting 1/2 in.',
    marketing_description: 'Quality replacement plumbing component.',
    product_name: 'Brass Replacement Valve Fitting 1/2"',
    attributes: [
      { index: 1, label: 'Product Type', value: 'Hardware Item', uom: '', confidence: 0.70, is_lov_valid: false, is_uom_standardized: true },
      { index: 2, label: 'Diameter', value: '0.5', uom: 'in', confidence: 0.85, is_lov_valid: true, is_uom_standardized: true }
    ],
    confidence: {
      manufacturer_confidence: 0.72,
      brand_confidence: 0.50,
      classpath_confidence: 0.70,
      attribute_confidence: 0.75,
      overall_confidence: 0.6675,
      needs_human_review: true,
      flagged_reasons: [
        'Overall confidence below threshold (85%)',
        'Brand resolution low confidence (50%)',
        'Taxonomy classified via fallback rule'
      ]
    },
    evidence_graph: {
      product_mpn: 'SKU-FLAGGED-018',
      evidences: {
        'Flagged Reason': {
          field_name: 'Human Review Trigger',
          value: 'Confidence 66.8% < 85.0% threshold',
          confidence: 0.67,
          source_type: 'deterministic',
          snippet: 'Input description lacked explicit manufacturer code and certified standard approvals',
          validated_by_lov: false,
          validated_by_uom: true
        }
      }
    },
    actual_image_yes_no: 'No',
    item_features: [],
    ref_urls: [],
    alternate_images: []
  }
];

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
    answer: 'Traditional PIMs are static repositories where catalog managers must manually key in attributes, write descriptions, and cross-reference spreadsheets. Nexora is an autonomous intelligence layer that sits upstream: our multi-agent AI pipeline takes messy, incomplete supplier data, enriches and standardizes it with full evidence provenance, and pushes clean, audit-ready data directly into your PIM or ERP.'
  },
  {
    question: 'How does the 8-agent pipeline ensure zero hallucinations on critical product specs?',
    answer: 'Nexora enforces deterministic guardrails at every stage. Numbers, dimensions, and electrical ratings are extracted using strict regex parsers and validated against canonical List of Values (LOV) dictionaries and standard UOM mappings. Every extracted attribute generates an Evidence Item linking back to exact source text, spec sheet PDFs, or manufacturer URLs with auditable provenance.'
  },
  {
    question: 'What happens when a product falls below the 85% confidence threshold?',
    answer: 'Any product with a composite confidence score under 85% is automatically flagged and routed to the Human-in-the-Loop (HITL) Review Queue. The reviewer is shown the exact flagged reasons, raw inputs, proposed values, and side-by-side evidence snippets to approve or edit with one click.'
  },
  {
    question: 'Can Nexora handle large catalogs with hundreds of thousands of SKUs?',
    answer: 'Yes. Our pipeline is architected for asynchronous horizontal batch processing. In our production benchmark, 1,000 complex industrial SKUs were fully resolved, classified, enriched with 3,400+ attribute triplets, and validated in under 30 seconds with 100% manufacturer resolution.'
  },
  {
    question: 'What input data formats and sources are supported?',
    answer: 'Nexora ingests CSV, Excel (.xlsx), raw JSON payloads, vendor spec PDFs, high-res product renders, and live REST API feeds. The pipeline automatically normalizes field name variations across suppliers.'
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
