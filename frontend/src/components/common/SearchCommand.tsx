import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Layers, X } from 'lucide-react';
import { products, categories } from '../../data/mockData';

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  const matchedProducts = query ? products.filter(p => p.productName.toLowerCase().includes(query.toLowerCase()) || p.mpn.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];
  const matchedCategories = query ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card max-w-xl w-full p-4 space-y-4 border-electric-500/30 glow-blue relative">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
          <Search className="w-5 h-5 text-electric-400" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, SKUs, MPNs, categories, agents... (Esc to exit)"
            className="w-full bg-transparent text-white text-base focus:outline-none placeholder-nexora-500"
          />
          <button onClick={() => setOpen(false)} className="text-nexora-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto text-sm">
          {!query ? (
            <div className="text-xs text-nexora-500 py-4 text-center">Type to search across NEXORA records and settings...</div>
          ) : (
            <>
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-xs text-nexora-500 font-semibold mb-1 px-2">PRODUCTS</div>
                  {matchedProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { navigate(`/products/${p.id}`); setOpen(false); }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-electric-400" />
                        <span className="text-white font-medium">{p.productName}</span>
                      </div>
                      <span className="text-xs font-mono text-nexora-400">{p.mpn}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedCategories.length > 0 && (
                <div>
                  <div className="text-xs text-nexora-500 font-semibold mb-1 px-2">CATEGORIES</div>
                  {matchedCategories.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { navigate(`/taxonomy`); setOpen(false); }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-violet-400" />
                      <span className="text-white">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedProducts.length === 0 && matchedCategories.length === 0 && (
                <div className="text-xs text-nexora-400 py-4 text-center">No matching records found.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
