import os
import sys
import json
import time
import psutil
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
from src.config import INPUT_CSV_PATH

def run_1000_sku_scale_benchmark():
    print("=" * 70)
    print("EXECUTING PROMPT 9 - 1,000-SKU SCALE BENCHMARK TEST")
    print("=" * 70)

    # Measure initial memory
    process = psutil.Process(os.getpid())
    mem_before_mb = process.memory_info().rss / (1024 * 1024)

    # 1. Load full 1,000 SKU raw input dataset
    all_records = read_input_csv(INPUT_CSV_PATH)
    total_skus = len(all_records)
    print(f"Loaded {total_skus} raw input records from {INPUT_CSV_PATH.name}...")

    # 2. Wall-clock timing of full pipeline execution
    start_wall_time = time.perf_counter()

    t0 = time.perf_counter()
    p1 = EntityResolutionAgent().process(all_records)
    t_er = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    p2 = ClassificationAgent().process(p1)
    t_class = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    p3 = AttributeAgent().process(p2)
    t_attr = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    p4 = EnrichmentAgent().process(p3)
    t_enrich = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    p5 = ContentAgent().process(p4)
    t_content = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    p6 = ValidationAgent().process(p5)
    t_val = round((time.perf_counter() - t0) * 1000, 2)

    t0 = time.perf_counter()
    approved, review = ReviewAgent().process(p6)
    t_review = round((time.perf_counter() - t0) * 1000, 2)

    end_wall_time = time.perf_counter()
    total_wall_time_sec = round(end_wall_time - start_wall_time, 3)

    # Measure peak memory
    mem_after_mb = process.memory_info().rss / (1024 * 1024)
    mem_delta_mb = round(mem_after_mb - mem_before_mb, 2)

    # Throughput and Latency Metrics
    throughput_skus_per_sec = round(total_skus / max(total_wall_time_sec, 0.001), 1)
    avg_latency_ms_per_sku = round((total_wall_time_sec / total_skus) * 1000, 3)

    # Data Density & Compliance Metrics across 1,000 SKUs
    total_attributes = sum(len(p.attributes) for p in p6)
    lov_valid_count = sum(sum(1 for a in p.attributes if a.is_lov_valid) for p in p6)
    uom_valid_count = sum(sum(1 for a in p.attributes if a.is_uom_standardized) for p in p6)

    auto_approval_rate_pct = round((len(approved) / total_skus) * 100, 1)
    hitl_review_rate_pct = round((len(review) / total_skus) * 100, 1)
    lov_compliance_pct = round((lov_valid_count / max(total_attributes, 1)) * 100, 1)
    uom_compliance_pct = round((uom_valid_count / max(total_attributes, 1)) * 100, 1)

    # Stage Latency Breakdown
    stage_latencies_ms = {
        "1_Entity_Resolution": t_er,
        "2_Classification": t_class,
        "3_Attribute_Extraction": t_attr,
        "4_Enrichment_Candidate_Gen": t_enrich,
        "5_Content_Synthesis": t_content,
        "6_Validation": t_val,
        "7_Review_Routing": t_review
    }

    report_data = {
        "benchmark_title": "1,000-SKU Full Scale Pipeline Benchmark Report",
        "total_skus_processed": total_skus,
        "wall_clock_time_sec": total_wall_time_sec,
        "throughput_skus_per_sec": throughput_skus_per_sec,
        "avg_in_memory_latency_ms_per_sku": avg_latency_ms_per_sku,
        "peak_ram_delta_mb": mem_delta_mb,
        "auto_approved_count": len(approved),
        "hitl_review_count": len(review),
        "auto_approval_rate_pct": auto_approval_rate_pct,
        "hitl_review_rate_pct": hitl_review_rate_pct,
        "total_attributes_extracted": total_attributes,
        "avg_attributes_per_sku": round(total_attributes / total_skus, 2),
        "lov_compliance_pct": lov_compliance_pct,
        "uom_compliance_pct": uom_compliance_pct,
        "stage_latencies_ms": stage_latencies_ms,
        "critical_distinction_note": "1,000 rows processed in-memory through deterministic multi-agent pipeline. Live web/PDF scraping is invoked dynamically per unseen SKU on-demand to avoid rate-limiting wall-clock stalls during 1k batch runs."
    }

    print("\n" + "=" * 70)
    print("1,000-SKU SCALE BENCHMARK RESULTS")
    print("=" * 70)
    print(f"Total SKUs Processed:       {total_skus} SKUs")
    print(f"Total Wall-Clock Time:      {total_wall_time_sec} seconds")
    print(f"Throughput Speed:           {throughput_skus_per_sec} SKUs / sec")
    print(f"Avg In-Memory Latency:      {avg_latency_ms_per_sku} ms / SKU")
    print(f"Peak Memory Footprint:      +{mem_delta_mb} MB")
    print(f"Auto-Approved Rate:         {len(approved)} / {total_skus} ({auto_approval_rate_pct}%)")
    print(f"HITL Review Rate:           {len(review)} / {total_skus} ({hitl_review_rate_pct}%)")
    print(f"Attributes Extracted:      {total_attributes} (Avg: {report_data['avg_attributes_per_sku']}/SKU)")
    print(f"LOV Compliance Rate:       {lov_compliance_pct}%")
    print(f"UOM Standardization Rate:  {uom_compliance_pct}%")
    print("=" * 70)

    with open("scratch/scale_benchmark_1000_results.json", "w") as f:
        json.dump(report_data, f, indent=2)

    return report_data

if __name__ == "__main__":
    run_1000_sku_scale_benchmark()
