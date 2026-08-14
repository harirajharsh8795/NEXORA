/* ============================================
   NEXORA TypeScript Interfaces
   Derived from the Pydantic models in:
   - src/models/product.py
   - src/models/evidence.py
   - src/models/confidence.py
   - src/models/attribute.py
   ============================================ */

export interface AttributeTriplet {
  index: number;
  label: string;
  value: string;
  uom: string;
  confidence: number;
  is_lov_valid?: boolean;
  is_uom_standardized?: boolean;
}

export interface EvidenceItem {
  field_name: string;
  value: string;
  confidence: number;
  source_type: string; // "deterministic" | "lov_match" | "fuzzy_match" | "llm_extraction" | "web_scrape" | "document"
  source_url?: string;
  snippet?: string;
  validated_by_lov: boolean;
  validated_by_uom: boolean;
}

export interface EvidenceGraph {
  product_mpn: string;
  evidences: Record<string, EvidenceItem>;
}

export interface ConfidenceScore {
  manufacturer_confidence: number;
  brand_confidence: number;
  classpath_confidence: number;
  attribute_confidence: number;
  overall_confidence: number;
  needs_human_review: boolean;
  flagged_reasons: string[];
}

export interface EnrichedProduct {
  // Raw identifiers
  mfg_part_num: string;
  part_desc: string;
  raw_manuf?: string;
  raw_brand?: string;

  // Resolved entities
  manufacturer_name: string;
  brand_name: string;
  trade_name?: string;
  manufacturer_part_number: string;
  alternate_part_number?: string;

  // Classification
  department: string;
  category_class: string;
  fine_line: string;
  classpath: string;

  // Descriptions
  mobile_desc: string;
  invoice_desc: string;
  short_desc: string;
  long_desc1: string;
  retail_desc: string;
  marketing_description: string;

  // Features
  item_features: string[];

  // Attributes
  attributes: AttributeTriplet[];

  // Supplementary
  with_spec?: string;
  standard_approvals?: string;
  prop_65?: string;
  application?: string;
  includes?: string;
  product_name: string;

  // Identifiers
  upc?: string;
  ean?: string;
  gtin?: string;
  unspsc?: string;
  warranty?: string;
  list_price?: string;
  selling_qty?: string;
  selling_uom?: string;

  // Dimensions
  length?: string;
  length_uom?: string;
  height?: string;
  height_uom?: string;
  width?: string;
  width_uom?: string;
  weight?: string;
  weight_uom?: string;
  volume?: string;
  volume_uom?: string;

  // Media
  mfr_url?: string;
  ref_urls: string[];
  product_image?: string;
  alternate_images: string[];
  specification_sheet?: string;
  instruction_manual?: string;
  actual_image_yes_no: string;

  // Governance
  confidence: ConfidenceScore;
  evidence_graph: EvidenceGraph;
}

// Pipeline stage representation
export interface PipelineStage {
  id: number;
  name: string;
  icon: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

// FAQ item
export interface FAQItem {
  question: string;
  answer: string;
}

// Pricing tier
export interface PricingTier {
  name: string;
  tag?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

// Testimonial
export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

// Category in taxonomy tree
export interface TaxonomyCategory {
  department: string;
  categoryClass: string;
  fineLine: string;
  classpath: string;
  skuCount: number;
}
