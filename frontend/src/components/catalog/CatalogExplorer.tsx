import { useState, useEffect, useMemo } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import ConfidenceBar from '../ui/ConfidenceBar';
import EvidenceModal from './EvidenceModal';
import { fetchProducts, uploadEvaluatorDataset, exportDeliveryCsv } from '../../api/client';
import { triggerLiveEnrichment, LIVE_DEMO_MPNS } from '../../api/liveEnrichment';
import { MOCK_PRODUCTS } from '../../data/mockData';
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
  const [products, setProducts] = useState<EnrichedProduct[]>(MOCK_PRODUCTS);
  const [stats, setStats] = useState({
    total: 1000,
    approved: MOCK_PRODUCTS.filter((p) => !isNeedsReview(p)).length || 691,
    review: MOCK_PRODUCTS.filter((p) => isNeedsReview(p)).length || 309
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review'>('all');
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);

  // Pagination state: 20 items per page (50 pages for 1,000 SKUs)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Live Demo Modal State
  const [liveModalSku, setLiveModalSku] = useState<string | null>(null);
  const [liveStep, setLiveStep] = useState<string>('');
  const [liveFallbackMessage, setLiveFallbackMessage] = useState<string | null>(null);
  const [isLiveRunning, setIsLiveRunning] = useState(false);

  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts().then((res) => {
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
        setStats({
          total: res.stats.total || res.products.length,
          approved: res.stats.approved,
          review: res.stats.review,
        });
      }
      setLoading(false);
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(`Uploading & processing evaluator dataset "${file.name}"...`);

    try {
      const res = await uploadEvaluatorDataset(file);
      setProducts(res.products);
      setUploadedFilename(res.filename || file.name);
      setStats({
        total: res.total,
        approved: res.approved,
        review: res.review,
      });
      if ((res as any).is_client_fallback) {
        setUploadStatus(`⚡ Dynamic enrichment complete for "${res.filename}" via Client-Side Fallback Engine (${res.total} SKUs processed)!`);
      } else {
        setUploadStatus(`✅ Backend AI dynamic enrichment complete for "${res.filename}" (${res.total} SKUs processed)!`);
      }
    } catch (err: any) {
      setUploadStatus(`❌ Processing error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportDeliveryCsv();
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

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

  // Windowed pagination generator (1 2 3 4 5 6 ... 50)
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (current <= 4) {
      for (let i = 1; i <= 6; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 5; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }

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
          tag={uploadedFilename ? "DYNAMIC EVALUATOR DATASET" : "LIVE ENRICHED CATALOG EXPLORER"}
          title={uploadedFilename ? "Evaluator Catalog" : "Browse Master Product"}
          titleAccent="Dataset"
          subtitle={uploadedFilename ? `Inspecting ${stats.total} SKUs dynamically processed from evaluator dataset "${uploadedFilename}".` : "Search and inspect all 1,000 real industrial SKUs processed through NEXORA's 8-stage multi-agent pipeline."}
        />

        {/* Stats ticker bar */}
        <div className="catalog-stats-row">
          <div className="cat-stat">
            <span className="cat-stat-num">{stats.total.toLocaleString()}</span>
            <span className="cat-stat-lbl">{uploadedFilename ? "Evaluator SKUs Ingested" : "Master SKUs Ingested"}</span>
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

        {/* Evaluator Upload & Export Action Bar */}
        <div className="evaluator-action-bar" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="upload-btn" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)'
            }}>
              <span>📤 Upload Evaluator File (.csv / .xlsx)</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={handleExportCsv}
              className="export-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>📥 Export 252-Column CX1 CSV</span>
            </button>
          </div>

          {uploadStatus && (
            <div style={{ fontSize: '0.85rem', color: uploadStatus.startsWith('❌') ? '#f87171' : '#34d399', fontWeight: 500 }}>
              {uploadStatus}
            </div>
          )}
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
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="product-mpn" title={product.mfg_part_num}>{product.mfg_part_num}</span>
                        {isLiveCandidate && (
                          <span className="live-demo-tag shrink-0" title="Capable of real-time Gemini AI web enrichment">
                            ⚡ Try Live
                          </span>
                        )}
                      </div>
                      <StatusBadge status={isApproved ? 'approved' : 'review'} />
                    </div>

                    <h4 className="product-name" title={product.product_name || product.part_desc}>
                      {product.product_name || product.part_desc}
                    </h4>

                    <div className="product-meta-lines">
                      <div className="meta-line">
                        <span className="meta-k">Manufacturer:</span>
                        <span className="meta-v" title={product.manufacturer_name}>{product.manufacturer_name}</span>
                      </div>
                      <div className="meta-line">
                        <span className="meta-k">Brand:</span>
                        <span className="meta-v" title={product.brand_name}>{product.brand_name}</span>
                      </div>
                      <div className="meta-line">
                        <span className="meta-k">Classpath:</span>
                        <span className="meta-v meta-v--cyan" title={product.classpath}>{product.classpath}</span>
                      </div>
                    </div>

                    {/* Attributes triplet pills */}
                    {product.attributes && product.attributes.length > 0 && (
                      <div className="product-attributes-preview">
                        <span className="attr-preview-heading">LOV Attributes:</span>
                        <div className="attr-pills">
                          {product.attributes.slice(0, 4).map((attr, idx) => {
                            const valStr = (attr.value || '').trim();
                            const uomStr = (attr.uom || '').trim();
                            const formattedVal = !uomStr || valStr.endsWith(uomStr) || valStr.includes(` ${uomStr} `)
                              ? valStr
                              : `${valStr} ${uomStr}`;

                            return (
                              <span key={idx} className="attr-pill" title={`${attr.label}: ${formattedVal}`}>
                                {attr.label}: <strong>{formattedVal}</strong>
                              </span>
                            );
                          })}
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

                {/* Windowed Page Number Buttons */}
                <div className="page-numbers-window">
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
                      <span key={idx} className="page-ellipsis">
                        ...
                      </span>
                    )
                  )}
                </div>

                {/* Compact Page Counter on Mobile */}
                <span className="mobile-page-counter">
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



