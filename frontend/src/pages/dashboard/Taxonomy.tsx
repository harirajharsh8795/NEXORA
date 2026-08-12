import { useState } from 'react';
import { categories } from '../../data/mockData';

export default function Taxonomy() {
  const [selectedCat, setSelectedCat] = useState(categories[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Taxonomy & LOV Explorer</h1>
        <p className="text-sm text-nexora-400 mt-1">Browse category trees, allowed List of Values, and attribute schema constraints</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Tree */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-nexora-400 uppercase tracking-wider px-2 mb-2">Categories</h3>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm text-left transition-colors ${
                selectedCat.id === cat.id ? 'bg-electric-500/10 text-electric-400 border border-electric-500/30' : 'text-nexora-200 hover:bg-white/[0.04]'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs font-mono text-nexora-500">{cat.productCount} SKUs</span>
            </button>
          ))}
        </div>

        {/* Category Schema Detail */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6">
          <div>
            <span className="text-xs font-mono text-electric-400">{selectedCat.classpath}</span>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedCat.name} Schema</h2>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configured Attributes & LOVs</h4>
            {selectedCat.attributes.map(attr => (
              <div key={attr.label} className="p-4 rounded-xl bg-nexora-900/60 border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{attr.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${attr.required ? 'bg-amber-500/10 text-amber-400' : 'bg-nexora-800 text-nexora-400'}`}>
                    {attr.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                {attr.allowedValues.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {attr.allowedValues.map(val => (
                      <span key={val} className="text-xs bg-nexora-800 text-nexora-200 px-2.5 py-1 rounded font-mono">
                        {val}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-nexora-500 italic">Open text / Numeric input with UOM validation</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
