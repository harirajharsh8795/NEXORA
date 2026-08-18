import pytest
import pandas as pd
from src.models.product import RawSKURecord
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.engines.fuzzy_matcher import FuzzyMatcher
from src.engines.classification_engine import ClassificationEngine
from src.engines.attribute_engine import AttributeEngine

def test_manufacturer_resolution_isolation():
    """Verifies that MPN is NEVER assigned to Manufacturer under any circumstances."""
    matcher = FuzzyMatcher()

    # Case 1: Unknown / Malformed manufacturer
    manuf_name, conf = matcher.resolve_manufacturer("Unknown Manufacturer", "3/4 in steel pipe fitting")
    assert manuf_name == "UNKNOWN", f"Expected UNKNOWN but got '{manuf_name}'"
    assert conf == 0.0, f"Expected 0.0 confidence but got {conf}"

    manuf_name, conf = matcher.resolve_manufacturer("MALFORMED-TEST-005", "Malformed data")
    assert manuf_name == "UNKNOWN", f"Expected UNKNOWN but got '{manuf_name}'"
    assert conf == 0.0, f"Expected 0.0 confidence but got {conf}"

    # Case 2: Canonical Manufacturer Resolution
    manuf_name, conf = matcher.resolve_manufacturer("Freud Inc.", "7-1/4 in. Saw Blade")
    assert manuf_name == "Freud Inc"
    assert conf >= 0.90

def test_steel_vs_brass_pipe_fitting_classification():
    """Verifies that steel fittings are classified as Steel Pipe Fittings, NOT Brass."""
    engine = ClassificationEngine()

    # Steel fitting test
    dept, cat_class, fine, classpath, conf = engine.classify("3/4 in steel pipe fitting", "TEST-PIPE-003")
    assert fine == "Steel Pipe Fittings", f"Expected Steel Pipe Fittings but got '{fine}'"
    assert "Steel Pipe Fittings" in classpath, f"Expected Steel Pipe Fittings in classpath but got '{classpath}'"

    # Brass fitting test
    dept, cat_class, fine, classpath, conf = engine.classify("3/8 in brass coupling 150#", "TEST-PIPE-002")
    assert fine == "Brass Pipe Fittings", f"Expected Brass Pipe Fittings but got '{fine}'"
    assert "Brass Pipe Fittings" in classpath, f"Expected Brass Pipe Fittings in classpath but got '{classpath}'"

def test_product_isolated_attribute_extraction():
    """Verifies that saw blade attributes (teeth, blade diameter) do NOT leak into drills or fittings."""
    engine = AttributeEngine()

    # Drill test
    drill_attrs = engine.extract_attributes(
        part_desc="20V Max Cordless Drill Driver 1/2 in Chuck",
        mfg_part_num="DCD771C2",
        brand="DeWalt",
        manuf="DeWalt",
        classpath="Tools & Hardware>Power Tools>Cordless Drills"
    )
    labels = [a.label for a in drill_attrs]
    assert "Voltage Rating" in labels
    assert "Number of Teeth" not in labels, "Saw blade attribute 'Number of Teeth' leaked into Drill!"
    assert "Blade Diameter" not in labels, "Saw blade attribute 'Blade Diameter' leaked into Drill!"

    # Steel fitting test
    fitting_attrs = engine.extract_attributes(
        part_desc="3/4 in steel pipe fitting 150#",
        mfg_part_num="TEST-PIPE-003",
        brand="-- Unbranded --",
        manuf="UNKNOWN",
        classpath="Plumbing & Pipe>Pipe & Pipe Fittings>Steel Pipe Fittings"
    )
    fit_labels = [a.label for a in fitting_attrs]
    assert "Fitting Size" in fit_labels or "Material" in fit_labels
    assert "Number of Teeth" not in fit_labels, "Saw blade attribute leaked into Fitting!"

def test_real_manufacturer_evaluator_dataset_b():
    """Verifies Test B dataset with real industrial products and valid evidence graphs."""
    records = [
        RawSKURecord(mfg_part_num="D0724A", part_desc="7-1/4 in. x 24-Teeth Framing Saw Blade", part_manuf="Freud Inc.", e1_brand="Diablo"),
        RawSKURecord(mfg_part_num="DW088K", part_desc="Self-Leveling Cross Line Laser Level", part_manuf="DeWalt", e1_brand="DeWalt"),
        RawSKURecord(mfg_part_num="BR120", part_desc="20 Amp Single-Pole Type BR Circuit Breaker", part_manuf="Eaton", e1_brand="Eaton")
    ]

    er = EntityResolutionAgent()
    products = er.process(records)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)

    assert len(products) == 3

    # Freud SKU
    freud_p = products[0]
    assert freud_p.manufacturer_name == "Freud Inc"
    assert freud_p.brand_name == "Diablo"
    assert "Saw Blades" in freud_p.classpath

    # DeWalt SKU
    dewalt_p = products[1]
    assert dewalt_p.manufacturer_name == "DeWalt"
    assert dewalt_p.mfg_part_num == "DW088K"

    # Eaton SKU
    eaton_p = products[2]
    assert eaton_p.manufacturer_name == "Eaton"
    assert "Circuit Breakers" in eaton_p.classpath
