import { useState, useEffect, useMemo } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import ConfidenceBar from '../ui/ConfidenceBar';
import EvidenceModal from './EvidenceModal';
import { fetchProducts } from '../../api/client';
import { triggerLiveEnrichment, LIVE_DEMO_MPNS } from '../../api/liveEnrichment';
import type { EnrichedProduct } from '../../types';
import './CatalogExplorer.css';

const isNeedsReview = (p: EnrichedProduct) => {
  if (p?.confidence && typeof p.confidence.needs_human_review === 'boolean') {
    return p.confidence.needs_human_review;
  }
  if (typeof (p as any)?.needs_human_review === 'boolean') {
    return (p as any).needs_human_review;
  }
  return false;
};

const getOverallConfidence = (p: EnrichedProduct) => {
  if (p?.confidence && typeof p.confidence.overall_confidence === 'number') {
    return p.confidence.overall_confidence;
  }
  if (typeof (p as any)?.overall_confidence === 'number') {
    return (p as any).overall_confidence;
  }
  return 0.95;
};

const getFlaggedReasons = (p: EnrichedProduct): string[] => {
  if (p?.confidence && Array.isArray(p.confidence.flagged_reasons)) {
    return p.confidence.flagged_reasons;
  }
  if (Array.isArray((p as any)?.flagged_reasons)) {
    return (p as any).flagged_reasons;
  }
  return [];
};

export default function CatalogExplorer() {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [stats, setStats] = useState({ total: 1000, approved: 680, review: 320 });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review'>('all');
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);

  // Pagination state: 6 items per page (2 rows of 3 cards each for clean alignment)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Live Demo Modal State
  const [liveModalSku, setLiveModalSku] = useState<string | null>(null);
  const [liveStep, setLiveStep] = useState<string>('');
  const [liveFallbackMessage, setLiveFallbackMessage] = useState<string | null>(null);
  const [isLiveRunning, setIsLiveRunning] = useState(false);

  useEffect(() => {
    fetchProducts().then((res) => {
      setProducts(res.products);
      setStats({
        total: res.stats.total || res.products.length,
        approved: res.stats.approved,
        review: res.stats.review,
      });
      setLoading(false);
    });
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.mfg_part_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.part_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.manufacturer_name && p.manufacturer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.classpath && p.classpath.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'approved' && !isNeedsReview(p)) ||
        (statusFilter === 'review' && isNeedsReview(p));

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  // Reset pagination when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Windowed pagination generator
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) {
      end = 4;
    } else if (current >= total - 2) {
      start = total - 3;
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  }, [totalPages, currentPage]);

  const handleLiveEnrichClick = async (mpn: string) => {
    setLiveModalSku(mpn);
    setLiveStep('Initiating live multi-agent workflow...');
    setLiveFallbackMessage(null);
    setIsLiveRunning(true);

    const result = await triggerLiveEnrichment(mpn, (step) => {
      setLiveStep(step);
    });

    setIsLiveRunning(false);

    if (result.success && result.product) {
      setLiveStep('✅ Live AI Enrichment Complete!');
      // Update in-memory product with enriched result
      setProducts((prev) =>
        prev.map((p) => (p.mfg_part_num.toLowerCase() === mpn.toLowerCase() ? result.product! : p))
      );
      setTimeout(() => {
        setSelectedProduct(result.product!);
        setLiveModalSku(null);
      }, 1200);
    } else {
      setLiveFallbackMessage(
        result.message ||
          'Live demo temporarily unavailable — showing verified result from our last confirmed run'
      );
      const existing = products.find((p) => p.mfg_part_num.toLowerCase() === mpn.toLowerCase());
      if (existing) {
        setTimeout(() => {
          setSelectedProduct(existing);
          setLiveModalSku(null);
        }, 2200);
      }
    }
  };

  return (
    <section id="catalog" className="catalog-section">
      <div className="catalog-section__inner">
        <SectionHeader
          tag="LIVE ENRICHED CATALOG EXPLORER"
          title="Browse Master Product"
          titleAccent="Dataset"
          subtitle="Search and inspect all 1,000 real industrial SKUs processed through NEXORA's 8-stage multi-agent pipeline."
        />

        {/* Stats ticker bar */}
        <div className="catalog-stats-row">
          <div className="cat-stat">
            <span className="cat-stat-num">{stats.total.toLocaleString()}</span>
            <span className="cat-stat-lbl">Master SKUs Ingested</span>
          </div>
          <div className="cat-stat">
            <span className="cat-stat-num cat-stat-num--green">{stats.approved.toLocaleString()}</span>
            <span className="cat-stat-lbl">Auto-Approved (Score ≥ 85%)</span>
          </div>
          <div className="cat-stat">
            <span className="cat-stat-num cat-stat-num--amber">{stats.review.toLocaleString()}</span>
            <span className="cat-stat-lbl">Flagged for Human Review</span>
          </div>
        </div>

        {/* Live Demo Disclaimer */}
        <div className="live-demo-disclaimer">
          <span>
            ⚡ <strong>Controlled Live Demo:</strong> 10 candidate SKUs feature direct live AI enrichment capability.
            This triggers a real, live AI search → fetch → Gemini extraction pipeline — not a simulation.
          </span>
          <span className="live-demo-tag">10 SKUs Live Active</span>
        </div>

        {/* Filter Controls */}
        <div className="catalog-controls">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by MPN, Manufacturer, Brand, Description, Classpath..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === 'all' ? 'status-tab--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All SKUs ({products.length})
            </button>
            <button
              className={`status-tab ${statusFilter === 'approved' ? 'status-tab--active' : ''}`}
              onClick={() => setStatusFilter('approved')}
            >
              Auto-Approved ({products.filter((p) => !isNeedsReview(p)).length})
            </button>
            <button
              className={`status-tab ${statusFilter === 'review' ? 'status-tab--active' : ''}`}
              onClick={() => setStatusFilter('review')}
            >
              Human Review ({products.filter((p) => isNeedsReview(p)).length})
            </button>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="catalog-loading">
            <span className="loading-spinner" />
            <span>Loading Enriched Catalog Data (1,000 SKUs)...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-empty">
            <p>No products match your search query "{searchQuery}".</p>
            <Button variant="ghost" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {paginatedProducts.map((product) => {
                const isApproved = !isNeedsReview(product);
                const isLiveCandidate = LIVE_DEMO_MPNS.includes(product.mfg_part_num);
                const flaggedReasons = getFlaggedReasons(product);

                return (
                  <Card key={product.mfg_part_num} className="product-card">
                    <div className="product-card-top">
                      <div className="flex items-center gap-2">
                        <span className="product-mpn">{product.mfg_part_num}</span>
                        {isLiveCandidate && (
                          <span className="live-demo-tag" title="Capable of real-time Gemini AI web enrichment">
                            ⚡ Try Live
                          </span>
                        )}
                      </div>
                      <StatusBadge status={isApproved ? 'approved' : 'review'} />
                    </div>

                    <h4 className="product-name">{product.product_name || product.part_desc}</h4>

                    <div className="product-meta-lines">
                      <div className="meta-line">
                        <span className="meta-k">Manufacturer:</span>
                        <span className="meta-v">{product.manufacturer_name}</span>
                      </div>
                      <div className="meta-line">
                        <span className="meta-k">Brand:</span>
                        <span className="meta-v">{product.brand_name}</span>
                      </div>
                      <div className="meta-line">
                        <span className="meta-k">Classpath:</span>
                        <span className="meta-v meta-v--cyan">{product.classpath}</span>
                      </div>
                    </div>

                    {/* Attributes triplet pills */}
                    {product.attributes && product.attributes.length > 0 && (
                      <div className="product-attributes-preview">
                        <span className="attr-preview-heading">LOV Attributes:</span>
                        <div className="attr-pills">
                          {product.attributes.slice(0, 4).map((attr, idx) => (
                            <span key={idx} className="attr-pill">
                              {attr.label}: <strong>{attr.value}{attr.uom ? ` ${attr.uom}` : ''}</strong>
                            </span>
                          ))}
                          {product.attributes.length > 4 && (
                            <span className="attr-pill attr-pill--more">
                              +{product.attributes.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Flagged Reason Alert if under 85% */}
                    {!isApproved && flaggedReasons.length > 0 && (
                      <div className="product-flagged-box">
                        <span className="flagged-title">⚠️ Human Review Flagged Reasons:</span>
                        <ul className="flagged-reasons-list">
                          {flaggedReasons.map((reason, rIdx) => (
                            <li key={rIdx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="product-confidence-box">
                      <ConfidenceBar
                        value={getOverallConfidence(product)}
                        label="Pipeline Confidence"
                        showPercentage
                      />
                    </div>

                    <div className="product-card-footer flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setSelectedProduct(product)}
                      >
                        🔗 View Evidence Graph
                      </Button>

                      {isLiveCandidate && (
                        <button
                          className="live-btn whitespace-nowrap"
                          onClick={() => handleLiveEnrichClick(product.mfg_part_num)}
                          title="Run real-time search, fetch, and Gemini extraction"
                        >
                          ⚡ Run Live
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Compact Windowed Pagination Controls */}
            <div className="pagination-row">
              <span className="pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} SKUs
              </span>

              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                {/* Windowed Page Number Buttons (Hidden on small mobile screens via CSS) */}
                <div className="page-numbers-window hidden sm:flex items-center gap-1">
                  {paginationRange.map((pg, idx) =>
                    typeof pg === 'number' ? (
                      <button
                        key={idx}
                        className={`page-btn page-num-btn ${currentPage === pg ? 'page-num-btn--active' : ''}`}
                        onClick={() => setCurrentPage(pg)}
                      >
                        {pg}
                      </button>
                    ) : (
                      <span key={idx} className="px-1 text-slate-500 font-bold select-none">
                        ...
                      </span>
                    )
                  )}
                </div>

                {/* Compact Page Counter on Mobile */}
                <span className="sm:hidden px-2 text-xs font-semibold text-purple-400">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}

        {/* Live Enrichment Loader Modal */}
        {liveModalSku && (
          <div className="live-modal-overlay">
            <div className="live-modal-content">
              <h3 className="live-modal-title">⚡ Real-Time Live AI Enrichment</h3>
              <p className="text-xs text-slate-400 mb-4">
                Executing live web search → page fetch → Gemini 2.0 Flash extraction for <strong>{liveModalSku}</strong>
              </p>

              {isLiveRunning && (
                <div className="flex flex-col items-center gap-3 my-6">
                  <span className="loading-spinner w-8 h-8 border-purple-500" />
                  <div className="live-modal-step">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{liveStep}</span>
                  </div>
                </div>
              )}

              {liveFallbackMessage && (
                <div className="fallback-banner">
                  <span>{liveFallbackMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        <EvidenceModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}



