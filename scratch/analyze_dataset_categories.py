import pandas as pd
from collections import Counter

df = pd.read_csv("Unihack_ Sample Dataset - Input.csv", dtype=str).fillna("")
mfrs = Counter(df["Part_Manuf"].tolist())

print("Top 15 Manufacturers in 1,000 SKU Dataset:")
for m, c in mfrs.most_common(15):
    print(f"  {m:45s}: {c} SKUs")

# Group SKUs by manufacturer & keywords
diablo_skus = [r for idx, r in df.iterrows() if "freud" in str(r.get("Part_Manuf","")).lower()]
milwaukee_skus = [r for idx, r in df.iterrows() if "milwaukee" in str(r.get("Part_Manuf","")).lower()]
leviton_skus = [r for idx, r in df.iterrows() if "leviton" in str(r.get("Part_Manuf","")).lower()]
boise_skus = [r for idx, r in df.iterrows() if "boise" in str(r.get("Part_Manuf","")).lower()]

print(f"\nManufacturer Subset Counts:")
print(f"  Freud/Diablo Tools: {len(diablo_skus)} SKUs")
print(f"  Milwaukee Tool:      {len(milwaukee_skus)} SKUs")
print(f"  Leviton Mfg Co:      {len(leviton_skus)} SKUs")
print(f"  Boise Cascade/Trex:  {len(boise_skus)} SKUs")
