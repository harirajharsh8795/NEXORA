"""
NEXORA Final Failure-Mode Hardening — Comprehensive Regression Test Suite
=========================================================================
Tests A through L covering all failure mode semantics specified in the hardening plan.
"""
import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.models.product import RawSKURecord
from src.models.reason_codes import ReasonCode, BLOCKING_REASON_CODES, has_blocking_reason
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from api.routes import run_pipeline_for_records


# ───────────────────────────────────────────────────────
# TEST A — Missing manufacturer (empty string)
# ───────────────────────────────────────────────────────
def test_a_missing_manufacturer_empty_string():
    """A valid product row with empty manufacturer is UNRESOLVED, NOT malformed."""
    raw = [RawSKURecord(
        mfg_part_num="1515974",
        part_desc="Industrial pipe coupling assembly",
        part_manuf="",
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.mfg_part_num == "1515974"
    assert p.manufacturer_name == "UNKNOWN"
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons
    assert ReasonCode.MALFORMED_INPUT_DATA not in p.confidence.flagged_reasons
    assert p.confidence.needs_human_review is True
    assert p.confidence.manufacturer_confidence == 0.0


# ───────────────────────────────────────────────────────
# TEST B — Null manufacturer
# ───────────────────────────────────────────────────────
def test_b_null_manufacturer():
    """Null manufacturer produces UNRESOLVED_MANUFACTURER_IDENTITY, not MALFORMED."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-NULL-MFR",
        part_desc="High-performance industrial valve",
        part_manuf=None,
        e1_brand=None
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.manufacturer_name == "UNKNOWN"
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons
    assert ReasonCode.MALFORMED_INPUT_DATA not in p.confidence.flagged_reasons
    assert p.confidence.needs_human_review is True


# ───────────────────────────────────────────────────────
# TEST C — Unknown manufacturer string
# ───────────────────────────────────────────────────────
def test_c_unknown_manufacturer_string():
    """Manufacturer = 'UNKNOWN' produces unresolved identity, not fabricated resolution."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-UNK-MFR",
        part_desc="Standard copper fitting 3/4 in",
        part_manuf="UNKNOWN",
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.manufacturer_name == "UNKNOWN"
    assert p.confidence.manufacturer_confidence == 0.0
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons
    assert p.confidence.needs_human_review is True


# ───────────────────────────────────────────────────────
# TEST D — Ambiguous manufacturer (fuzzy match should not pick arbitrarily)
# ───────────────────────────────────────────────────────
def test_d_ambiguous_manufacturer():
    """An unrecognized manufacturer that doesn't match any master entry should remain unresolved."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-AMBIG-001",
        part_desc="Universal industrial component",
        part_manuf="Fictional Nonexistent Corp",
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    # Fuzzy matcher should return UNKNOWN for completely fictional manufacturer
    assert p.manufacturer_name == "UNKNOWN"
    assert p.confidence.needs_human_review is True
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons


# ───────────────────────────────────────────────────────
# TEST E — Empty description
# ───────────────────────────────────────────────────────
def test_e_empty_description():
    """Empty description is detected with MISSING_DESCRIPTION reason code."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-EMPTY-DESC",
        part_desc="",
        part_manuf="",
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.confidence.needs_human_review is True
    assert ReasonCode.MISSING_DESCRIPTION in p.confidence.flagged_reasons


# ───────────────────────────────────────────────────────
# TEST F — Whitespace-only description
# ───────────────────────────────────────────────────────
def test_f_whitespace_description():
    """Whitespace-only description is treated as missing."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-WS-DESC",
        part_desc="     ",
        part_manuf="Demo Manufacturer",
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.confidence.needs_human_review is True
    assert ReasonCode.MISSING_DESCRIPTION in p.confidence.flagged_reasons


# ───────────────────────────────────────────────────────
# TEST G — Completely malformed record
# ───────────────────────────────────────────────────────
def test_g_malformed_input():
    """A record with 'MALFORMED' in MPN gets MALFORMED_INPUT_DATA, proving it's a separate code."""
    raw = [RawSKURecord(
        mfg_part_num="MALFORMED-TEST-999",
        part_desc="Corrupted line item data",
        part_manuf="MALFORMED-TEST-999",
        e1_brand="Garbage"
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    assert p.confidence.needs_human_review is True
    assert ReasonCode.MALFORMED_INPUT_DATA in p.confidence.flagged_reasons
    # This PROVES malformed and unresolved are separate semantic states
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons


# ───────────────────────────────────────────────────────
# TEST H — Strong attributes but unresolved manufacturer
# ───────────────────────────────────────────────────────
def test_h_strong_attributes_unresolved_manufacturer():
    """High attribute confidence must NOT override unresolved manufacturer to allow auto-approval."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-STRONG-ATTRS",
        part_desc="7-1/4 in 24T circular saw blade carbide tipped",
        part_manuf="",   # No manufacturer
        e1_brand=""
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    # Attributes should be extracted (strong description)
    assert len(p.attributes) > 0
    # But manufacturer is unresolved
    assert p.manufacturer_name == "UNKNOWN"
    assert p.confidence.manufacturer_confidence == 0.0
    # MUST be routed to HITL — NOT auto-approved
    assert p.confidence.needs_human_review is True
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in p.confidence.flagged_reasons


# ───────────────────────────────────────────────────────
# TEST I — Valid manufacturer with trusted evidence
# ───────────────────────────────────────────────────────
def test_i_valid_manufacturer_trusted_evidence():
    """Valid manufacturer resolves normally with appropriate evidence and confidence."""
    raw = [RawSKURecord(
        mfg_part_num="D0724A",
        part_desc="7-1/4 in 24T Saw Blade",
        part_manuf="Freud Inc",
        e1_brand="Diablo"
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    # Manufacturer should be resolved (not UNKNOWN)
    assert p.manufacturer_name != "UNKNOWN"
    assert p.confidence.manufacturer_confidence > 0.0
    # Evidence should exist for manufacturer
    mfr_evidence = p.evidence_graph.evidences.get("MANUFACTURER_NAME")
    assert mfr_evidence is not None
    assert mfr_evidence.value is not None
    assert mfr_evidence.source_type != "unresolved"


# ───────────────────────────────────────────────────────
# TEST J — Marketplace-only manufacturer evidence
# ───────────────────────────────────────────────────────
def test_j_marketplace_evidence_rejected():
    """Marketplace sources (Amazon, eBay) must be rejected by the source trust engine."""
    from src.engines.source_trust_engine import SourceTrustEngine, SourceTier

    tier_amazon = SourceTrustEngine.classify_source_tier("amazon.com", "html", "Freud Inc")
    assert tier_amazon == SourceTier.EXCLUDED

    tier_ebay = SourceTrustEngine.classify_source_tier("ebay.com", "html", "Freud Inc")
    assert tier_ebay == SourceTier.EXCLUDED


# ───────────────────────────────────────────────────────
# TEST K — Conflicting trusted sources
# ───────────────────────────────────────────────────────
def test_k_conflicting_trusted_sources():
    """Conflicting trusted sources must produce SOURCE_CONFLICT and route to HITL."""
    from src.engines.source_trust_engine import SourceTrustEngine

    res = SourceTrustEngine.resolve_attribute_conflict(
        attr_name="Wattage",
        val1="60W", domain1="freudtools.com", content_type1="html",
        val2="100W", domain2="diablotools.com", content_type2="html",
        manufacturer="Freud Inc"
    )
    assert res["conflict_detected"] is True
    assert res["route_to_hitl"] is True


# ───────────────────────────────────────────────────────
# TEST L — Valid unbranded product
# ───────────────────────────────────────────────────────
def test_l_unbranded_product_no_fabrication():
    """'-- Unbranded --' input must not result in a fabricated brand name."""
    raw = [RawSKURecord(
        mfg_part_num="TEST-UNBRAND-001",
        part_desc="3/4 in copper pipe elbow fitting",
        part_manuf="Unknown Vendor",
        e1_brand="-- Unbranded --"
    )]
    products = run_pipeline_for_records(raw)
    p = products[0]

    # Brand should NOT be a fabricated famous brand name
    # It can be the manufacturer name (UNKNOWN), the raw brand cleaned, or similar
    # But it must NOT be a hallucinated well-known brand
    well_known_brands = ["Milwaukee", "DEWALT", "Makita", "Bosch", "Freud", "Diablo"]
    for brand in well_known_brands:
        assert brand not in p.brand_name, f"Brand '{p.brand_name}' was fabricated from unbranded input!"


# ───────────────────────────────────────────────────────
# BLOCKING REASON CODE SYSTEM TESTS
# ───────────────────────────────────────────────────────
def test_blocking_reason_codes_set():
    """Verify the blocking reason codes set contains all required codes."""
    assert ReasonCode.MALFORMED_INPUT_DATA in BLOCKING_REASON_CODES
    assert ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY in BLOCKING_REASON_CODES
    assert ReasonCode.UNRESOLVED_BRAND_IDENTITY in BLOCKING_REASON_CODES
    assert ReasonCode.NO_TRUSTED_SOURCE in BLOCKING_REASON_CODES
    assert ReasonCode.SOURCE_CONFLICT in BLOCKING_REASON_CODES


def test_has_blocking_reason_helper():
    """Verify the has_blocking_reason helper correctly detects blocking codes."""
    assert has_blocking_reason([ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY]) is True
    assert has_blocking_reason([ReasonCode.MALFORMED_INPUT_DATA]) is True
    assert has_blocking_reason(["OVERALL_SCORE_BELOW_THRESHOLD: test"]) is False
    assert has_blocking_reason([]) is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
