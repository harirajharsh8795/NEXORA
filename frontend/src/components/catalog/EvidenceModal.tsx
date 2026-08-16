import type { EnrichedProduct } from '../../types';
import ConfidenceBar from '../ui/ConfidenceBar';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import './EvidenceModal.css';

interface EvidenceModalProps {
  product: EnrichedProduct | null;
  onClose: () => void;
}

export default function EvidenceModal({ product, onClose }: EvidenceModalProps) {
  if (!product) return null;

  // Defensive fallback for confidence object and subfields
  const confidence = product.confidence || {
    manufacturer_confidence: (product as any).overall_confidence ?? 0.95,
    brand_confidence: (product as any).overall_confidence ?? 0.95,
    classpath_confidence: (product as any).overall_confidence ?? 0.95,
    attribute_confidence: (product as any).overall_confidence ?? 0.95,
    overall_confidence: (product as any).overall_confidence ?? 0.95,
    needs_human_review: (product as any).needs_human_review ?? false,
    flagged_reasons: (product as any).flagged_reasons ?? [],
  };

  const manufConf = confidence.manufacturer_confidence ?? confidence.overall_confidence ?? 0.95;
  const brandConf = confidence.brand_confidence ?? confidence.overall_confidence ?? 0.95;
  const classConf = confidence.classpath_confidence ?? confidence.overall_confidence ?? 0.95;
  const attrConf = confidence.attribute_confidence ?? confidence.overall_confidence ?? 0.95;
  const overallConf = confidence.overall_confidence ?? 0.95;
  const needsReview = Boolean(confidence.needs_human_review);
  const flaggedReasons = confidence.flagged_reasons || [];

  const evidences = Object.values(product.evidence_graph?.evidences || {});

  return (
    <div className="evidence-modal-overlay" onClick={onClose}>
      <div className="evidence-modal glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag">EVIDENCE PROVENANCE GRAPH</span>
            <h3 className="modal-title">Audit Trail: {product.product_name || product.mfg_part_num}</h3>
            <span className="modal-subtitle">MPN: <code>{product.mfg_part_num}</code> • MFR: {product.manufacturer_name}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          {/* Confidence Breakdown Card */}
          <div className="modal-section">
            <h4 className="section-title">Confidence Score &amp; Governance Assessment</h4>
            <div className="confidence-breakdown-grid">
              <ConfidenceBar value={manufConf} label="Manufacturer Entity" showPercentage />
              <ConfidenceBar value={brandConf} label="Brand Entity" showPercentage />
              <ConfidenceBar value={classConf} label="Taxonomy Classpath" showPercentage />
              <ConfidenceBar value={attrConf} label="Attribute Extraction" showPercentage />
            </div>
            <div className="overall-status-row">
              <span>Overall Pipeline Score: <strong>{(overallConf * 100).toFixed(1)}%</strong></span>
              <StatusBadge status={needsReview ? 'review' : 'approved'} />
            </div>

            {needsReview && flaggedReasons.length > 0 && (
              <div className="modal-flagged-alert">
                <span className="modal-flagged-title">⚠️ Human Review Flag Reasons (Score &lt; 85%):</span>
                <ul>
                  {flaggedReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          {/* Evidence Provenance Table */}
          <div className="modal-section">
            <h4 className="section-title">Field-Level Evidence Provenance Audit</h4>

            {evidences.length === 0 ? (
              <p className="no-evidence-text">No explicit evidence nodes recorded for this item.</p>
            ) : (
              <div className="evidence-table">
                <div className="evidence-th">
                  <span>Target Field</span>
                  <span>Extracted Value</span>
                  <span>Source Type</span>
                  <span>Confidence</span>
                  <span>LOV / UOM</span>
                </div>

                {evidences.map((item, idx) => (
                  <div key={idx} className="evidence-tr">
                    <span className="td-field">{item.field_name}</span>
                    <span className="td-val">{item.value || '—'}</span>
                    <span className="td-source">
                      <span className="source-badge">{item.source_type}</span>
                    </span>
                    <span className="td-conf">{(item.confidence * 100).toFixed(0)}%</span>
                    <span className="td-validation">
                      {item.validated_by_lov ? '✅ LOV' : '—'}{' '}
                      {item.validated_by_uom ? '📐 UOM' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Source Links & Snippets */}
          {product.mfr_url && (
            <div className="modal-section">
              <h4 className="section-title">Verified Manufacturer URL &amp; Documents</h4>
              <div className="url-box">
                <a href={product.mfr_url} target="_blank" rel="noopener noreferrer" className="mfr-link">
                  🌐 {product.mfr_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose}>Close Audit Trail</Button>
        </div>
      </div>
    </div>
  );
}
