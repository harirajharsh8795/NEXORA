import os
import pandas as pd
import pytest
from evaluation.benchmark_evaluator import MultiLayerComparator, BenchmarkEvaluator
from src.config import DELIVERY_FORMAT_PATH, INPUT_CSV_PATH
from src.utils.csv_handler import read_input_csv
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.enrichment_agent import EnrichmentAgent
from src.agents.content_agent import ContentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent

def test_multilayer_comparator_layers():
    """Verifies all 7 comparison layers of MultiLayerComparator."""
    # Layer A: Exact match
    assert MultiLayerComparator.layer_a_exact_match("Brass", "Brass") == True
    assert MultiLayerComparator.layer_a_exact_match("Brass", "brass") == False

    # Layer B: Case-insensitive
    assert MultiLayerComparator.layer_b_case_insensitive("Brass", "brass") == True
    assert MultiLayerComparator.layer_b_case_insensitive("FRIGIDAIRE®", "frigidaire") == False

    # Layer C: Whitespace-normalized
    assert MultiLayerComparator.layer_c_whitespace_normalized(" 24   in ", "24 in") == True

    # Layer D: UOM-normalized
    assert MultiLayerComparator.layer_d_uom_normalized("24\"", "24 in") == True
    assert MultiLayerComparator.layer_d_uom_normalized("150#", "150 lb") == True
    assert MultiLayerComparator.layer_d_uom_normalized("FRIGIDAIRE®", "FRIGIDAIRE") == True

    # Layer E: Fraction-normalized
    assert MultiLayerComparator.layer_e_fraction_normalized("50.25 in", "50-1/4 in") == True
    assert MultiLayerComparator.layer_e_fraction_normalized("0.5", "1/2") == True

    # Layer F: Numeric tolerance
    assert MultiLayerComparator.layer_f_numeric_tolerance("120.1 V", "120 V", tolerance_pct=0.5) == True

    # Layer G: Null correctness
    assert MultiLayerComparator.layer_g_null_correctness("", "-- Unbranded --") == True
    assert MultiLayerComparator.layer_g_null_correctness(None, "") == True
    assert MultiLayerComparator.layer_g_null_correctness("Diablo", "") == False

def test_benchmark_evaluator_smoke_test():
    """Runs comparator smoke test against available 2 gold-standard rows."""
    gt_df = pd.read_csv(DELIVERY_FORMAT_PATH, dtype=str).fillna("")
    assert len(gt_df) == 2

    records = read_input_csv(INPUT_CSV_PATH)
    # Take matching 2 sample records
    gt_mpns = [str(r.get("Mfg_Part_Num")).strip().lower() for _, r in gt_df.iterrows()]
    sample_records = [r for r in records if r.mfg_part_num.lower() in gt_mpns]

    # Run through pipeline
    products = EntityResolutionAgent().process(sample_records)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)
    products = EnrichmentAgent().process(products)
    products = ContentAgent().process(products)
    products = ValidationAgent().process(products)
    approved, review = ReviewAgent().process(products)

    # Evaluate
    results = BenchmarkEvaluator.run_benchmark(products, gt_df, is_smoke_test=True)

    assert results["status"] == "SUCCESS"
    assert results["is_smoke_test"] == True
    assert results["total_ground_truth_rows"] == 2
    assert results["matched_prediction_rows"] == 2
    assert results["per_column_metrics"]["MANUFACTURER_NAME"]["normalized_match_pct"] == 100.0
    assert results["per_column_metrics"]["BRAND_NAME"]["normalized_match_pct"] == 100.0
    assert results["overall_normalized_match_pct"] > 0.0

def test_prompt2_readiness_audit():
    """Verifies that BenchmarkEvaluator checklist is 100% READY for the 200-row dataset."""
    audit = BenchmarkEvaluator.audit_prompt2_readiness()
    assert audit["comparator_readiness"] == "READY"
    assert audit["benchmark_status"].startswith("PENDING DATASET")
    assert audit["smoke_test_status"].startswith("PASS")
    assert len(audit["checklist"]) == 13
    for k, v in audit["checklist"].items():
        assert "READY" in v


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

