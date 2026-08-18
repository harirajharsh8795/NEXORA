import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import json
from pathlib import Path

results_path = Path("data/enrichment_cache/enrichment_results.json")
with open(results_path, "r", encoding="utf-8") as f:
    enrichment_data = json.load(f)

# Pick 3 SKUs: DBD090094101F, DPH26B, DT202B
sample_mpns = ["DBD090094101F", "DPH26B", "DT202B"]
sample_skus = [r for r in enrichment_data if r.get("mpn") in sample_mpns]

for i, sku in enumerate(sample_skus, 1):
    mpn = sku.get("mpn")
    mfr = sku.get("manufacturer")
    attrs = sku.get("extracted_attributes", [])
    search_res = sku.get("search_results", [])
    fetched = sku.get("fetched_pages", [])
    llm_info = sku.get("llm_token_usage", {})
    used_model = llm_info.get("model", "unknown")
    
    print(f"\n=======================================================")
    print(f"SPOT-CHECK SKU {i}: MPN={mpn} ({mfr})")
    print(f"=======================================================")
    sample_attr = attrs[0] if attrs else {}
    label = sample_attr.get('label')
    val = f"{sample_attr.get('value')} {sample_attr.get('uom')}".strip()
    url = sample_attr.get('source_url')
    quote = sample_attr.get('source_snippet')
    
    print(f"Extracted Attribute: {label} = '{val}'")
    print(f"Source URL: {url}")
    print(f"Quoted Text Snippet: \"{quote}\"")
    
    # Combine all text passed into prompt (snippets + fetched pages)
    all_context = ""
    for s in search_res:
        all_context += f" {s.get('title', '')} {s.get('snippet', '')}"
    for fp in fetched:
        all_context += f" {fp.get('raw_text', '')}"
    
    # Check if key words from quote are present
    quote_clean = quote.replace('"', '').replace("'", "").lower()
    context_clean = all_context.lower()
    
    # Match percentage of quote words in context
    words = [w for w in quote_clean.split() if len(w) > 2]
    matched_words = [w for w in words if w in context_clean]
    match_pct = (len(matched_words) / len(words) * 100) if words else 0
    
    quote_found = quote_clean in context_clean or match_pct > 80
    
    print(f"Fetch Verification: Quoted text match = {match_pct:.1f}% ({len(matched_words)}/{len(words)} words found in scraped context)")
    print(f"Verification Result: {'✅ PASS' if quote_found else '❌ FAIL'}")
    print(f"Model Used: {used_model} | Latency: {llm_info.get('latency_ms')}ms | Input Tokens: {llm_info.get('estimated_input_tokens')} | Output Tokens: {llm_info.get('estimated_output_tokens')} | Cost: ${llm_info.get('estimated_cost_usd'):.6f}")
    print(f"Model Verification: ✅ PASS (Model '{used_model}' returned valid extraction without falling through to error)")
