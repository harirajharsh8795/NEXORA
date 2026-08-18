import os
import sys
import pytest

sys.path.insert(0, os.path.abspath("."))

from scratch.run_200_ground_truth_benchmark import run_200_sku_ground_truth_benchmark

def test_200_sku_ground_truth_benchmark_execution():
    """Verifies that the 200-SKU ground truth benchmark runs cleanly and generates report."""
    run_200_sku_ground_truth_benchmark()
    report_path = os.path.join("scratch", "ground_truth_200_benchmark_results.md")
    assert os.path.exists(report_path), "Ground truth benchmark report file missing"
    
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    assert "95.00%" in content or "VERIFIED" in content
    assert "Manufacturer Entity Resolution" in content
