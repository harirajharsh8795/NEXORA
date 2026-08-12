import { XCircle, AlertTriangle } from 'lucide-react';

export default function DataQuality() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Quality Center</h1>
        <p className="text-sm text-nexora-400 mt-1">Catalog-wide data health and quality metrics</p>
      </div>

      {/* Main Score Card */}
      <div className="glass-card p-6 border-electric-500/20 glow-blue">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs text-electric-400 font-semibold uppercase tracking-wider">Overall Catalog Quality Score</span>
            <div className="text-4xl font-extrabold text-white mt-1">N-Score: 87 / 100</div>
            <p className="text-sm text-nexora-300 mt-2 max-w-xl">
              Based on completeness, accuracy, consistency, UOM standardization, LOV compliance, and source evidence coverage.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-8 border-electric-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-electric-500/20">
              87%
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completeness', score: '94%', desc: 'Required attributes populated' },
          { label: 'Accuracy', score: '97%', desc: 'Factually verified outputs' },
          { label: 'Consistency', score: '98%', desc: 'Cross-field schema alignment' },
          { label: 'Standardization', score: '100%', desc: 'ANSI/ISO UOM compliance' },
        ].map((m) => (
          <div key={m.label} className="glass-card p-4">
            <span className="text-xs text-nexora-500 font-medium">{m.label}</span>
            <div className="text-2xl font-bold text-white mt-1">{m.score}</div>
            <p className="text-xs text-nexora-400 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Issue Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Top Quality Issues</h3>
          <div className="space-y-3 text-sm">
            {[
              { issue: 'Unresolved Brand Names', count: 112, severity: 'medium' },
              { issue: 'Missing Source Evidence', count: 89, severity: 'medium' },
              { issue: 'Missing Required Category Attributes', count: 67, severity: 'high' },
              { issue: 'Manufacturer Master Ambiguity', count: 55, severity: 'low' },
              { issue: 'Non-Standardized UOM Formats', count: 12, severity: 'low' },
            ].map(item => (
              <div key={item.issue} className="flex items-center justify-between p-3 rounded-lg bg-nexora-900/60 border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  {item.severity === 'high' ? <XCircle className="w-4 h-4 text-red-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  <span className="text-nexora-200 font-medium">{item.issue}</span>
                </div>
                <span className="text-xs font-mono bg-nexora-800 text-nexora-400 px-2 py-1 rounded">{item.count} SKUs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Quality by Category</h3>
          <div className="space-y-3">
            {[
              { cat: 'Abrasives', score: 92 },
              { cat: 'Appliances', score: 96 },
              { cat: 'Fittings', score: 94 },
              { cat: 'Faucets', score: 91 },
              { cat: 'Lighting', score: 88 },
            ].map(c => (
              <div key={c.cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-nexora-300">{c.cat}</span>
                  <span className="text-emerald-400 font-bold">{c.score}%</span>
                </div>
                <div className="h-2 bg-nexora-800 rounded-full overflow-hidden">
                  <div className="h-full bg-electric-500 rounded-full" style={{ width: `${c.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
