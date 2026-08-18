import pytest
from src.engines.source_trust_engine import SourceTrustEngine, SourceTier

def test_source_tier_classification():
    """Verifies classification of source URLs into 4 tiers and EXCLUDED."""
    # Tier 1: Manufacturer PDF
    assert SourceTrustEngine.classify_source_tier("frigidaire.com", "pdf", "Frigidaire") == SourceTier.TIER_1_PDF_DATASHEET

    # Tier 2: Manufacturer Product Web Page
    assert SourceTrustEngine.classify_source_tier("frigidaire.com", "html", "Frigidaire") == SourceTier.TIER_2_MFR_WEBSITE

    # Tier 3: Authorized Distributor
    assert SourceTrustEngine.classify_source_tier("homedepot.com", "html", "Frigidaire") == SourceTier.TIER_3_DISTRIBUTOR
    assert SourceTrustEngine.classify_source_tier("grainger.com", "html", "Frigidaire") == SourceTier.TIER_3_DISTRIBUTOR

    # Tier 4: Generic Web
    assert SourceTrustEngine.classify_source_tier("some-blog.com", "html", "Frigidaire") == SourceTier.TIER_4_GENERIC_WEB

    # EXCLUDED: Prohibited Marketplaces
    assert SourceTrustEngine.classify_source_tier("amazon.com", "html", "Frigidaire") == SourceTier.EXCLUDED
    assert SourceTrustEngine.classify_source_tier("ebay.com", "html", "Frigidaire") == SourceTier.EXCLUDED

def test_prohibited_marketplace_discard():
    """Verifies that Amazon/eBay sources are automatically discarded in conflicts."""
    res = SourceTrustEngine.resolve_attribute_conflict(
        attr_name="Voltage",
        val1="120V", domain1="amazon.com", content_type1="html",
        val2="240V", domain2="frigidaire.com", content_type2="html",
        manufacturer="Frigidaire"
    )
    assert res["conflict_detected"] == False
    assert res["resolved_value"] == "240V"
    assert res["winner_domain"] == "frigidaire.com"
    assert res["resolution_reason"] == "EXCLUDED_SOURCE_DISCARDED"

def test_higher_tier_override():
    """Verifies that Tier 1 MFR PDF overrides Tier 3 Distributor value."""
    res = SourceTrustEngine.resolve_attribute_conflict(
        attr_name="Decibels",
        val1="47 dBA", domain1="frigidaire.com", content_type1="pdf",
        val2="52 dBA", domain2="homedepot.com", content_type2="html",
        manufacturer="Frigidaire"
    )
    assert res["conflict_detected"] == False
    assert res["resolved_value"] == "47 dBA"
    assert res["winner_domain"] == "frigidaire.com"
    assert "TIER_1_OVERRIDE_TIER_3" in res["resolution_reason"]

def test_same_tier_conflict_routes_to_hitl():
    """Verifies that equal tier sources with conflicting values trigger CONFLICT_DETECTED and HITL routing."""
    res = SourceTrustEngine.resolve_attribute_conflict(
        attr_name="Color",
        val1="Stainless Steel", domain1="homedepot.com", content_type1="html",
        val2="Black Stainless", domain2="lowes.com", content_type2="html",
        manufacturer="Frigidaire"
    )
    assert res["conflict_detected"] == True
    assert res["route_to_hitl"] == True
    assert "SAME_TIER_CONFLICT" in res["resolution_reason"]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
