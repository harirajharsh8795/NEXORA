import { useState, useEffect } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import ConfidenceBar from '../ui/ConfidenceBar';
import EvidenceModal from './EvidenceModal';
import { fetchProducts } from '../../api/client';
import type { EnrichedProduct } from '../../types';
import './CatalogExplorer.css';

export default function CatalogExplorer() {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [stats, setStats] = useState({ total: 1000, approved: 684, review: 316 });
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review'>('all');
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);

  useEffect(() => {
    fetchProducts().then((res) => {
      setProducts(res.products);
      setStats({
        total: res.stats.total,
        approved: res.stats.approved,
        review: res.stats.review,
      });
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.mfg_part_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.part_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.manufacturer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.classpath.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && !p.confidence.needs_human_review) ||
      (statusFilter === 'review' && p.confidence.needs_human_review);

    return matchesSearch && matchesStatus;
  });

  return (
    <section id="catalog" className="catalog-section">
      <div className="catalog-section__inner">
        <SectionHeader
          tag="LIVE ENRICHED CATALOG EXPLORER"
          title="Browse Master Product"
          titleAccent="Dataset"
          subtitle="Search and inspect fully enriched industrial products processed through NEXORA's 8-stage multi-agent pipeline."
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
              Auto-Approved ({products.filter(p => !p.confidence.needs_human_review).length})
            </button>
            <button
              className={`status-tab ${statusFilter === 'review' ? 'status-tab--active' : ''}`}
              onClick={() => setStatusFilter('review')}
            >
              Human Review ({products.filter(p => p.confidence.needs_human_review).length})
            </button>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="catalog-loading">
            <span className="loading-spinner" />
            <span>Loading Enriched Catalog Data...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-empty">
            <p>No products match your search query "{searchQuery}".</p>
            <Button variant="ghost" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map((product) => {
              const isApproved = !product.confidence.needs_human_review;
              return (
                <Card key={product.mfg_part_num} className="product-card">
                  <div className="product-card-top">
                    <span className="product-mpn">{product.mfg_part_num}</span>
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
                  {!isApproved && product.confidence.flagged_reasons && product.confidence.flagged_reasons.length > 0 && (
                    <div className="product-flagged-box">
                      <span className="flagged-title">⚠️ Human Review Flagged Reasons:</span>
                      <ul className="flagged-reasons-list">
                        {product.confidence.flagged_reasons.map((reason, rIdx) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="product-confidence-box">
                    <ConfidenceBar
                      value={product.confidence.overall_confidence}
                      label="Pipeline Confidence"
                      showPercentage
                    />
                  </div>

                  <div className="product-card-footer">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => setSelectedProduct(product)}
                    >
                      🔗 View Evidence Graph
                    </Button>
                  </div>
                </Card>
              );
            })}
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
