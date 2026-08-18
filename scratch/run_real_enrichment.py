"""
NEXORA Real Enrichment Runner
==============================
Scopes the 46 Freud/Diablo SKUs and runs the full real enrichment pipeline.
Outputs: data/enrichment_cache/enrichment_results.json
"""
import sys
import os
import json
import pandas as pd
from pathlib import Path

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.engines.real_enrichment_engine import RealEnrichmentEngine
from dataclasses import asdict

def main():
    # Clear stale DDG cache that contains failed rate-limited results
    cache_file = Path("data/enrichment_cache/search_cache.json")
    if cache_file.exists():
        os.remove(cache_file)
        print("[CLEANUP] Cleared stale search cache from rate-limited run")

    # Load dataset
    input_df = pd.read_csv("Unihack_ Sample Dataset - Input.csv", dtype=str).fillna("")
    
    # Scope: All Freud Inc (2435) SKUs = 46 SKUs
    freud_mask = input_df["Part_Manuf"].str.contains("Freud", case=False, na=False)
    scoped_df = input_df[freud_mask].copy()
    
    print(f"Total dataset: {len(input_df)} SKUs")
    print(f"Scoped subset (Freud/Diablo): {len(scoped_df)} SKUs")
    print(f"Remaining (deterministic only): {len(input_df) - len(scoped_df)} SKUs")
    print()
    
    # Build SKU list for enrichment
    skus = []
    for idx, row in scoped_df.iterrows():
        desc = row.get("Part_Desc", "")
        desc_upper = desc.upper()
        if "SAW BLADE" in desc_upper or "BLADE" in desc_upper:
            ptype = "saw blade"
        elif "SANDING" in desc_upper:
            ptype = "sanding belt"
        elif "CUT-OFF" in desc_upper or "CUTOFF" in desc_upper or "CUT OFF" in desc_upper:
            ptype = "cut-off disc"
        elif "HOLE SAW" in desc_upper:
            ptype = "hole saw"
        elif "DRILL" in desc_upper:
            ptype = "drill bit"
        elif "RECIP" in desc_upper:
            ptype = "reciprocating saw blade"
        elif "JIG" in desc_upper:
            ptype = "jigsaw blade"
        elif "ROUTER" in desc_upper:
            ptype = "router bit"
        elif "PLANER" in desc_upper:
            ptype = "planer blade"
        else:
            ptype = "cutting tool"
        
        skus.append({
            "mpn": row.get("Mfg_Part_Num", ""),
            "manufacturer": "Freud Diablo",
            "description": desc,
            "product_type": ptype
        })
    
    # Initialize engine
    engine = RealEnrichmentEngine(cache_dir="data/enrichment_cache")
    
    # Run full 46-SKU scoped batch
    print(f"Running full scoped batch: {len(skus)} SKUs")
    print("=" * 70)
    
    results = engine.enrich_batch(skus)
    
    # Save full enrichment results
    output_path = Path("data/enrichment_cache/enrichment_results.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([asdict(r) for r in results], f, indent=2, ensure_ascii=False)
    
    print(f"\nFull enrichment results saved to: {output_path}")
    
    # Print summary (ASCII-safe)
    print("\n" + "=" * 70)
    print("ENRICHMENT SUMMARY (46 SKUs)")
    print("=" * 70)
    success_count = sum(1 for r in results if r.success)
    total_attrs = sum(len(r.extracted_attributes) for r in results)
    total_cost = sum(r.llm_cost_usd for r in results)
    
    print(f"Total SKUs Processed: {len(results)}")
    print(f"Successfully Enriched: {success_count} ({success_count/len(results)*100:.1f}%)")
    print(f"Total Attributes Extracted: {total_attrs}")
    print(f"Total LLM Token Cost: ${total_cost:.6f}")
    print(f"Average Cost per SKU: ${total_cost/len(results):.6f}")
    print("=" * 70)

if __name__ == "__main__":
    main()

