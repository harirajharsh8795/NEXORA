import os
import sys
import pandas as pd

# Load 1000 input SKUs
input_df = pd.read_csv("Unihack_ Sample Dataset - Input.csv", dtype=str).fillna("")

# Filter SKUs in "Fittings" category or related keywords
fittings_keywords = ["fitting", "coupling", "nipple", "elbow", "tee", "adapter", "bushing", "flange", "valve", "connector", "union", "plug", "cap"]
fittings_skus = []

for idx, row in input_df.iterrows():
    desc = str(row.get("Part_Desc", "")).lower()
    mpn = str(row.get("Mfg_Part_Num", "")).lower()
    raw_brand = str(row.get("E1_Brand", "")).lower()
    mfr = str(row.get("Part_Manuf", "")).lower()
    
    if any(k in desc for k in fittings_keywords) or any(k in mpn for k in fittings_keywords):
        fittings_skus.append({
            "index": idx,
            "sku_id": row.get("PART_NUMBER", f"SKU-{idx}"),
            "mpn": row.get("Mfg_Part_Num", ""),
            "part_desc": row.get("Part_Desc", ""),
            "mfr": row.get("Part_Manuf", ""),
            "brand": row.get("E1_Brand", "")
        })

print(f"Total input SKUs in dataset: {len(input_df)}")
print(f"Total Fittings-related SKUs found: {len(fittings_skus)}")
print("\nFirst 10 Scoped Fittings SKUs:")
for s in fittings_skus[:10]:
    print(f"  [{s['index']}] MPN: {s['mpn']:25s} | MFR: {s['mfr']:25s} | Desc: {s['part_desc']}")

# Check if Fittings_LOV.xlsx or LOV data exists
lov_files = []
for root, dirs, files in os.walk("."):
    for f in files:
        if "lov" in f.lower() or "fittings" in f.lower():
            lov_files.append(os.path.join(root, f))
print("\nFound LOV / Fittings Files:", lov_files)
