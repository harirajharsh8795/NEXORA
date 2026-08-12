import { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { reviewItems as initialItems } from '../../data/mockData';

export default function Review() {
  const [items, setItems] = useState(initialItems);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setItems(items.map(item => item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Human Review Center</h1>
        <p className="text-sm text-nexora-400 mt-1">Escalated low-confidence fields requiring human verification</p>
      </div>

      <div className="space-y-4">
        {items.filter(i => i.status === 'pending').length === 0 ? (
          <div className="glass-card p-12 text-center text-nexora-400">
            <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Queue Clear!</h3>
            <p className="text-sm">All escalated records have been reviewed.</p>
          </div>
        ) : (
          items.filter(i => i.status === 'pending').map(item => (
            <div key={item.id} className="glass-card p-6 border-amber-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Flagged Issue: {item.issue}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{item.productName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-mono">{item.confidence}% Confidence</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-nexora-900 rounded-lg">
                  <span className="text-xs text-nexora-500 block mb-1">Target Field</span>
                  <span className="text-white font-semibold">{item.field}</span>
                </div>
                <div className="p-3 bg-nexora-900 rounded-lg">
                  <span className="text-xs text-nexora-500 block mb-1">Current Output</span>
                  <span className="text-amber-400 font-mono">{item.currentValue || '(empty)'}</span>
                </div>
              </div>

              <div className="p-3 bg-nexora-900/60 rounded-lg border border-white/[0.04] space-y-1">
                <span className="text-xs text-electric-400 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Why was this flagged?
                </span>
                <p className="text-xs text-nexora-300">{item.evidence}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => handleAction(item.id, 'reject')} className="px-4 py-2 text-xs font-medium text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Reject Suggestion
                </button>
                <button onClick={() => handleAction(item.id, 'approve')} className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Approve Suggestion
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
