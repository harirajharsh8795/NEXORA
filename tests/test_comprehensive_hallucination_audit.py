import os
import sys
import pytest

sys.path.insert(0, os.path.abspath("."))

from scratch.run_comprehensive_hallucination_audit import run_comprehensive_hallucination_audit

def test_comprehensive_hallucination_audit_execution():
    """Verifies that the 50-scenario comprehensive hallucination audit runs cleanly and generates report."""
    run_comprehensive_hallucination_audit()
    report_path = os.path.join("scratch", "comprehensive_hallucination_audit_report.md")
    assert os.path.exists(report_path), "Comprehensive hallucination audit report missing"
    
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    assert "100.0%" in content or "VERIFIED" in content
    assert "Observed Unsupported Hallucinated Values" in content
    assert "50 Scenarios" in content or "50 / 50" in content
