// NEXORA Type Definitions

export interface Product {
  id: string;
  sku: string;
  mpn: string;
  manufacturer: string;
  brand: string;
  category: string;
  classpath: string;
  productName: string;
  shortDesc: string;
  longDesc: string;
  mobileDesc: string;
  invoiceDesc: string;
  qualityScore: number;
  status: ProductStatus;
  updatedAt: string;
  attributes: ProductAttribute[];
  evidence: EvidenceRecord[];
  demo: boolean;
}

export type ProductStatus = 'draft' | 'processing' | 'enriched' | 'validated' | 'needs-review' | 'approved' | 'failed';

export interface ProductAttribute {
  label: string;
  value: string;
  normalizedValue: string;
  confidence: number;
  source: string;
  validation: 'passed' | 'failed' | 'warning' | 'skipped';
  agent: string;
  uom?: string;
  originalValue?: string;
}

export interface EvidenceRecord {
  field: string;
  value: string;
  source: string;
  url: string;
  snippet: string;
  confidence: number;
  extractedBy: string;
  validatedAt: string;
}

export interface Manufacturer {
  id: string;
  raw: string;
  canonical: string;
  code: string;
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  classpath: string;
  productCount: number;
  attributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  label: string;
  allowedValues: string[];
  required: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'error';
  executions: number;
  avgLatency: number;
  successRate: number;
  lastRun: string;
  icon: string;
}

export interface EnrichmentJob {
  id: string;
  name: string;
  products: number;
  source: string;
  attributesAdded: number;
  successRate: number;
  startedAt: string;
  duration: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  passed: number;
  failed: number;
  warning: number;
  skipped: number;
  total: number;
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  issue: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  evidence: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AnalyticsData {
  productsProcessed: number;
  attributesExtracted: number;
  avgQualityScore: number;
  validatedRecords: number;
  humanReviewQueue: number;
  sourceCoverage: number;
  qualityTrend: { date: string; score: number }[];
  processingVolume: { date: string; count: number }[];
  categoryDistribution: { name: string; count: number; percentage: number }[];
  validationFailures: { rule: string; count: number }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  industry: string;
  metrics: {
    skusProcessed: number;
    qualityBefore: number;
    qualityAfter: number;
    timeSaved: string;
    automationRate: number;
  };
  isDemo: boolean;
}
