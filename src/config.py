import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Data Paths
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
MASTERS_DIR = DATA_DIR / "masters"
PROCESSED_DIR = DATA_DIR / "processed"
EVIDENCE_DIR = DATA_DIR / "evidence"

INPUT_CSV_PATH = RAW_DATA_DIR / "input.csv"
DELIVERY_FORMAT_PATH = RAW_DATA_DIR / "delivery_format.csv"

# Output Paths
CLEANED_CSV_PATH = PROCESSED_DIR / "01_cleaned.csv"
RESOLVED_CSV_PATH = PROCESSED_DIR / "02_resolved.csv"
CLASSIFIED_CSV_PATH = PROCESSED_DIR / "03_classified.csv"
EXTRACTED_CSV_PATH = PROCESSED_DIR / "04_extracted.csv"
ENRICHED_CSV_PATH = PROCESSED_DIR / "05_enriched.csv"
FINAL_OUTPUT_CSV_PATH = PROCESSED_DIR / "final_output.csv"

EVIDENCE_GRAPH_PATH = EVIDENCE_DIR / "evidence_graph.json"

# API & LLM Settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PRIMARY_LLM_MODEL = "gemini-2.0-flash"
EMBEDDING_MODEL = "models/text-embedding-004"

# Quality Thresholds
AUTO_APPROVE_CONFIDENCE_THRESHOLD = 0.85
FUZZY_MATCH_THRESHOLD = 85  # rapidfuzz 0-100 score threshold

# Sentinel values in raw dataset
SENTINEL_VALUES = {
    "-- Unbranded --",
    "-- No Unilog Brand --",
    "-- No DIB Brand --",
    "COMMODITY - UNBRANDED",
    "N/A",
    "UNKNOWN",
    "NONE",
    "",
}
