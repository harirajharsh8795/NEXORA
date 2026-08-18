import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import StageCard from '../pipeline/StageCard';
import { MOCK_PIPELINE_STAGES, MOCK_PRODUCTS } from '../../data/mockData';
import './PipelineSection.css';

export default function PipelineSection() {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  const selectedStage = MOCK_PIPELINE_STAGES.find((s) => s.id === selectedStageId) || MOCK_PIPELINE_STAGES[0];
  const sampleProduct = MOCK_PRODUCTS[0];

  // Stage-specific real example data snippets
  const getStageExampleData = (id: number) => {
    switch (id) {
      case 1:
        return {
          title: 'Stage 1: Input Intelligence & Cleaning',
          input: `Raw Manuf: "${sampleProduct.raw_manuf}"\nRaw Brand: "${sampleProduct.raw_brand}"\nDesc: "${sampleProduct.part_desc}"`,
          output: `Nullified Placeholders: "-- Unbranded --" → null\nCleaned MPN: "${sampleProduct.mfg_part_num}"\nExtracted Embedded Tokens: "24-inch", "Stainless Steel", "Top Control"`,
          explanation: 'Removes boilerplate placeholders, strips non-printable characters, and normalizes casing across vendor rows.'
        };
      case 2:
        return {
          title: 'Stage 2: Entity Resolution & Canonical Matching',
          input: `Raw Vendor Name: "${sampleProduct.raw_manuf}"\nMaster Dictionary Size: 27,000+ Manufacturers`,
          output: `Canonical Manufacturer Name: "${sampleProduct.manufacturer_name}"\nResolved Brand Name: "${sampleProduct.brand_name}"\nTrade Name: "${sampleProduct.trade_name}"`,
          explanation: 'Queries exact and fuzzy alias indices to resolve raw distributor text to canonical master entities with zero ambiguity.'
        };
      case 3:
        return {
          title: 'Stage 3: 4-Tier Taxonomy Classification',
          input: `MPN: "${sampleProduct.mfg_part_num}"\nDescription: "${sampleProduct.part_desc}"`,
          output: `Department: "${sampleProduct.department}"\nCategory Class: "${sampleProduct.category_class}"\nFine Line: "${sampleProduct.fine_line}"\nClasspath: "${sampleProduct.classpath}"`,
          explanation: 'Hierarchically classifies the product into a 4-tier taxonomy structure to enable PIM navigation.'
        };
      case 4:
        return {
          title: 'Stage 4: Attribute Triplets Extraction',
          input: `Raw Specs string: "24-in SS 14 Place Settings 49 dBA OrbitClean"`,
          output: JSON.stringify(sampleProduct.attributes.slice(0, 3), null, 2),
          explanation: 'LLM proposes candidate attribute label, value, and UOM triplets from raw specification text.'
        };
      case 5:
        return {
          title: 'Stage 5: LOV & UOM Validation Engine',
          input: `Proposed attributes: Size: "24 inch", Pressure: "150 pounds"`,
          output: `Validated Size: 24 (UOM: "in") — LOV: ✅ VALID\nValidated Pressure: 150 (UOM: "lb") — UOM: 📐 STANDARDIZED\nPass Rate: 99.4% LOV Compliance`,
          explanation: 'Enforces strict List of Values (LOV) dictionary guardrails and converts arbitrary unit strings to standard UOM codes.'
        };
      case 6:
        return {
          title: 'Stage 6: Targeted Manufacturer Web & PDF Retrieval',
          input: `Manufacturer URL Discovery query: "${sampleProduct.manufacturer_name} ${sampleProduct.mfg_part_num}"`,
          output: `MFR URL: "${sampleProduct.mfr_url}"\nSpecification Sheet PDF: "${sampleProduct.specification_sheet}"\nInstruction Manual PDF: "${sampleProduct.instruction_manual}"`,
          explanation: 'Queries targeted manufacturer web portals and spec sheets (discarding prohibited marketplace sources) to extract verified technical evidence.'
        };
      case 7:
        return {
          title: 'Stage 7: Channel Copy Synthesis',
          input: `Resolved attributes + classification data`,
          output: `Mobile Desc:\n${sampleProduct.mobile_desc}\n\nInvoice Desc:\n${sampleProduct.invoice_desc}`,
          explanation: 'Synthesizes 5 distinct channel-tailored copy formats (Mobile bulleted, Invoice capitalized, Short, Long, Retail).'
        };
      case 8:
        return {
          title: 'Stage 8: Governance & Confidence Scoring',
          input: `Field-level evidence scores across Entity, Classpath, Attributes`,
          output: `Overall Confidence: ${(sampleProduct.confidence.overall_confidence * 100).toFixed(1)}%\nNeeds Human Review: ${sampleProduct.confidence.needs_human_review ? 'YES ⚠️' : 'NO ✅ (Auto-Approved)'}`,
          explanation: 'Calculates weighted confidence score. Items scoring ≥85% auto-approve; items <85% route to the human review queue.'
        };
      default:
        return {
          title: 'Pipeline Processing',
          input: 'Raw Input Row',
          output: 'Enriched Record',
          explanation: 'Standard stage processing.'
        };
    }
  };

  const example = getStageExampleData(selectedStageId);

  return (
    <section id="pipeline" className="pipeline-section">
      <div className="pipeline-section__inner">
        <SectionHeader
          tag="MULTI-AGENT PIPELINE DEEP-DIVE"
          title="The 8-Stage"
          titleAccent="Enrichment Pipeline"
          subtitle="Click any stage below to inspect its operational role and view representative input/output data processed through NEXORA."
        />


        {/* 8-Stage Grid */}
        <div className="pipeline-stages-grid">
          {MOCK_PIPELINE_STAGES.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              isSelected={selectedStageId === stage.id}
              onClick={() => setSelectedStageId(stage.id)}
            />
          ))}
        </div>

        {/* Inspection Panel */}
        <Card className="pipeline-inspection-panel">
          <div className="inspection-header">
            <div className="inspection-title-group">
              <span className="inspection-badge">STAGE 0{selectedStage.id} INSPECTOR</span>
              <h3 className="inspection-title">{selectedStage.icon} {example.title}</h3>
            </div>
            <span className="inspection-status-pill">Active Execution Verified</span>
          </div>

          <p className="inspection-explanation">{example.explanation}</p>

          <div className="inspection-data-comparison">
            <div className="data-box data-box--input">
              <span className="data-box-label">STAGE INPUT DATA</span>
              <pre className="data-box-code">{example.input}</pre>
            </div>
            <div className="data-box data-box--output">
              <span className="data-box-label data-box-label--accent">STAGE ENRICHED OUTPUT</span>
              <pre className="data-box-code">{example.output}</pre>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
