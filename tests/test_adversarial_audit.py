import pytest
from src.models.product import RawSKURecord
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from src.engines.source_trust_engine import SourceTrustEngine

def test_attack_1_garbage_sku_abstention_and_hitl_routing():
    """Attack 1: Garbage/nonexistent MPN -> Abstention & HITL Routing."""
    raw = [RawSKURecord(mfg_part_num="GARBAGE-999-XYZ", part_desc="Unknown Nonexistent Item", e1_brand="", unilog_brand="", dib_brand="", part_manuf="")]
    products = EntityResolutionAgent().process(raw)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)
    approved, review = ReviewAgent().process(products)

    assert len(review) == 1
    assert products[0].confidence.overall_confidence < 0.85
    assert products[0].confidence.needs_human_review == True

def test_attack_2_ambiguous_product_without_brand():
    """Attack 2: Ambiguous product description without brand -> Low confidence & HITL Routing."""
    raw = [RawSKURecord(mfg_part_num="999999", part_desc="Widget 50mm", e1_brand="", unilog_brand="", dib_brand="", part_manuf="")]
    products = EntityResolutionAgent().process(raw)
    approved, review = ReviewAgent().process(products)
    assert len(review) == 1
    assert review[0].confidence.overall_confidence < 0.85
    assert review[0].confidence.needs_human_review == True

def test_attack_3_zero_hallucination_on_fake_prompt():
    """Attack 3: Fake brand / hallucinated prompt -> Zero hallucinated attributes."""
    raw = [RawSKURecord(mfg_part_num="FAKE-DRILL-001", part_desc="Super Ultra Cordless Drill 99V", e1_brand="FakeBrand", unilog_brand="FakeBrand", dib_brand="FakeBrand", part_manuf="FakeCorp")]
    products = EntityResolutionAgent().process(raw)
    products = AttributeAgent().process(products)

    # Voltage 99V should be rejected as invalid non-standard voltage
    volt_attrs = [a for a in products[0].attributes if a.label == "Voltage" and a.value == "99V"]
    assert len(volt_attrs) == 0

def test_attack_4_unsupported_attribute_returns_null():
    """Attack 4: Requesting irrelevant attribute (e.g. Voltage on a Saw Blade) -> Null/Abstain."""
    raw = [RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in 24T Saw Blade", e1_brand="Diablo", unilog_brand="", dib_brand="", part_manuf="Freud Inc")]
    products = EntityResolutionAgent().process(raw)
    products = AttributeAgent().process(products)

    volt_attrs = [a for a in products[0].attributes if a.label == "Voltage"]
    assert len(volt_attrs) == 0

def test_attack_5_conflicting_sources_flag_conflict_detected():
    """Attack 5: Conflicting distributor sources -> CONFLICT_DETECTED & HITL routing."""
    res = SourceTrustEngine.resolve_attribute_conflict(
        attr_name="Wattage",
        val1="60W", domain1="homedepot.com", content_type1="html",
        val2="100W", domain2="lowes.com", content_type2="html",
        manufacturer="Philips"
    )
    assert res["conflict_detected"] == True
    assert res["route_to_hitl"] == True

def test_attack_6_similar_mpn_mismatch_prevention():
    """Attack 6: Similar MPN mismatch -> Distinct identity preservation."""
    raw = [
        RawSKURecord(mfg_part_num="DCD771", part_desc="20V Compact Drill", e1_brand="DEWALT", part_manuf="DEWALT"),
        RawSKURecord(mfg_part_num="DCD771C2", part_desc="20V Drill Kit with Batteries", e1_brand="DEWALT", part_manuf="DEWALT")
    ]
    products = EntityResolutionAgent().process(raw)
    assert products[0].mfg_part_num != products[1].mfg_part_num

def test_attack_7_malformed_raw_row_preserves_data_and_flags_validation():
    """Attack 7: Malformed input row (missing description) -> Preserves raw data and flags validation error."""
    raw = [RawSKURecord(mfg_part_num="MALFORMED-999", part_desc="", e1_brand="", unilog_brand="", dib_brand="", part_manuf="")]
    products = EntityResolutionAgent().process(raw)
    products = ValidationAgent().process(products)
    approved, review = ReviewAgent().process(products)

    assert len(review) == 1
    assert review[0].mfg_part_num == "MALFORMED-999"
    assert review[0].confidence.needs_human_review == True


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
