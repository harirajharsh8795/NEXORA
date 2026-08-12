import { validationRules } from '../../data/mockData';

export default function Validation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Validation Center</h1>
        <p className="text-sm text-nexora-400 mt-1">Deterministic rule engine monitoring and status</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Rule Constraints</h3>
        <div className="space-y-3">
          {validationRules.map(rule => (
            <div key={rule.id} className="glass-card p-4 space-y-2 border-white/[0.04]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-white">{rule.name}</div>
                  <div className="text-xs text-nexora-400">{rule.description}</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">✓ {rule.passed} Passed</span>
                  <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono">✕ {rule.failed} Failed</span>
                  <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">! {rule.warning} Warn</span>
                </div>
              </div>
              <div className="h-1.5 bg-nexora-900 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full" style={{ width: `${(rule.passed / rule.total) * 100}%` }} />
                <div className="bg-red-400 h-full" style={{ width: `${(rule.failed / rule.total) * 100}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${(rule.warning / rule.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
