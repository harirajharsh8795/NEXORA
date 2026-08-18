import os
import sys
import pytest

sys.path.insert(0, os.path.abspath("."))

from scratch.run_rag_retrieval_benchmark import run_rag_retrieval_benchmark

def test_rag_retrieval_benchmark_execution():
    """Verifies that the RAG & search retrieval benchmark runs cleanly and generates report."""
    run_rag_retrieval_benchmark()
    report_path = os.path.join("scratch", "rag_retrieval_benchmark_report.md")
    assert os.path.exists(report_path), "RAG benchmark report file missing"
    
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    assert "100.0%" in content or "VERIFIED" in content
    assert "Official MFR Domain Precision" in content
