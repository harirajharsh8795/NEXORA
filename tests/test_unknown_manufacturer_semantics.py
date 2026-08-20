import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.models.product import RawSKURecord
from api.routes import run_pipeline_for_records

def test_unknown_manufacturer_does_not_mean_malformed():
    """Verify that a valid product row with an unknown manufacturer is NOT flagged as MALFORMED_INPUT_DATA."""
    raw = [
        RawSKURecord(
            mfg_part_num="TEST-PIPE-003",
            part_desc="1/2 in brass coupling 150#",
            part_manuf="Unknown Vendor Corp",
            e1_brand="Unbranded"
        )
    ]
    products = run_pipeline_for_records(raw)
    p = products[0]
    
    assert p.mfg_part_num == "TEST-PIPE-003"
    assert p.manufacturer_name == "UNKNOWN"
    assert "MALFORMED_INPUT_DATA" not in p.confidence.flagged_reasons
    assert any("UNRESOLVED_MANUFACTURER_IDENTITY" in r for r in p.confidence.flagged_reasons)

def test_valid_description_continues_without_manufacturer():
    """Verify that a valid description continues through the full enrichment pipeline without manufacturer."""
    raw = [
        RawSKURecord(
            mfg_part_num="TEST-BLADE-004",
            part_desc="10 in stainless steel saw blade",
            part_manuf="NonExistent Mfr",
            e1_brand="Freud Inc"
        )
    ]
    products = run_pipeline_for_records(raw)
    p = products[0]
    
    assert p.manufacturer_name == "UNKNOWN"
    assert p.classpath != "Unclassified>Pending Review>Unknown Product"
    assert len(p.attributes) > 0
    assert p.confidence.overall_confidence > 0.0

def test_empty_description_is_malformed():
    """Verify that an empty description is the ONLY condition flagged as MALFORMED_INPUT_DATA."""
    raw = [
        RawSKURecord(
            mfg_part_num="MALFORMED-TEST-005",
            part_desc="",
            part_manuf="",
            e1_brand=""
        )
    ]
    products = run_pipeline_for_records(raw)
    p = products[0]
    
    assert p.mfg_part_num == "MALFORMED-TEST-005"
    assert p.confidence.needs_human_review is True
    assert any("MALFORMED_INPUT_DATA" in r for r in p.confidence.flagged_reasons)

def test_unknown_manufacturer_preserves_classification():
    """Verify that unknown manufacturer items preserve specific taxonomy classification."""
    raw = [
        RawSKURecord(
            mfg_part_num="TEST-PIPE-003",
            part_desc="1/2 in brass coupling 150#",
            part_manuf="Unknown Vendor",
            e1_brand="BrassCorp"
        ),
        RawSKURecord(
            mfg_part_num="TEST-BLADE-004",
            part_desc="10 in stainless steel saw blade",
            part_manuf="Unknown Vendor",
            e1_brand="Freud Inc"
        )
    ]
    products = run_pipeline_for_records(raw)
    pipe_p = products[0]
    blade_p = products[1]
    
    assert "Brass Pipe Fittings" in pipe_p.classpath or "Pipe Fittings" in pipe_p.classpath
    assert "Saw Blades" in blade_p.classpath

def test_unknown_manufacturer_preserves_attributes():
    """Verify that unknown manufacturer items preserve extracted attributes and UOM standardization."""
    raw = [
        RawSKURecord(
            mfg_part_num="TEST-PIPE-003",
            part_desc="1/2 in brass coupling 150#",
            part_manuf="Unknown Vendor",
            e1_brand="BrassCorp"
        ),
        RawSKURecord(
            mfg_part_num="TEST-BLADE-004",
            part_desc="10 in stainless steel saw blade",
            part_manuf="Unknown Vendor",
            e1_brand="Freud Inc"
        )
    ]
    products = run_pipeline_for_records(raw)
    pipe_attrs = {a.label: f"{a.value} {a.uom}".strip() for a in products[0].attributes}
    blade_attrs = {a.label: f"{a.value} {a.uom}".strip() for a in products[1].attributes}
    
    assert "Fitting Size" in pipe_attrs and "1/2 in" in pipe_attrs["Fitting Size"]
    assert "Material" in pipe_attrs and "Brass" in pipe_attrs["Material"]
    assert "Blade Diameter" in blade_attrs and "10 in" in blade_attrs["Blade Diameter"]

def test_unknown_manufacturer_routes_to_hitl():
    """Verify that unknown manufacturer items route to HITL with UNRESOLVED_MANUFACTURER_IDENTITY."""
    raw = [
        RawSKURecord(
            mfg_part_num="TEST-PIPE-003",
            part_desc="1/2 in brass coupling 150#",
            part_manuf="Unknown Vendor",
            e1_brand="BrassCorp"
        )
    ]
    products = run_pipeline_for_records(raw)
    p = products[0]
    
    assert p.confidence.needs_human_review is True
    assert any("UNRESOLVED_MANUFACTURER_IDENTITY" in r for r in p.confidence.flagged_reasons)
    assert not any("MALFORMED_INPUT_DATA" in r for r in p.confidence.flagged_reasons)
