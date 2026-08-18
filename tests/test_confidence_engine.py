import pytest
from src.models.product import RawSKURecord
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.review_agent import ReviewAgent

def test_high_confidence_auto_approval():
    """Verifies that high confidence products pass auto-approval and contain detailed field scores."""
    raw = [RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in 24T Saw Blade", e1_brand="Diablo", part_manuf="Freud Inc")]
    products = EntityResolutionAgent().process(raw)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)
    approved, review = ReviewAgent().process(products)

    assert len(approved) == 1
    p = approved[0]
    assert p.confidence.overall_confidence >= 0.85
    assert p.confidence.needs_human_review == False
    assert "MANUFACTURER_NAME" in p.confidence.field_scores
    assert "BRAND_NAME" in p.confidence.field_scores
    assert p.confidence.field_scores["BRAND_NAME"] >= 0.85

def test_low_confidence_explainable_hitl_reasons():
    """Verifies that low confidence products generate explainable HITL routing reason codes."""
    raw = [RawSKURecord(mfg_part_num="UNKNOWN-999", part_desc="Widget Part 50mm", e1_brand="", part_manuf="")]
    products = EntityResolutionAgent().process(raw)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)
    approved, review = ReviewAgent().process(products)

    assert len(review) == 1
    p = review[0]
    assert p.confidence.overall_confidence < 0.85
    assert p.confidence.needs_human_review == True
    assert len(p.confidence.flagged_reasons) > 0
    
    # Check that explainable reason codes are present
    reasons_str = " ".join(p.confidence.flagged_reasons)
    assert any(code in reasons_str for code in ["LOW_MANUFACTURER_CONFIDENCE", "UNBRANDED_CATALOG_ITEM", "OVERALL_SCORE_BELOW_THRESHOLD"])

def test_field_scores_dictionary_population():
    """Verifies that field_scores dictionary contains exact per-field confidence metrics."""
    raw = [RawSKURecord(mfg_part_num="DCD771C2", part_desc="DEWALT 20V Drill Kit", e1_brand="DEWALT", part_manuf="DEWALT")]
    products = EntityResolutionAgent().process(raw)
    products = AttributeAgent().process(products)
    approved, review = ReviewAgent().process(products)

    p = products[0]
    scores = p.confidence.field_scores
    assert "MANUFACTURER_NAME" in scores
    assert "BRAND_NAME" in scores
    assert "Classpath" in scores
    assert "ATTRIBUTES_AVG" in scores
    assert 0.0 <= scores["MANUFACTURER_NAME"] <= 1.0

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
