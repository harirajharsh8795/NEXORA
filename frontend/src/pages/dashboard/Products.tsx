import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/mockData';
import type { ProductStatus } from '../../data/types';

const statusStyles: Record<ProductStatus, { bg: string; text: string; border: string }> = {
  approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
  validated: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20' },
  enriched: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' },
  'needs-review': { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  draft: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
};

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        p.mpn.toLowerCase().includes(search.toLowerCase()) ||
        p.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Catalog</h1>
          <p className="text-sm text-nexora-400 mt-0.5">Manage, filter, and inspect enriched industrial product records</p>
        </div>
        <button className="btn btn-secondary btn-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Catalog
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexora-500" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by SKU, MPN, title, manufacturer..."
            className="w-full pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-48"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="validated">Validated</option>
          <option value="enriched">Enriched</option>
          <option value="needs-review">Needs Review</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Structured Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>SKU</th>
                <th style={{ width: '15%' }}>MPN</th>
                <th style={{ width: '33%' }}>Product Title & Manufacturer</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '13%' }}>N-Score</th>
                <th style={{ width: '12%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const st = statusStyles[p.status] || statusStyles.draft;
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-nexora-400">{p.sku}</td>
                    <td className="font-mono text-xs font-semibold text-white">{p.mpn}</td>
                    <td>
                      <Link to={`/products/${p.id}`} className="font-medium text-white hover:text-electric-400 transition-colors block truncate">
                        {p.productName}
                      </Link>
                      <span className="text-xs text-nexora-500 block truncate">{p.manufacturer || '—'}</span>
                    </td>
                    <td className="text-xs text-nexora-300 truncate">{p.category || '—'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-nexora-800 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${p.qualityScore >= 90 ? 'bg-emerald-400' : p.qualityScore >= 70 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${p.qualityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white">{p.qualityScore}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] text-xs">
            <span className="text-nexora-500">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-nexora-300 font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary btn-sm">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
