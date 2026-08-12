import { useState } from 'react';
import { Plus } from 'lucide-react';
import { enrichmentJobs } from '../../data/mockData';

export default function Enrichment() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attribute Enrichment</h1>
          <p className="text-sm text-nexora-400 mt-1">Automated RAG-backed product catalog enrichment</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-electric-500/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" /> Create Enrichment Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-semibold text-white">Enrichment Executions</h3>
          <span className="text-xs text-nexora-500">{enrichmentJobs.length} active jobs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-nexora-500 border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 font-medium">Job Name</th>
                <th className="text-left py-3 px-4 font-medium">Products</th>
                <th className="text-left py-3 px-4 font-medium">Source</th>
                <th className="text-left py-3 px-4 font-medium">Attributes Added</th>
                <th className="text-left py-3 px-4 font-medium">Success Rate</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrichmentJobs.map(job => (
                <tr key={job.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="py-3 px-4 text-white font-medium">{job.name}</td>
                  <td className="py-3 px-4 text-nexora-300">{job.products}</td>
                  <td className="py-3 px-4 text-nexora-300 text-xs">{job.source}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400">+{job.attributesAdded}</td>
                  <td className="py-3 px-4 text-nexora-300">{job.successRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      job.status === 'running' ? 'bg-blue-500/10 text-blue-400 animate-pulse' : 'bg-nexora-700 text-nexora-300'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 space-y-4 border-electric-500/30">
            <h3 className="text-lg font-bold text-white">Create New Enrichment Job</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-nexora-400 block mb-1">Target Category</label>
                <select className="w-full bg-nexora-900 border border-nexora-700 rounded-lg p-2.5 text-sm text-white">
                  <option>Fittings</option>
                  <option>Appliances</option>
                  <option>Abrasives</option>
                  <option>Electrical</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-nexora-400 block mb-1">Source Priority</label>
                <select className="w-full bg-nexora-900 border border-nexora-700 rounded-lg p-2.5 text-sm text-white">
                  <option>Manufacturer Documentation (PDF)</option>
                  <option>Manufacturer Websites (URL)</option>
                  <option>Master Catalog RAG Index</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-nexora-400 block mb-1">Min. Confidence Threshold</label>
                <input type="range" min="50" max="95" defaultValue="80" className="w-full accent-electric-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-nexora-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm bg-electric-500 text-white rounded-lg font-medium">Start Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
