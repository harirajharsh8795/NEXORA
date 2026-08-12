import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, FileSearch, Sparkles, RefreshCw,
  Download, ShieldCheck, Cpu, Layers, Tag, X
} from 'lucide-react';
import { products } from '../../data/mockData';
import type { ProductAttribute } from '../../data/types';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'attributes' | 'content' | 'evidence' | 'validation' | 'trace'>('overview');
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);

  return (
    <div className="space-y-6">
      {/* Back button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-nexora-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-nexora-800 border border-nexora-600 text-nexora-200 rounded-lg hover:bg-nexora-700 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-nexora-800 border border-nexora-600 text-nexora-200 rounded-lg hover:bg-nexora-700 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" /> Validate
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-electric-500 text-white rounded-lg hover:bg-electric-400 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6 border-electric-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500/20 to-violet-500/20 border border-electric-500/30 flex items-center justify-center text-electric-400 shrink-0">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono bg-nexora-800 text-nexora-300 px-2 py-0.5 rounded">SKU: {product.sku}</span>
                <span className="text-xs font-mono bg-nexora-800 text-nexora-300 px-2 py-0.5 rounded">MPN: {product.mpn}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  product.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                  product.status === 'validated' ? 'bg-violet-500/10 text-violet-400' :
                  product.status === 'needs-review' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {product.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-2">{product.productName}</h1>
              <p className="text-sm text-nexora-400 mt-1">
                Manufacturer: <span className="text-white font-medium">{product.manufacturer || '—'}</span> &bull; Brand: <span className="text-white font-medium">{product.brand || '—'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-nexora-900/60 p-4 rounded-xl border border-white/[0.06] shrink-0">
            <div className="text-right">
              <div className="text-xs text-nexora-500 font-medium">Quality N-Score</div>
              <div className="text-2xl font-bold gradient-text">{product.qualityScore} / 100</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-electric-500 flex items-center justify-center text-xs font-bold text-white">
              {product.qualityScore}%
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-white/[0.06] overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'attributes', label: `Attributes (${product.attributes.length})` },
            { id: 'content', label: 'Generated Content' },
            { id: 'evidence', label: `Evidence (${product.evidence.length})` },
            { id: 'validation', label: 'Validation' },
            { id: 'trace', label: 'AI Trace' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-electric-500 text-electric-400'
                  : 'border-transparent text-nexora-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-electric-400" /> Taxonomy & Classification
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-nexora-500 block">Classpath</span>
                <span className="font-mono text-white text-xs bg-nexora-900 p-2 rounded block mt-1">{product.classpath || 'Not Classified'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs text-nexora-500 block">Category</span>
                  <span className="text-white font-medium">{product.category || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-nexora-500 block">Brand Resolution</span>
                  <span className="text-emerald-400 font-medium">{product.brand ? `✓ ${product.brand}` : 'Unresolved'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" /> Quick Summary
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-nexora-500 block">Short Description</span>
                <p className="text-sm text-nexora-300 mt-1 leading-relaxed">{product.shortDesc || 'No description available'}</p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-xs text-nexora-500 block">Invoice Description</span>
                <p className="text-xs font-mono text-amber-400 bg-nexora-900 p-2 rounded mt-1">{product.invoiceDesc || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attributes' && (
        <div className="space-y-4">
          <p className="text-xs text-nexora-400">Click any attribute card to open the explainability & evidence inspector panel.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.attributes.map((attr) => (
              <motion.div
                key={attr.label}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedAttribute(attr)}
                className="glass-card p-4 cursor-pointer hover:border-electric-500/40 transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-nexora-500 mb-1">
                  <span>{attr.label}</span>
                  <span className="text-emerald-400 font-medium">{attr.confidence}% conf</span>
                </div>
                <div className="text-base font-medium text-white group-hover:text-electric-300 transition-colors">
                  {attr.normalizedValue || attr.value}
                </div>
                {attr.uom && <span className="text-xs text-nexora-400">UOM: {attr.uom}</span>}
                <div className="mt-3 flex items-center justify-between text-[11px] text-nexora-500 pt-2 border-t border-white/[0.04]">
                  <span>Agent: {attr.agent}</span>
                  <span className="text-electric-400 group-hover:underline">Inspect →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="glass-card p-6 space-y-6">
          <div>
            <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider block mb-1">Product Title</span>
            <p className="text-lg font-bold text-white">{product.productName}</p>
          </div>
          <div>
            <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider block mb-1">Short Description</span>
            <p className="text-sm text-nexora-200 bg-nexora-900 p-4 rounded-xl border border-nexora-800 leading-relaxed">{product.shortDesc}</p>
          </div>
          <div>
            <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider block mb-1">Long Description</span>
            <p className="text-sm text-nexora-300 bg-nexora-900 p-4 rounded-xl border border-nexora-800 leading-relaxed">{product.longDesc}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider block mb-1">Mobile Description</span>
              <p className="text-xs text-nexora-300 bg-nexora-900 p-3 rounded-lg border border-nexora-800 font-mono">{product.mobileDesc}</p>
            </div>
            <div>
              <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider block mb-1">Invoice Description</span>
              <p className="text-xs text-amber-400 bg-nexora-900 p-3 rounded-lg border border-nexora-800 font-mono">{product.invoiceDesc}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="space-y-4">
          {product.evidence.length === 0 ? (
            <div className="glass-card p-8 text-center text-nexora-400">No direct RAG evidence snippets attached to this record yet.</div>
          ) : (
            product.evidence.map((ev, i) => (
              <div key={i} className="glass-card p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-electric-400">{ev.field}: {ev.value}</span>
                  <span className="text-emerald-400 font-mono">{ev.confidence}% Confidence</span>
                </div>
                <p className="text-sm font-mono text-amber-300 bg-nexora-900/80 p-3 rounded-lg border border-nexora-800 italic">"{ev.snippet}"</p>
                <div className="flex items-center justify-between text-xs text-nexora-500 pt-1">
                  <span>Source: {ev.source}</span>
                  <span>Extracted by: {ev.extractedBy}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Rule Engine Results</h3>
          <div className="space-y-3">
            {[
              { rule: 'LOV Allowed Values Check', status: 'passed', note: 'All attributes conform to category LOV schema' },
              { rule: 'UOM Standardization Rules', status: 'passed', note: 'Units normalized to ANSI/ISO standard' },
              { rule: 'Manufacturer Master Match', status: 'passed', note: `Canonical name match found` },
              { rule: 'Brand Resolution', status: product.brand ? 'passed' : 'warning', note: product.brand ? 'Resolved from master brand dictionary' : 'Unbranded item' },
              { rule: 'Description Length & Character Limits', status: 'passed', note: 'Within limits for Mobile, Short, Invoice formats' },
            ].map((res, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-nexora-900/60 border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  {res.status === 'passed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  <div>
                    <div className="text-sm font-medium text-white">{res.rule}</div>
                    <div className="text-xs text-nexora-400">{res.note}</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${res.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {res.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trace' && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-electric-400" /> Agent Execution Pipeline Trace
          </h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-nexora-700">
            {[
              { step: '01', agent: 'Product Understanding Agent', status: 'Success', detail: 'Parsed raw SKU string and extracted core entities' },
              { step: '02', agent: 'Entity Resolution Agent', status: 'Success', detail: 'Mapped MPN and matched canonical Manufacturer & Brand' },
              { step: '03', agent: 'Classification Agent', status: 'Success', detail: `Assigned Classpath: ${product.classpath}` },
              { step: '04', agent: 'Attribute Extraction Agent', status: 'Success', detail: `Extracted ${product.attributes.length} structured key-value attributes` },
              { step: '05', agent: 'Validation Agent', status: 'Success', detail: 'Passed LOV, UOM, and constraint checks' },
              { step: '06', agent: 'Content Generation Agent', status: 'Success', detail: 'Generated 5 localized description variants' },
            ].map(tr => (
              <div key={tr.step} className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-electric-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-lg shadow-electric-500/30">
                  {tr.step}
                </div>
                <div className="bg-nexora-900/80 p-4 rounded-xl border border-white/[0.06] flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{tr.agent}</span>
                    <span className="text-emerald-400 font-mono">✓ {tr.status}</span>
                  </div>
                  <p className="text-xs text-nexora-400">{tr.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attribute Inspector Modal / Panel */}
      <AnimatePresence>
        {selectedAttribute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-lg w-full p-6 relative border-electric-500/30 glow-blue"
            >
              <button
                onClick={() => setSelectedAttribute(null)}
                className="absolute top-4 right-4 text-nexora-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 text-xs text-electric-400 font-semibold uppercase tracking-wider mb-2">
                <FileSearch className="w-4 h-4" /> Attribute Inspector
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{selectedAttribute.label}</h3>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-nexora-900 rounded-lg">
                  <span className="text-xs text-nexora-500 block">Normalized Output Value</span>
                  <span className="text-base font-bold text-white">{selectedAttribute.normalizedValue || selectedAttribute.value}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-nexora-900 rounded-lg">
                    <span className="text-xs text-nexora-500 block">Raw / Input Value</span>
                    <span className="text-xs font-mono text-amber-400">{selectedAttribute.originalValue || selectedAttribute.value}</span>
                  </div>
                  <div className="p-3 bg-nexora-900 rounded-lg">
                    <span className="text-xs text-nexora-500 block">Confidence Score</span>
                    <span className="text-xs font-semibold text-emerald-400">{selectedAttribute.confidence}%</span>
                  </div>
                </div>
                <div className="p-3 bg-nexora-900 rounded-lg space-y-1">
                  <span className="text-xs text-nexora-500 block">Source Trace</span>
                  <span className="text-xs text-nexora-200">{selectedAttribute.source}</span>
                </div>
                <div className="p-3 bg-nexora-900 rounded-lg space-y-1">
                  <span className="text-xs text-nexora-500 block">Handling Agent</span>
                  <span className="text-xs text-electric-400 font-medium">{selectedAttribute.agent}</span>
                </div>
                <div className="p-3 bg-nexora-900 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-nexora-500">Validation Check</span>
                  <span className="text-xs font-semibold text-emerald-400 uppercase">✓ Passed LOV Rule</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
