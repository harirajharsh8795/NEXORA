import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { MOCK_TAXONOMY_CATEGORIES } from '../../data/mockData';
import './TaxonomyExplorer.css';

export default function TaxonomyExplorer() {
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', ...Array.from(new Set(MOCK_TAXONOMY_CATEGORIES.map(c => c.department)))];

  const filteredCategories = selectedDept === 'All'
    ? MOCK_TAXONOMY_CATEGORIES
    : MOCK_TAXONOMY_CATEGORIES.filter(c => c.department === selectedDept);

  const totalSkusInTaxonomy = MOCK_TAXONOMY_CATEGORIES.reduce((acc, cur) => acc + cur.skuCount, 0);

  return (
    <section id="taxonomy" className="taxonomy-section">
      <div className="taxonomy-section__inner">
        <SectionHeader
          tag="HIERARCHICAL TAXONOMY ENGINE"
          title="Interactive Taxonomy &amp;"
          titleAccent="Classpath Browser"
          subtitle="Explore the 4-tier classification system generated automatically by NEXORA for 1,000 distributor SKUs."
        />

        {/* Highlighted Deep-Dive Category Cards */}
        <div className="taxonomy-deepdives">
          <Card className="deepdive-card deepdive-card--abrasives">
            <div className="deepdive-header">
              <span className="deepdive-badge">FEATURED CATEGORY DEEP-DIVE #1</span>
              <span className="deepdive-sku-pill">363 Total SKUs</span>
            </div>
            <h3 className="deepdive-title">🛠️ Abrasives, Sanding &amp; Cut-Off Wheels</h3>
            <span className="deepdive-classpath">
              Tools &amp; Hardware &gt; Abrasives &gt; Coated &amp; Bonded Abrasives
            </span>
            <p className="deepdive-desc">
              Extracted structured specs across Freud, Norton, and Diablo industrial abrasives input rows.
            </p>
            <div className="deepdive-attributes-box">
              <span className="box-title">SAMPLE EXTRACTED LOV ATTRIBUTES (from final_output.csv):</span>
              <div className="deepdive-pills">
                <span className="attr-tag">Grit: <strong>80, 120, 220 Grit</strong></span>
                <span className="attr-tag">Material: <strong>Aluminum Oxide</strong></span>
                <span className="attr-tag">Diameter: <strong>4.5 in, 7 in</strong></span>
                <span className="attr-tag">Arbor: <strong>7/8 in</strong></span>
                <span className="attr-tag">Max Speed: <strong>13,300 RPM</strong></span>
              </div>
            </div>
          </Card>

          <Card className="deepdive-card deepdive-card--lighting">
            <div className="deepdive-header">
              <span className="deepdive-badge deepdive-badge--cyan">FEATURED CATEGORY DEEP-DIVE #2</span>
              <span className="deepdive-sku-pill deepdive-sku-pill--cyan">115 Total SKUs</span>
            </div>
            <h3 className="deepdive-title">💡 Electrical &amp; LED Lighting Bulbs</h3>
            <span className="deepdive-classpath">
              Electrical &amp; Lighting &gt; Lighting &gt; Light Bulbs &gt; LED
            </span>
            <p className="deepdive-desc">
              Resolved canonical Philips, Sylvania, and GE lighting specs with UOM standardized metrics.
            </p>
            <div className="deepdive-attributes-box">
              <span className="box-title">SAMPLE EXTRACTED LOV ATTRIBUTES (from final_output.csv):</span>
              <div className="deepdive-pills">
                <span className="attr-tag attr-tag--cyan">Equiv Wattage: <strong>60 W, 100 W</strong></span>
                <span className="attr-tag attr-tag--cyan">Color Temp: <strong>2700 K, 5000 K</strong></span>
                <span className="attr-tag attr-tag--cyan">Luminous Flux: <strong>800 lm</strong></span>
                <span className="attr-tag attr-tag--cyan">Bulb Base: <strong>E26 Medium</strong></span>
                <span className="attr-tag attr-tag--cyan">Voltage: <strong>120 V</strong></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Full Interactive Widget Bar */}
        <div className="taxonomy-filter-bar">
          <span className="filter-label">Browse All Departments:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`taxonomy-tab ${selectedDept === dept ? 'taxonomy-tab--active' : ''}`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="taxonomy-grid">
          {filteredCategories.map((cat, idx) => (
            <Card key={idx} className="taxonomy-card">
              <div className="taxonomy-card-header">
                <span className="dept-badge">{cat.department}</span>
                <span className="sku-count-pill">{cat.skuCount} SKUs</span>
              </div>

              <h4 className="fine-line-title">{cat.fineLine}</h4>
              <span className="class-name">Category Class: {cat.categoryClass}</span>

              <div className="classpath-box">
                <span className="classpath-label">FULL CLASSPATH:</span>
                <code className="classpath-code">{cat.classpath}</code>
              </div>
            </Card>
          ))}
        </div>

        <div className="taxonomy-footer-note">
          <span>📊 Total Classified SKUs: <strong>{totalSkusInTaxonomy} / 1,000 SKUs</strong> across 7 primary industrial departments.</span>
        </div>
      </div>
    </section>
  );
}
