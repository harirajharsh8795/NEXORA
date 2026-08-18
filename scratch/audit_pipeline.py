import sys
import time
import requests
import pandas as pd
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.utils.csv_handler import read_input_csv
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.content_agent import ContentAgent
from src.agents.enrichment_agent import EnrichmentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent

def run_honest_audit():
    print("=========================================================")
    print("PHASE 0: HONEST TECHNICAL AUDIT RUNNING")
    print("=========================================================")
    
    # 1. Load Datasets
    input_path = "Unihack_ Sample Dataset - Input.csv"
    gt_path = "Unihack_ Expected Output - Delivery Format.csv"
    
    records = read_input_csv(input_path)
    gt_df = pd.read_csv(gt_path, dtype=str).fillna("")
    print(f"Loaded {len(records)} input rows and {len(gt_df)} ground truth rows.")
    
    # 2. Measure Execution Time per SKU across full 1,000 dataset
    start_time = time.time()
    
    er_agent = EntityResolutionAgent()
    products = er_agent.process(records)
    
    cls_agent = ClassificationAgent()
    products = cls_agent.process(products)
    
    attr_agent = AttributeAgent()
    products = attr_agent.process(products)
    
    content_agent = ContentAgent()
    products = content_agent.process(products)
    
    enrichment_agent = EnrichmentAgent()
    products = enrichment_agent.process(products)
    
    val_agent = ValidationAgent()
    products = val_agent.process(products)
    
    review_agent = ReviewAgent()
    approved, review_queue = review_agent.process(products)
    
    total_time = time.time() - start_time
    time_per_sku = total_time / len(products)
    skus_per_sec = len(products) / total_time
    
    print("\n--- 1. SCALABILITY & TIMING ---")
    print(f"Total time for 1,000 SKUs: {total_time:.4f} seconds")
    print(f"Time per SKU: {time_per_sku*1000:.2f} ms ({time_per_sku:.6f} s)")
    print(f"Throughput: {skus_per_sec:.1f} SKUs/sec")
    
    # 3. Accuracy evaluation against Ground Truth
    gt_dict = {str(row["Mfg_Part_Num"]).strip(): row for _, row in gt_df.iterrows()}
    pred_dict = {p.mfg_part_num.strip(): p for p in products}
    
    mfr_matches = 0
    brand_matches = 0
    classpath_matches = 0
    attr_matches = 0
    uom_matches = 0
    char_limit_passes = 0
    total_gt = len(gt_dict)
    
    failing_examples = []
    
    for mpn, gt_row in gt_dict.items():
        if mpn in pred_dict:
            pred = pred_dict[mpn]
            
            # Manufacturer
            gt_mfr = str(gt_row.get("MANUFACTURER_NAME", "")).strip().lower()
            pred_mfr = pred.manufacturer_name.strip().lower()
            if pred_mfr == gt_mfr:
                mfr_matches += 1
            else:
                failing_examples.append(f"MFR Mismatch for {mpn}: Predicted '{pred.manufacturer_name}' vs GT '{gt_row.get('MANUFACTURER_NAME')}'")
                
            # Brand
            gt_brand = str(gt_row.get("BRAND_NAME", "")).strip().lower().replace("®", "").replace("™", "")
            pred_brand = pred.brand_name.strip().lower().replace("®", "").replace("™", "")
            if pred_brand == gt_brand:
                brand_matches += 1
            else:
                failing_examples.append(f"Brand Mismatch for {mpn}: Predicted '{pred.brand_name}' vs GT '{gt_row.get('BRAND_NAME')}'")
                
            # Classpath
            gt_cp = str(gt_row.get("Classpath", "")).strip().lower()
            pred_cp = pred.classpath.strip().lower()
            if pred_cp == gt_cp:
                classpath_matches += 1
            else:
                failing_examples.append(f"Classpath Mismatch for {mpn}: Predicted '{pred.classpath}' vs GT '{gt_row.get('Classpath')}'")
                
            # Character Limit Compliance (INVOICE_DESC <= 50 chars, MOBILE_DESC <= 160 chars)
            inv_len = len(pred.invoice_desc)
            mob_len = len(pred.mobile_desc)
            if inv_len <= 50 and mob_len <= 160:
                char_limit_passes += 1
            else:
                failing_examples.append(f"Char limit failure for {mpn}: invoice len={inv_len}, mobile len={mob_len}")
    
    # Check attributes & UOM across all products
    total_attrs = sum(len(p.attributes) for p in products)
    valid_lovs = sum(sum(1 for a in p.attributes if a.is_lov_valid) for p in products)
    valid_uoms = sum(sum(1 for a in p.attributes if a.is_uom_standardized) for p in products)
    
    print("\n--- 2. REAL ACCURACY & COMPLIANCE ---")
    print(f"Manufacturer Match Rate: {(mfr_matches/total_gt)*100:.1f}% ({mfr_matches}/{total_gt})")
    print(f"Brand Match Rate:        {(brand_matches/total_gt)*100:.1f}% ({brand_matches}/{total_gt})")
    print(f"Classpath Match Rate:    {(classpath_matches/total_gt)*100:.1f}% ({classpath_matches}/{total_gt})")
    print(f"Char Limit Compliance:   {(char_limit_passes/total_gt)*100:.1f}% ({char_limit_passes}/{total_gt})")
    print(f"LOV Compliance Rate:     {(valid_lovs/max(total_attrs,1))*100:.1f}% ({valid_lovs}/{total_attrs})")
    print(f"UOM Compliance Rate:     {(valid_uoms/max(total_attrs,1))*100:.1f}% ({valid_uoms}/{total_attrs})")
    
    print("\nSpecific Failures Identified:")
    for ex in failing_examples:
        print(f"  - {ex}")
        
    # 4. Source URL HTTP Verification (Sample check)
    print("\n--- 3. SOURCE URL VERIFICATION ---")
    sample_urls = [p.mfr_url for p in products[:10] if p.mfr_url]
    print(f"Testing HTTP status for first {len(sample_urls)} constructed MFR URLs...")
    for url in sample_urls:
        if "google.com" in url:
            print(f"  [UNVERIFIED/SEARCH] {url}")
            continue
        try:
            resp = requests.head(url, timeout=3, headers={"User-Agent": "Mozilla/5.0"})
            print(f"  [{resp.status_code}] {url}")
        except Exception as e:
            print(f"  [FETCH FAILED: {type(e).__name__}] {url}")

if __name__ == "__main__":
    run_honest_audit()
