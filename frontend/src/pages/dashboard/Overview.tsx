import { Package, Tags, BarChart3, ShieldCheck, Users, Globe } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsData, agents } from '../../data/mockData';

const kpis = [
  { label: 'Products Processed', value: '1,000', icon: Package, color: 'text-electric-400', bg: 'bg-electric-500/10' },
  { label: 'Attributes Extracted', value: '12,847', icon: Tags, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Avg Quality Score', value: '87%', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Validated Records', value: '834', icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Review Queue', value: '42', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Source Coverage', value: '76%', icon: Globe, color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#6366F1'];

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-nexora-400 mt-1">Real-time industrial product intelligence metrics & quality analytics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4 flex flex-col justify-between">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3 shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-xs text-nexora-500 font-medium mt-1 truncate">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score Trend */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quality Score Trend</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.qualityTrend}>
                <defs>
                  <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="url(#qualityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Volume */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Processing Volume</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.processingVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Validation Failures */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Validation Failures</h3>
          <div className="space-y-3">
            {analyticsData.validationFailures.slice(0, 5).map((f) => (
              <div key={f.rule} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-nexora-300 font-medium">{f.rule}</span>
                  <span className="text-nexora-500 font-mono">{f.count} SKUs</span>
                </div>
                <div className="h-2 bg-nexora-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500/70 rounded-full" style={{ width: `${(f.count / 120) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analyticsData.categoryDistribution.slice(0, 6)} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                    {analyticsData.categoryDistribution.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {analyticsData.categoryDistribution.slice(0, 6).map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-nexora-300 font-medium">{cat.name}</span>
                  </div>
                  <span className="text-nexora-500 font-mono">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Activity Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agent Telemetry & Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Agent Name</th>
                <th style={{ width: '20%' }}>Executions</th>
                <th style={{ width: '20%' }}>Avg Latency</th>
                <th style={{ width: '15%' }}>Success Rate</th>
                <th style={{ width: '15%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a.id}>
                  <td className="font-semibold text-white">{a.name}</td>
                  <td className="text-nexora-300 font-mono">{a.executions.toLocaleString()}</td>
                  <td className="text-nexora-300 font-mono">{a.avgLatency}s</td>
                  <td className="text-nexora-300 font-mono">{a.successRate}%</td>
                  <td>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
