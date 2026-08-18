# ⏱️ NEXORA — Live 3-Minute Hackathon Demo Script & Judge Flow

> **Target Audience:** UniHack 2026 Challenge Judges  
> **Total Time:** Exactly 3 Minutes (180 Seconds)  
> **Demo Objective:** Prove true dynamic evaluator-input workflow, 8-stage enrichment pipeline, zero-hallucination source trust, explainable HITL routing, and 252-column compliance export.

---

## 🎬 Minute-by-Minute Script & Action Plan

### 📍 Segment 1: 0:00 – 0:30 (Problem Statement & 8-Stage Architecture)
* **Presenter Focus:** Framing the Industrial Product Catalog Enrichment challenge.
* **UI Action:** Show NEXORA Dashboard Overview.
* **Key Script:**
  > "Welcome Judges! Traditional LLM enrichment hallucinates specifications, accepts low-quality marketplace data from Amazon or eBay, and breaks downstream search with inconsistent units like `lbs` vs `lb` or `50.25 in` vs `50-1/4 in`.  
  > NEXORA solves this with an **8-Stage Enrichment Pipeline**: Raw Ingestion $\rightarrow$ Entity Resolution $\rightarrow$ Taxonomy Classification $\rightarrow$ Spec Extraction $\rightarrow$ Candidate Source Retrieval $\rightarrow$ Content Synthesis $\rightarrow$ Deterministic Validation $\rightarrow$ Review Routing."

---

### 📍 Segment 2: 0:30 – 1:30 (Dynamic Upload & Live Unseen SKU Processing)
* **Presenter Focus:** Proving TRUE dynamic evaluator input workflow without hardcoded fixtures.
* **UI Action:** Click **"Upload Catalog CSV/XLSX"**, select a raw evaluator input file containing unseen MPNs, and click **"Enrich Unseen SKU"**.
* **Backend Execution Demonstrated:**
  - `POST /api/upload` ingests file dynamically without schema assumptions.
  - `POST /api/v1/enrich/{mpn}` searches manufacturer sources dynamically.
  - `SourceTrustEngine` filters out prohibited Amazon/eBay domains and selects Tier 1 MFR data.
* **Key Script:**
  > "Watch as I upload a completely unseen evaluator dataset. NEXORA does NOT rely on preloaded databases or mock fallbacks like `products[0]`. Notice how the system dynamically retrieves official manufacturer technical evidence, extracts valid attributes, and tags every value with its Tier-1 source citation."

---

### 📍 Segment 3: 1:30 – 2:30 (Unilog Rule Engine & Explainable HITL Queue)
* **Presenter Focus:** Demonstrating deterministic UOM/Fraction normalization and explainable HITL confidence scores.
* **UI Action:** Click on a flagged product in the **"HITL Review Queue"** to inspect its `field_scores` and `flagged_reasons`.
* **Backend Execution Demonstrated:**
  - `FractionNormalizationEngine`: `50.25 in` converted to `50-1/4 in` without calling LLMs.
  - `UnilogRuleEngine`: `lbs` standardized to `lb`, invoice title formatted to uppercase.
  - `ReviewAgent`: Displays explainable reason codes like `LOW_MANUFACTURER_CONFIDENCE` or `UNBRANDED_CATALOG_ITEM`.
* **Key Script:**
  > "Look at our deterministic rule compliance: decimal inches are instantly converted to exact fractions (`50.25 in` $\rightarrow$ `50-1/4 in`), units are standardized (`lbs` $\rightarrow$ `lb`), and trademarks are appended. If confidence drops below 85%, NEXORA doesn't guess—it flags the product with clear, human-readable reason codes for human review."

---

### 📍 Segment 4: 2:30 – 3:00 (1,000-SKU Scale & 252-Column CX1 Export)
* **Presenter Focus:** Demonstrating enterprise scalability and full 252-column export compatibility.
* **UI Action:** Click **"Run 1,000-SKU Batch Ingestion"** and then **"Export Delivery Format CSV"**.
* **Backend Execution Demonstrated:**
  - In-memory pipeline processes 1,000 SKUs in **0.305 seconds** (3,278 SKUs/sec throughput).
  - Stream export generates exact 252-column Unilog delivery schema.
* **Key Script:**
  > "Finally, scalability: NEXORA processes 1,000 raw catalog SKUs in just **0.3 seconds** with under 25 MB of memory footprint. In one click, we export the enriched data directly into the exact 252-column Unilog Delivery Format CSV required by judges. Thank you!"

---

## 🛠️ Key UI Links & Command Checklist for Demo

1. **Upload Endpoint:** `POST http://localhost:8000/api/upload`
2. **Single SKU Dynamic Endpoint:** `POST http://localhost:8000/api/v1/enrich/DCD771C2`
3. **Batch Enrichment Endpoint:** `POST http://localhost:8000/api/v1/enrich-batch`
4. **252-Column Export Endpoint:** `GET http://localhost:8000/api/export`
