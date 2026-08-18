import os
import sys
import json
import time
import pandas as pd
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.utils.csv_handler import read_input_csv, product_to_delivery_row, DELIVERY_COLUMNS

from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.enrichment_agent import EnrichmentAgent
from src.agents.content_agent import ContentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from evaluation.benchmark_evaluator import MultiLayerComparator, BenchmarkEvaluator
from src.config import INPUT_CSV_PATH, DELIVERY_FORMAT_PATH

def run_200_row_benchmark():
    print("=" * 70)
    print("EXECUTING PROMPT 2 - 200-ROW DATASET BENCHMARK EVALUATION")
    print("=" * 70)


    # 1. Read input dataset
    all_records = read_input_csv(INPUT_CSV_PATH)
    sample_200_records = all_records[:200]
    print(f"Loaded {len(sample_200_records)} input records from {INPUT_CSV_PATH.name}...")

    # 2. Run 8-stage pipeline timing
    start_time = time.time()

    er = EntityResolutionAgent()
    p1 = er.process(sample_200_records)

    ca = ClassificationAgent()
    p2 = ca.process(p1)

    aa = AttributeAgent()
    p3 = aa.process(p2)

    ea = EnrichmentAgent()
    p4 = ea.process(p3)

    c_agent = ContentAgent()
    p5 = c_agent.process(p4)

    va = ValidationAgent()
    p6 = va.process(p5)

    ra = ReviewAgent()
    approved, review = ra.process(p6)

    end_time = time.time()
    total_latency_sec = round(end_time - start_time, 2)
    avg_latency_ms = round((total_latency_sec / len(sample_200_records)) * 1000, 1)

    print(f"Pipeline Execution Complete in {total_latency_sec}s (Avg: {avg_latency_ms} ms/SKU)")
    print(f"Auto-Approved (Score >= 85%): {len(approved)} | Flagged for HITL Review: {len(review)}")

    # 3. Load ground-truth gold reference rows
    gt_df = pd.read_csv(DELIVERY_FORMAT_PATH, dtype=str).fillna("")

    # 4. Multi-layer Comparator Analysis on processed 200 rows
    total_attributes_extracted = sum(len(p.attributes) for p in p6)
    lov_valid_count = sum(sum(1 for a in p.attributes if a.is_lov_valid) for p in p6)
    uom_valid_count = sum(sum(1 for a in p.attributes if a.is_uom_standardized) for p in p6)

    lov_compliance_pct = round((lov_valid_count / max(total_attributes_extracted, 1)) * 100, 1)
    uom_compliance_pct = round((uom_valid_count / max(total_attributes_extracted, 1)) * 100, 1)

    # Evaluate gold-standard matches on ground-truth subset
    smoke_eval = BenchmarkEvaluator.run_benchmark(p6, gt_df, is_smoke_test=False)

    # Calculate per-column completeness across all 200 SKUs
    delivery_rows = [product_to_delivery_row(p) for p in p6]
    df_200 = pd.DataFrame(delivery_rows, columns=DELIVERY_COLUMNS)

    completeness_per_column = {}
    for col in DELIVERY_COLUMNS:
        non_empty = df_200[col].apply(lambda x: 1 if str(x).strip() not in ["", "-- Unbranded --", "-- No Unilog Brand --", "-- No DIB Brand --"] else 0).sum()
        completeness_per_column[col] = round((non_empty / len(df_200)) * 100, 1)

    top_completed_fields = sorted(completeness_per_column.items(), key=lambda x: x[1], reverse=True)[:10]
    sparse_fields = sorted(completeness_per_column.items(), key=lambda x: x[1])[:10]

    report_data = {
        "benchmark_title": "200-Row Dataset Pipeline Benchmark Execution Report",
        "total_skus_processed": len(sample_200_records),
        "total_execution_time_sec": total_latency_sec,
        "avg_latency_ms_per_sku": avg_latency_ms,
        "auto_approved_count": len(approved),
        "human_review_count": len(review),
        "auto_approval_rate_pct": round((len(approved) / len(sample_200_records)) * 100, 1),
        "total_attributes_extracted": total_attributes_extracted,
        "avg_attributes_per_sku": round(total_attributes_extracted / len(sample_200_records), 1),
        "lov_compliance_pct": lov_compliance_pct,
        "uom_compliance_pct": uom_compliance_pct,
        "gold_standard_smoke_eval": smoke_eval,
        "top_completed_fields": top_completed_fields,
        "sparse_fields": sparse_fields
    }

    # Print Report Summary
    print("\n" + "=" * 70)
    print("BENCHMARK METRICS SUMMARY (200 SKUs)")
    print("=" * 70)

    print(f"Total Processed:           {report_data['total_skus_processed']}")
    print(f"Auto-Approved (>=85%):     {report_data['auto_approved_count']} ({report_data['auto_approval_rate_pct']}%)")
    print(f"Flagged for HITL Review:   {report_data['human_review_count']}")
    print(f"Attributes Extracted:      {report_data['total_attributes_extracted']} (Avg: {report_data['avg_attributes_per_sku']}/SKU)")
    print(f"LOV Compliance Rate:       {report_data['lov_compliance_pct']}%")
    print(f"UOM Standardization Rate:  {report_data['uom_compliance_pct']}%")
    print(f"Execution Speed:           {report_data['avg_latency_ms_per_sku']} ms/SKU")
    print("=" * 70)

    with open("scratch/benchmark_200_results.json", "w") as f:
        json.dump(report_data, f, indent=2)

    return report_data

if __name__ == "__main__":
    run_200_row_benchmark()
