import { Download, FileSpreadsheet, FileText, Code } from 'lucide-react';

export default function Exports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Export Center</h1>
        <p className="text-sm text-nexora-400 mt-1">Download commerce-ready structured records in CSV, Excel, and JSON schema formats</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { title: 'CSV (Delivery Format)', desc: 'Matches the 252-column UniHack delivery format schema exactly', icon: FileSpreadsheet, fmt: 'CSV' },
          { title: 'Excel Workbook (.xlsx)', desc: 'Multi-sheet workbook including product records and evidence logs', icon: FileText, fmt: 'XLSX' },
          { title: 'JSON Schema Export', desc: 'Machine-readable REST/GraphQL ready JSON payload for PIM ingestion', icon: Code, fmt: 'JSON' },
        ].map(exp => (
          <div key={exp.title} className="glass-card p-6 flex flex-col justify-between space-y-4 border-electric-500/10">
            <div>
              <exp.icon className="w-8 h-8 text-electric-400 mb-3" />
              <h3 className="text-lg font-bold text-white">{exp.title}</h3>
              <p className="text-xs text-nexora-400 mt-2 leading-relaxed">{exp.desc}</p>
            </div>
            <button className="w-full py-2.5 bg-electric-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-electric-400 transition-colors">
              <Download className="w-4 h-4" /> Download {exp.fmt}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
