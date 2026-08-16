import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './ROICalculator.css';

export default function ROICalculator() {
  const [skuCount, setSkuCount] = useState(10000);
  const [manualCostPerSku, setManualCostPerSku] = useState(15);
  const [manualMinutesPerSku, setManualMinutesPerSku] = useState(45);

  const nexoraCostPerSku = 0.001; // $0.001 API / LLM & compute cost ($1.00 per 1,000 SKUs)
  const nexoraSecondsPerSku = 2.5; // 2.5s real-world pipeline SLA

  const totalManualCost = skuCount * manualCostPerSku;
  const totalNexoraCost = Number((skuCount * nexoraCostPerSku).toFixed(2));
  const totalSavings = totalManualCost - totalNexoraCost;
  const savingsPercent = Math.round((totalSavings / totalManualCost) * 100);

  const totalManualHours = Math.round((skuCount * manualMinutesPerSku) / 60);
  const totalNexoraHours = Math.round((skuCount * nexoraSecondsPerSku) / 3600) || 1;
  const timeSavedHours = totalManualHours - totalNexoraHours;



  return (
    <section id="roi-calculator" className="roi-section">
      <div className="roi-section__inner">
        <SectionHeader
          tag="BUSINESS ROI CALCULATOR"
          title="Calculate Your Time &amp; Cost"
          titleAccent="Savings"
          subtitle="See how much your organization saves by replacing manual catalog enrichment teams with NEXORA's autonomous multi-agent pipeline."
        />

        <div className="roi-grid">
          {/* Controls Box */}
          <Card className="roi-card roi-card--controls">
            <h3 className="roi-card-heading">Catalog Parameters</h3>

            <div className="roi-field">
              <div className="roi-label-row">
                <label htmlFor="sku-slider">Catalog Size (SKUs):</label>
                <span className="roi-val-badge">{skuCount.toLocaleString()} SKUs</span>
              </div>
              <input
                id="sku-slider"
                type="range"
                min="500"
                max="50000"
                step="500"
                value={skuCount}
                onChange={(e) => setSkuCount(Number(e.target.value))}
                className="roi-slider"
              />
            </div>

            <div className="roi-field">
              <div className="roi-label-row">
                <label htmlFor="cost-slider">Manual Enrichment Cost / SKU ($):</label>
                <span className="roi-val-badge">${manualCostPerSku} / SKU</span>
              </div>
              <input
                id="cost-slider"
                type="range"
                min="5"
                max="40"
                step="1"
                value={manualCostPerSku}
                onChange={(e) => setManualCostPerSku(Number(e.target.value))}
                className="roi-slider"
              />
            </div>

            <div className="roi-field">
              <div className="roi-label-row">
                <label htmlFor="time-slider">Manual Time / SKU (Minutes):</label>
                <span className="roi-val-badge">{manualMinutesPerSku} mins / SKU</span>
              </div>
              <input
                id="time-slider"
                type="range"
                min="15"
                max="90"
                step="5"
                value={manualMinutesPerSku}
                onChange={(e) => setManualMinutesPerSku(Number(e.target.value))}
                className="roi-slider"
              />
            </div>

            <div className="roi-preset-btns">
              <span className="preset-label">Quick Sets:</span>
              <button className="preset-btn" onClick={() => setSkuCount(1000)}>1,000 SKUs</button>
              <button className="preset-btn" onClick={() => setSkuCount(10000)}>10,000 SKUs</button>
              <button className="preset-btn" onClick={() => setSkuCount(50000)}>50,000 SKUs</button>
            </div>
          </Card>

          {/* Results Box */}
          <Card className="roi-card roi-card--results">
            <div className="results-badge">PROJECTION SUMMARY</div>
            <h3 className="roi-card-heading">Estimated Impact</h3>

            <div className="savings-hero">
              <span className="savings-label">TOTAL COST SAVINGS</span>
              <div className="savings-amount">${totalSavings.toLocaleString()}</div>
              <span className="savings-percent">({savingsPercent}% Cost Reduction)</span>
            </div>

            <div className="impact-metrics">
              <div className="impact-row">
                <span className="impact-k">Traditional Manual Cost:</span>
                <span className="impact-v impact-v--red">${totalManualCost.toLocaleString()}</span>
              </div>
              <div className="impact-row">
                <span className="impact-k">NEXORA Multi-Agent Cost:</span>
                <span className="impact-v impact-v--green">${totalNexoraCost.toLocaleString()}</span>
              </div>
              <div className="impact-row">
                <span className="impact-k">Manual Processing Time:</span>
                <span className="impact-v">{totalManualHours.toLocaleString()} hours</span>
              </div>
              <div className="impact-row">
                <span className="impact-k">NEXORA Pipeline Time:</span>
                <span className="impact-v impact-v--cyan">{totalNexoraHours} hours ({timeSavedHours.toLocaleString()} hrs saved)</span>
              </div>
            </div>

            <Button variant="primary" size="lg" icon={<span>🚀</span>} onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Enrich Your Catalog Now
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
