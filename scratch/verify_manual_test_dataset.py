import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd
from src.utils.csv_handler import parse_raw_dataframe
from api.routes import run_pipeline_for_records

def main():
    df = pd.read_csv("data/NEXORA_manual_test_dataset.csv").fillna("")
    records, warnings = parse_raw_dataframe(df)
    products = run_pipeline_for_records(records)
    
    print("=" * 70)
    print("NEXORA MANUAL TEST DATASET ENRICHMENT RESULTS")
    print("=" * 70)
    
    target_mpns = ["TEST-PIPE-003", "TEST-BLADE-004", "MALFORMED-TEST-005"]
    
    for p in products:
        if p.mfg_part_num in target_mpns or any(t in p.mfg_part_num for t in ["PIPE", "BLADE", "MALFORMED"]):
            print(f"\nSKU MPN:       {p.mfg_part_num}")
            print(f"Description:   '{p.part_desc}'")
            print(f"Manufacturer:  {p.manufacturer_name}")
            print(f"Brand:         {p.brand_name}")
            print(f"Classpath:     {p.classpath}")
            print(f"HITL Review:   {p.confidence.needs_human_review}")
            print(f"Flagged:       {p.confidence.flagged_reasons}")
            attrs_str = ", ".join([f"{a.label}={a.value} {a.uom}".strip() for a in p.attributes])
            print(f"Attributes:    [{attrs_str}]")
            print("-" * 70)

if __name__ == "__main__":
    main()
