import { FileSearch, ExternalLink } from 'lucide-react';

export default function Evidence() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Source & Evidence Center</h1>
        <p className="text-sm text-nexora-400 mt-1">Traceable provenance graph linking attributes back to manufacturer documentation</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Source Document Repository</h3>
        <div className="space-y-3">
          {[
            { title: 'Frigidaire PDSH4816AF Owner Manual & Specs', url: 'https://www.frigidaire.com/en/p/owner-center/product-support/PDSH4816AF', format: 'PDF / Web', linkedProducts: 1, freshness: '2 days ago' },
            { title: 'Whirlpool Installation Guide W11323304', url: 'https://www.whirlpool.com/content/dam/global/documents/202406/installation-instructions-w11323304.pdf', format: 'PDF', linkedProducts: 1, freshness: '5 days ago' },
            { title: '3M Industrial Abrasives Master Technical Catalog', url: 'https://www.3m.com/abrasives', format: 'Catalog PDF', linkedProducts: 4, freshness: '1 week ago' },
          ].map((doc, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-nexora-900/60 border border-white/[0.04]">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-electric-400" /> {doc.title}
                </div>
                <div className="text-xs text-nexora-400 mt-1 font-mono">{doc.url}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="bg-nexora-800 text-nexora-300 px-2.5 py-1 rounded">{doc.linkedProducts} SKUs Linked</span>
                <a href={doc.url} target="_blank" rel="noreferrer" className="text-electric-400 hover:underline flex items-center gap-1">
                  View Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
