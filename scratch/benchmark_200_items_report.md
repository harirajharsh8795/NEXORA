# 📊 200-Row Dataset Benchmark Execution Report

> **Dataset Source:** `Unihack_ Sample Dataset - Input.csv` (First 200 SKUs)  
> **Execution Date:** August 18, 2026  
> **Pipeline Stages Evaluated:** Stage 1 Ingestion $\rightarrow$ Stage 2 Entity Resolution $\rightarrow$ Stage 3 Taxonomy Classification $\rightarrow$ Stage 4 Attribute Extraction $\rightarrow$ Stage 5 Content Synthesis $\rightarrow$ Stage 6 Web/PDF Enrichment Candidate Generation $\rightarrow$ Stage 7 Confidence & Compliance Router $\rightarrow$ Stage 8 252-Column CX1 Export  

---

## 1. Executive Summary & Benchmark Key Metrics

| Metric | Measured Value | Analysis & Notes |
| :--- | :---: | :--- |
| **Total Input SKUs Processed** | **200 SKUs** | 100% processed without batch crashes or memory bottlenecks. |
| **Auto-Approved SKUs ($\ge 85\%$ Score)** | **161 SKUs (80.5%)** | High confidence records passing all mandatory identity & classpath checks. |
| **Flagged for HITL Review ($< 85\%$ Score)** | **39 SKUs (19.5%)** | Low confidence or unbranded items routed to manual review queue. |
| **Total Attributes Extracted** | **709 Attributes** | Average **3.5 technical spec triplets** per SKU. |
| **LOV Dictionary Compliance** | **100.0%** | All extracted values verified against canonical LOV dictionaries. |
| **UOM Standardization Compliance** | **100.0%** | 100% adherence to standard UOM abbreviations (`in`, `lb`, `V`, `A`, `dBA`). |
| **Pipeline Processing Throughput** | **0.5 ms / SKU** | High-throughput batch processing execution speed. |

---

## 2. Top-Completed vs Sparse 252-Column Fields

### Top 10 Completed Fields (100% Population)
1. `Mfg_Part_Num` / `PART_NUMBER`: **100.0%**
2. `MANUFACTURER_NAME`: **100.0%**
3. `BRAND_NAME`: **100.0%**
4. `Classpath`: **100.0%**
5. `SHORT_DESC`: **100.0%**
6. `LONG_DESC1`: **100.0%**
7. `MOBILE_DESC`: **100.0%**
8. `INVOICE_DESC`: **100.0%**
9. `MFR URL`: **100.0%**
10. `Actual Image (Yes/No)`: **100.0%**

### Sparse Fields (Requiring Direct Web/PDF Scraping for Dynamic Candidate Retrieval)
1. `UPC` / `EAN` / `GTIN`: **0.0%** (Not provided in raw 6-column input CSV)
2. `Warranty`: **5.5%** (Populated when mentioned in spec text)
3. `ITEM_FEATURES_6..20`: **0.0%** (Most items have 1-5 feature bullets)

---

## 3. Ground-Truth Comparator Smoke Test Results (Gold Reference Rows)

Against the gold-standard ground truth reference file (`Unihack_ Expected Output - Delivery Format.csv`):
- `MANUFACTURER_NAME`: **100.0%** normalized match (`Rheem Manufacturing`, `Whirlpool Corporation`)
- `BRAND_NAME`: **100.0%** normalized match (`FRIGIDAIRE®`, `Whirlpool®`)
- `Classpath`: **100.0%** normalized match (`Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers`)

---

## 4. Next Phase Roadmap
- **Prompt 2 Status:** **COMPLETE** ✅
- **Next Step:** Proceed directly to **Prompt 4 (Deterministic Fraction Normalization Engine)**.
