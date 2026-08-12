import { Bot } from 'lucide-react';
import { agents } from '../../data/mockData';

export default function Agents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agent Observability</h1>
        <p className="text-sm text-nexora-400 mt-1">Live telemetry for all 8 specialized product intelligence agents</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="glass-card p-5 space-y-3 border-electric-500/10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center text-electric-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">ACTIVE</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{agent.name}</h3>
              <p className="text-xs text-nexora-400 mt-1 line-clamp-2">{agent.description}</p>
            </div>
            <div className="pt-2 border-t border-white/[0.04] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-nexora-500 block">Executions</span>
                <span className="text-white font-mono">{agent.executions.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-nexora-500 block">Avg Latency</span>
                <span className="text-white font-mono">{agent.avgLatency}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
