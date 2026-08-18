import os
import sys
import json
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.models.product import RawSKURecord
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.enrichment_agent import EnrichmentAgent
from src.agents.content_agent import ContentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from src.engines.unilog_rule_engine import UnilogRuleEngine
from src.engines.fraction_engine import FractionNormalizationEngine
from src.engines.source_trust_engine import SourceTrustEngine
from src.utils.csv_handler import product_to_delivery_row, DELIVERY_COLUMNS

def run_final_pre_submission_forensic_audit():
    print("=" * 75)
    print("EXECUTING FINAL PRE-SUBMISSION FORENSIC AUDIT (NEXORA AI)")
    print("=" * 75)

    rule_engine = UnilogRuleEngine()
    frac_engine = FractionNormalizationEngine()

    audit_checks = []
    passed_count = 0

    def check(name: str, passed: bool, evidence: str):
        nonlocal passed_count
        if passed:
            passed_count += 1
        audit_checks.append({
            "check_name": name,
            "passed": passed,
            "status": "VERIFIED" if passed else "FAILED",
            "evidence": evidence
        })
        status_str = "[PASS] VERIFIED" if passed else "[FAIL] FAILED"
        print(f"Check {len(audit_checks):02d}: {name:<52} -> {status_str}")

    # 1. Dynamic Evaluator SKU Ingestion
    try:
        raw = [RawSKURecord(mfg_part_num="AUDIT-DEWALT-001", part_desc="20V Cordless Hammer Drill 1/2 in", e1_brand="DEWALT", part_manuf="DEWALT")]
        p = EntityResolutionAgent().process(raw)[0]
        passed = p.mfg_part_num == "AUDIT-DEWALT-001" and p.mfg_part_num != "D0724A"
        check("1. Dynamic Evaluator SKU Ingestion", passed, f"Dynamically ingested unseen SKU: '{p.mfg_part_num}'")
    except Exception as e:
        check("1. Dynamic Evaluator SKU Ingestion", False, str(e))

    # 2. Taxonomy Classification Hierarchy
    try:
        raw = [RawSKURecord(mfg_part_num="AUDIT-DIABLO-001", part_desc="7-1/4 in 24T Framing Circular Saw Blade", e1_brand="Diablo", part_manuf="Freud Inc")]
        p = ClassificationAgent().process(EntityResolutionAgent().process(raw))[0]
        passed = p.department != "" and p.category_class != "" and p.classpath != ""
        check("2. Taxonomy Classification Hierarchy", passed, f"Taxonomy assigned: '{p.classpath}'")
    except Exception as e:
        check("2. Taxonomy Classification Hierarchy", False, str(e))




    # 3. Attribute Extraction & Zero-LLM Fraction Conversion
    try:
        raw = [RawSKURecord(mfg_part_num="AUDIT-DEWALT-001", part_desc="20V Cordless Hammer Drill 50.25 in", e1_brand="DEWALT", part_manuf="DEWALT")]
        p = AttributeAgent().process(ClassificationAgent().process(EntityResolutionAgent().process(raw)))[0]
        norm_len = frac_engine.normalize_measurement("50.25 in", uom="in")
        passed = norm_len == "50-1/4 in"
        check("3. Zero-LLM Fraction Normalization", passed, f"Converted '50.25 in' -> '{norm_len}'")
    except Exception as e:
        check("3. Zero-LLM Fraction Normalization", False, str(e))

    # 4. Prohibited Marketplace Discard (Amazon/eBay)
    try:
        t_amazon = SourceTrustEngine.classify_source_tier("amazon.com", "html", "DEWALT")
        t_ebay = SourceTrustEngine.classify_source_tier("ebay.com", "html", "DEWALT")
        passed = t_amazon == 99 and t_ebay == 99
        check("4. Prohibited Source Discard (Amazon/eBay)", passed, "Discarded Amazon/eBay content as Tier 99 EXCLUDED")
    except Exception as e:
        check("4. Prohibited Source Discard (Amazon/eBay)", False, str(e))

    # 5. Source Conflict Detection & HITL Routing
    try:
        res = SourceTrustEngine.resolve_attribute_conflict("Voltage", "18V", "homedepot.com", "html", "20V", "lowes.com", "html", "DEWALT")
        passed = res["conflict_detected"] == True and res["route_to_hitl"] == True
        check("5. Source Conflict Detection & HITL Routing", passed, "Flagged CONFLICT_DETECTED and routed to HITL queue")
    except Exception as e:
        check("5. Source Conflict Detection & HITL Routing", False, str(e))

    # 6. Unilog Rule Engine Compliance (UOM, Casing, Trademarks)
    try:
        inv, brand = rule_engine.enforce_casing("hammer drill 20v sst", "dewalt")
        uom_norm = rule_engine.normalize_uom("lbs")
        passed = inv == "HAMMER DRILL 20V SST" and brand.startswith("DEWALT") and uom_norm == "lb"
        check("6. Unilog Rule Engine Compliance", passed, f"Casing & UOM: '{inv}', '{brand}', '{uom_norm}'")
    except Exception as e:
        check("6. Unilog Rule Engine Compliance", False, str(e))

    # 7. Explainable Field-Level Confidence & Reason Codes
    try:
        raw = [RawSKURecord(mfg_part_num="AUDIT-UNBRANDED-01", part_desc="Generic Fitting 50mm", e1_brand="", part_manuf="")]
        p = AttributeAgent().process(ClassificationAgent().process(EntityResolutionAgent().process(raw)))
        approved, review = ReviewAgent().process(p)
        passed = len(review) == 1 and "field_scores" in review[0].confidence.__dict__ and len(review[0].confidence.flagged_reasons) > 0
        check("7. Explainable Field-Level Confidence", passed, f"Reason code generated: '{review[0].confidence.flagged_reasons[0]}'")
    except Exception as e:
        check("7. Explainable Field-Level Confidence", False, str(e))

    # 8. Exact 252-Column CX1 Delivery Format CSV Header Integrity
    try:
        raw = [RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in 24T Saw Blade", e1_brand="Diablo", part_manuf="Freud Inc")]
        p = AttributeAgent().process(ClassificationAgent().process(EntityResolutionAgent().process(raw)))[0]
        row_dict = product_to_delivery_row(p)
        passed = len(DELIVERY_COLUMNS) == 252 and len(row_dict) == 252
        check("8. Exact 252-Column CSV Header Integrity", passed, f"Exact header count: {len(DELIVERY_COLUMNS)}")
    except Exception as e:
        check("8. Exact 252-Column CSV Header Integrity", False, str(e))

    # 9. Evidence Graph Grounding Integrity
    try:
        raw = [RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in 24T Blade", e1_brand="Diablo", part_manuf="Freud Inc")]
        p = EnrichmentAgent().process(EntityResolutionAgent().process(raw))[0]
        passed = p.evidence_graph is not None
        check("9. Evidence Graph Grounding Integrity", passed, f"Evidence graph initialized successfully")
    except Exception as e:
        check("9. Evidence Graph Grounding Integrity", False, str(e))

    # 10. Malformed Row Isolation & Non-Crash Guarantee
    try:
        raw = [RawSKURecord(mfg_part_num="MALFORMED-01", part_desc="", e1_brand="", part_manuf="")]
        p = ValidationAgent().process(EntityResolutionAgent().process(raw))
        approved, review = ReviewAgent().process(p)
        passed = len(review) == 1 and review[0].confidence.needs_human_review == True
        check("10. Malformed Row Isolation", passed, "Isolated malformed row without batch crash")
    except Exception as e:
        check("10. Malformed Row Isolation", False, str(e))

    audit_score = round((passed_count / len(audit_checks)) * 100, 1)

    print("\n" + "=" * 75)
    print("FINAL PRE-SUBMISSION FORENSIC AUDIT RESULTS")
    print("=" * 75)
    print(f"Total Forensic Audit Checks: {len(audit_checks)}")
    print(f"Checks Passed:               {passed_count} / {len(audit_checks)}")
    print(f"Checks Failed:               {len(audit_checks) - passed_count}")
    print(f"FINAL AUDIT SCORE:           {audit_score} / 100.0")
    print("=" * 75)

    report = {
        "title": "Final Pre-Submission Forensic Audit Report",
        "total_checks": len(audit_checks),
        "passed_checks": passed_count,
        "failed_checks": len(audit_checks) - passed_count,
        "audit_score": audit_score,
        "check_details": audit_checks
    }

    with open("scratch/final_pre_submission_forensic_audit_results.json", "w") as f:
        json.dump(report, f, indent=2)

    return report

if __name__ == "__main__":
    run_final_pre_submission_forensic_audit()
