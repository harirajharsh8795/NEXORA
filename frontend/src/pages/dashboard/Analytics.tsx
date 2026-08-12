export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-sm text-nexora-400 mt-1">Throughput, automation efficiency, and attribute accuracy analytics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Automation Rate', value: '89.4%', change: '+4.2%' },
          { label: 'Avg Processing Speed', value: '2.1s / SKU', change: '-12%' },
          { label: 'Attribute Accuracy', value: '97.2%', change: '+1.5%' },
          { label: 'Human Escalation Rate', value: '4.2%', change: '-2.1%' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-5">
            <span className="text-xs text-nexora-500 font-medium">{stat.label}</span>
            <div className="text-2xl font-extrabold text-white mt-1">{stat.value}</div>
            <span className="text-xs text-emerald-400 font-medium inline-block mt-1">{stat.change} vs last batch</span>
          </div>
        ))}
      </div>
    </div>
  );
}
