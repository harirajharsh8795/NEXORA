import pytest
from src.engines.fraction_engine import FractionNormalizationEngine

@pytest.fixture
def fraction_engine():
    return FractionNormalizationEngine()

def test_all_provided_fraction_mappings(fraction_engine):
    """Verifies all standard decimal to fraction table lookups."""
    assert fraction_engine.float_to_fraction_str(0.125) == "1/8"
    assert fraction_engine.float_to_fraction_str(0.25) == "1/4"
    assert fraction_engine.float_to_fraction_str(0.375) == "3/8"
    assert fraction_engine.float_to_fraction_str(0.5) == "1/2"
    assert fraction_engine.float_to_fraction_str(0.625) == "5/8"
    assert fraction_engine.float_to_fraction_str(0.75) == "3/4"
    assert fraction_engine.float_to_fraction_str(0.875) == "7/8"
    assert fraction_engine.float_to_fraction_str(0.0625) == "1/16"

def test_mixed_numbers_normalization(fraction_engine):
    """Verifies mixed number fraction conversion."""
    assert fraction_engine.normalize_measurement("50.25 in", uom="in") == "50-1/4 in"
    assert fraction_engine.normalize_measurement("7.25 in", uom="in") == "7-1/4 in"
    assert fraction_engine.normalize_measurement("33.4375 in", uom="in") == "33-7/16 in"

def test_standalone_decimals(fraction_engine):
    """Verifies standalone decimals without whole numbers."""
    assert fraction_engine.normalize_measurement("0.5 in", uom="in") == "1/2 in"
    assert fraction_engine.normalize_measurement("0.25 in", uom="in") == "1/4 in"

def test_already_fractional_inputs_preserved(fraction_engine):
    """Verifies already fractional text is preserved without alteration."""
    assert fraction_engine.normalize_measurement("50-1/4 in", uom="in") == "50-1/4 in"
    assert fraction_engine.normalize_measurement("7-1/4 in x 24T", uom="in") == "7-1/4 in x 24T"

def test_electrical_and_metric_values_preserved(fraction_engine):
    """Verifies non-inch measurements (V, A, dBA, lb) preserve decimals."""
    assert fraction_engine.normalize_measurement("120.5 V", uom="V") == "120.5 V"
    assert fraction_engine.normalize_measurement("15.5 A", uom="A") == "15.5 A"
    assert fraction_engine.normalize_measurement("47 dBA", uom="dBA") == "47 dBA"

def test_invalid_strings_and_skus_untouched(fraction_engine):
    """Verifies invalid numeric strings and MPNs like D0724A remain untouched."""
    assert fraction_engine.normalize_measurement("D0724A") == "D0724A"
    assert fraction_engine.normalize_measurement("PDSH4816AF") == "PDSH4816AF"
    assert fraction_engine.normalize_measurement("") == ""

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
