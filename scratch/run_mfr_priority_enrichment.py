import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import os
import json
import pandas as pd
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.engines.real_enrichment_engine import RealEnrichmentEngine
from dataclasses import asdict

def main():
    print("=== NEXORA MANUFACTURER DOMAIN PRIORITY ENRICHMENT RUNNER ===")
    
    # Clear stale search cache to force fresh site:mfr search queries
    cache_file = Path("data/enrichment_cache/search_cache.json")
    if cache_file.exists():
        os.remove(cache_file)
        print("🗑️ [CLEANUP] Cleared search_cache.json to execute fresh site:mfr queries")

    # Load dataset
    input_df = pd.read_csv("Unihack_ Sample Dataset - Input.csv", dtype=str).fillna("")
    
    # Scope: All Freud Inc (2435) SKUs = 46 SKUs
    freud_mask = input_df["Part_Manuf"].str.contains("Freud", case=False, na=False)
    scoped_df = input_df[freud_mask].copy()
    
    print(f"Total Master Catalog: {len(input_df)} SKUs")
    print(f"Scoped RAG Target Batch (Freud/Diablo): {len(scoped_df)} SKUs")
    
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
    
    engine = RealEnrichmentEngine(cache_dir="data/enrichment_cache")
    print(f"\n🚀 Running batch enrichment for {len(skus)} SKUs with Manufacturer Site Priority...")
    print("=" * 80)
    
    results = engine.enrich_batch(skus)
    
    # Save full enrichment results
    output_path = Path("data/enrichment_cache/enrichment_results.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([asdict(r) for r in results], f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Enrichment results saved to: {output_path}")
    
    # Analyze Source Domain Breakdown
    print("\n" + "=" * 80)
    print("SOURCE DOMAIN BREAKDOWN AUDIT")
    print("=" * 80)
    
    mfr_domain_count = 0
    third_party_count = 0
    no_source_count = 0
    
    domain_counts = {}
    
    for r in results:
        attrs = r.extracted_attributes
        if not attrs:
            no_source_count += 1
            continue
        
        # Check source URL of extracted attributes
        for a in attrs:
            url = a.get("source_url", "")
            domain = engine._extract_domain(url)
            domain_counts[domain] = domain_counts.get(domain, 0) + 1
            
            is_mfr = engine._is_manufacturer_domain(r.manufacturer, domain) or "diablo" in domain or "freud" in domain
            if is_mfr:
                mfr_domain_count += 1
            else:
                third_party_count += 1

    total_attrs = mfr_domain_count + third_party_count
    
    print(f"Total Extracted Attributes: {total_attrs}")
    if total_attrs > 0:
        print(f"  • Actual Manufacturer Domain Sources (diablotools.com / freudtools.com): {mfr_domain_count} ({mfr_domain_count/total_attrs*100:.1f}%)")
        print(f"  • Third-Party Retailer Fallback Sources: {third_party_count} ({third_party_count/total_attrs*100:.1f}%)")
    
    print("\nDetailed Domain Breakdown:")
    for dom, cnt in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True):
        is_mfr = "diablo" in dom or "freud" in dom
        tag = "🏢 MANUFACTURER DOMAIN" if is_mfr else "🏬 Third-Party Fallback"
        print(f"  • {dom:35s} : {cnt:3d} attributes ({tag})")

if __name__ == "__main__":
    main()
