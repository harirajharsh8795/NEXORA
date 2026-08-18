import pytest
import re
from src.models.product import RawSKURecord
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.engines.fuzzy_matcher import FuzzyMatcher
from src.engines.classification_engine import ClassificationEngine
from src.engines.attribute_engine import AttributeEngine

def test_mfg_part_num_never_maps_to_manufacturer():
    """Ensures MPN is NEVER assigned to Manufacturer."""
    matcher = FuzzyMatcher()
    mfr, conf = matcher.resolve_manufacturer("TEST-BLADE-004", "7-1/4 in blade")
    assert mfr != "TEST-BLADE-004", "MPN must not be assigned to Manufacturer!"

def test_part_manuf_maps_to_manufacturer():
    """Ensures Part_Manuf input correctly maps to Manufacturer entity."""
    record = RawSKURecord(
        mfg_part_num="UNSEEN-TEST-001",
        part_desc="20V Max Cordless Drill Driver",
        part_manuf="Demo Manufacturer",
        e1_brand="DeWalt"
    )
    er = EntityResolutionAgent()
    products = er.process([record])
    assert products[0].manufacturer_name == "Demo Manufacturer"
    assert products[0].mfg_part_num == "UNSEEN-TEST-001"

def test_unknown_manufacturer_does_not_use_mpn():
    """Ensures Unknown Manufacturer inputs yield UNKNOWN, NOT the MPN string."""
    matcher = FuzzyMatcher()
    mfr, conf = matcher.resolve_manufacturer("Unknown Manufacturer", "3/4 in steel pipe fitting")
    assert mfr == "UNKNOWN"
    assert conf == 0.0

def test_brass_description_produces_brass():
    """Ensures explicit 'brass' produce Material: Brass, NOT Carbon Steel."""
    engine = AttributeEngine()
    attrs = engine.extract_attributes(
        part_desc="1/2 in brass coupling 150#",
        mfg_part_num="TEST-PIPE-002",
        brand="-- Unbranded --",
        manuf="UNKNOWN",
        classpath="Plumbing & Pipe>Pipe & Pipe Fittings>Brass Pipe Fittings"
    )
    mat_attr = next((a for a in attrs if a.label == "Material"), None)
    assert mat_attr is not None, "Material attribute missing!"
    assert mat_attr.value == "Brass", f"Expected Brass but got '{mat_attr.value}'"

def test_steel_description_produces_steel():
    """Ensures explicit 'steel' produces Material: Carbon Steel."""
    engine = AttributeEngine()
    attrs = engine.extract_attributes(
        part_desc="3/4 in steel pipe fitting",
        mfg_part_num="TEST-PIPE-003",
        brand="-- Unbranded --",
        manuf="UNKNOWN",
        classpath="Plumbing & Pipe>Pipe & Pipe Fittings>Steel Pipe Fittings"
    )
    mat_attr = next((a for a in attrs if a.label == "Material"), None)
    assert mat_attr is not None, "Material attribute missing!"
    assert mat_attr.value == "Carbon Steel", f"Expected Carbon Steel but got '{mat_attr.value}'"

def test_stainless_steel_description_produces_stainless_steel():
    """Ensures explicit 'stainless steel' produces Material: Stainless Steel."""
    engine = AttributeEngine()
    attrs = engine.extract_attributes(
        part_desc="2 in stainless steel pipe coupling 300#",
        mfg_part_num="TEST-PIPE-004",
        brand="-- Unbranded --",
        manuf="UNKNOWN",
        classpath="Plumbing & Pipe>Pipe & Pipe Fittings>Steel Pipe Fittings"
    )
    mat_attr = next((a for a in attrs if a.label == "Material"), None)
    assert mat_attr is not None, "Material attribute missing!"
    assert mat_attr.value == "Stainless Steel", f"Expected Stainless Steel but got '{mat_attr.value}'"

def test_explicit_material_overrides_category_default():
    """Ensures explicit material in description overrides category defaults."""
    engine = ClassificationEngine()

    dept, cat_class, fine, classpath, conf = engine.classify("3/4 in steel pipe fitting", "TEST-PIPE-003")
    assert fine == "Steel Pipe Fittings"
    assert "Steel Pipe Fittings" in classpath

    dept2, cat_class2, fine2, classpath2, conf2 = engine.classify("1/2 in brass coupling 150#", "TEST-PIPE-002")
    assert fine2 == "Brass Pipe Fittings"
    assert "Brass Pipe Fittings" in classpath2

def test_provenance_matches_actual_input_field():
    """Ensures evidence graph provenance matches actual input vendor field."""
    record = RawSKURecord(
        mfg_part_num="UNSEEN-TEST-001",
        part_desc="20V Max Cordless Drill Driver",
        part_manuf="Demo Manufacturer",
        e1_brand="DeWalt"
    )
    er = EntityResolutionAgent()
    products = er.process([record])

    evidence = products[0].evidence_graph.evidences.get("MANUFACTURER_NAME")
    assert evidence is not None
    assert evidence.value == "Demo Manufacturer"
    assert "Demo Manufacturer" in evidence.snippet

def test_no_cross_row_attribute_contamination():
    """Ensures attributes do not leak across different rows in a batch."""
    records = [
        RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in. x 24-Teeth Framing Saw Blade", part_manuf="Freud Inc.", e1_brand="Diablo"),
        RawSKURecord(mfg_part_num="UNSEEN-TEST-001", part_desc="20V Max Cordless Drill Driver", part_manuf="Demo Manufacturer", e1_brand="DeWalt")
    ]
    er = EntityResolutionAgent()
    products = er.process(records)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)

    saw = products[0]
    drill = products[1]

    saw_labels = [a.label for a in saw.attributes]
    drill_labels = [a.label for a in drill.attributes]

    assert "Number of Teeth" in saw_labels
    assert "Number of Teeth" not in drill_labels, "Saw blade teeth count leaked into Drill!"

def test_nexora_manual_8_sku_dataset_verification():
    """Verifies all 8 SKUs of NEXORA_manual_test_dataset.csv for exact MPN != Manufacturer isolation."""
    records = [
        RawSKURecord(mfg_part_num="UNSEEN-TEST-001", part_desc="20V Max Cordless Drill Driver", part_manuf="Demo Manufacturer", e1_brand="DeWalt"),
        RawSKURecord(mfg_part_num="MODIFIED-TEST-002", part_desc="Heavy duty titanium coated saw blade", part_manuf="Demo Manufacturer", e1_brand="Diablo"),
        RawSKURecord(mfg_part_num="TEST-PIPE-003", part_desc="3/4 in steel pipe fitting", part_manuf="Unknown Manufacturer", e1_brand="Unbranded"),
        RawSKURecord(mfg_part_num="TEST-BLADE-004", part_desc="7-1/4 in framing circular saw blade", part_manuf="Unknown Manufacturer", e1_brand="Freud Inc"),
        RawSKURecord(mfg_part_num="MALFORMED-TEST-005", part_desc="Malformed corrupted line item", part_manuf="MALFORMED-TEST-005", e1_brand="Garbage"),
        RawSKURecord(mfg_part_num="TEST-FITTING-006", part_desc="1/2 in brass coupling 150#", part_manuf="Demo Manufacturer", e1_brand="BrassCorp"),
        RawSKURecord(mfg_part_num="TEST-DRILL-007", part_desc="Brushless 1/2 in cordless hammer drill 20V", part_manuf="Demo Manufacturer", e1_brand="DeWalt"),
        RawSKURecord(mfg_part_num="TEST-COUPLING-008", part_desc="2 in stainless steel pipe coupling 300#", part_manuf="Demo Manufacturer", e1_brand="SteelCorp")
    ]

    er = EntityResolutionAgent()
    products = er.process(records)

    # UNSEEN-TEST-001
    assert products[0].mfg_part_num == "UNSEEN-TEST-001"
    assert products[0].manufacturer_name == "Demo Manufacturer"

    # MODIFIED-TEST-002
    assert products[1].mfg_part_num == "MODIFIED-TEST-002"
    assert products[1].manufacturer_name == "Demo Manufacturer"

    # TEST-PIPE-003
    assert products[2].mfg_part_num == "TEST-PIPE-003"
    assert products[2].manufacturer_name == "UNKNOWN"

    # TEST-BLADE-004
    assert products[3].mfg_part_num == "TEST-BLADE-004"
    assert products[3].manufacturer_name == "UNKNOWN"

    # MALFORMED-TEST-005
    assert products[4].mfg_part_num == "MALFORMED-TEST-005"
    assert products[4].manufacturer_name == "UNKNOWN"

    # TEST-FITTING-006
    assert products[5].mfg_part_num == "TEST-FITTING-006"
    assert products[5].manufacturer_name == "Demo Manufacturer"

    # TEST-DRILL-007
    assert products[6].mfg_part_num == "TEST-DRILL-007"
    assert products[6].manufacturer_name == "Demo Manufacturer"

    # TEST-COUPLING-008
    assert products[7].mfg_part_num == "TEST-COUPLING-008"
    assert products[7].manufacturer_name == "Demo Manufacturer"

