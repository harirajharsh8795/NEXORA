import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import json
import pandas as pd

# 1. enrichment_results.json
er = json.load(open("data/enrichment_cache/enrichment_results.json", "r", encoding="utf-8"))
er_total = len(er)
er_success = sum(1 for r in er if r.get("success") and len(r.get("extracted_attributes", [])) > 0)
total_attrs = sum(len(r.get("extracted_attributes", [])) for r in er)

# 2. evidence_graph.json
eg = json.load(open("data/processed/evidence_graph.json", "r", encoding="utf-8"))
nodes = eg.get("nodes", [])
edges = eg.get("edges", [])
prod_nodes = [n for n in nodes if n.get("type") == "product"]
attr_nodes = [n for n in nodes if n.get("type") == "attribute"]

# 3. final_enriched_output.csv
df = pd.read_csv("data/processed/final_enriched_output.csv", dtype=str).fillna("")
ai_rows = df[df["MANUFACTURER_NAME"].str.contains("Freud", case=False, na=False)]
enriched_in_csv = sum(1 for _, row in ai_rows.iterrows() if row.get("Attribute_Name_1") != "")

print("=== PROGRAMMATIC AUDIT OF RAG BATCH RESULTS ===")
print(f"1. Total Batch Target SKUs: {er_total} SKUs")
print(f"2. Successfully Enriched SKUs (with extracted attributes): {er_success} SKUs ({er_success/er_total*100:.1f}%)")
print(f"3. Total Extracted Attributes: {total_attrs} attributes")
print(f"4. Evidence Graph Nodes: {len(nodes)} total ({len(prod_nodes)} product nodes, {len(attr_nodes)} attribute nodes)")
print(f"5. Evidence Graph Edges: {len(edges)} directional links")
print(f"6. Final CSV Enriched Rows: {enriched_in_csv} SKUs with AI attributes")
