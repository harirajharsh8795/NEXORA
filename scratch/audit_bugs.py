import json

with open("frontend/src/data/catalogData.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Total products loaded: {len(products)}")

# 1. Check Manufacturer/Brand Mismatches
mismatches = []
for p in products:
    mfr = (p.get("manufacturer_name") or "").upper()
    brd = (p.get("brand_name") or "").upper()
    mpn = p.get("mfg_part_num")
    
    # Check known conflicting manufacturer / brand pairs
    if "MIRKA" in mfr and "3M" in brd:
        mismatches.append((mpn, p.get("manufacturer_name"), p.get("brand_name"), "Mirka manufacturer with 3M brand"))
    elif "FREUD" in mfr and "MILWAUKEE" in brd:
        mismatches.append((mpn, p.get("manufacturer_name"), p.get("brand_name"), "Freud manufacturer with Milwaukee brand"))
    elif "3M" in mfr and "MIRKA" in brd:
        mismatches.append((mpn, p.get("manufacturer_name"), p.get("brand_name"), "3M manufacturer with Mirka brand"))
    elif "MILWAUKEE" in mfr and "DIABLO" in brd:
        mismatches.append((mpn, p.get("manufacturer_name"), p.get("brand_name"), "Milwaukee manufacturer with Diablo brand"))

print(f"\n--- 1. Manufacturer / Brand Mismatches found: {len(mismatches)} ---")
for m in mismatches:
    print(f"  MPN: {m[0]} | MFR: {m[1]} | Brand: {m[2]} | Note: {m[3]}")

# 2. Check Unit Duplication ("in in")
in_in_count = 0
for p in products:
    attrs = p.get("attributes") or []
    for a in attrs:
        val_str = f"{a.get('value', '')} {a.get('uom', '')}"
        if "in in" in val_str.lower() or "mm mm" in val_str.lower() or "ft ft" in val_str.lower():
            in_in_count += 1
            if in_in_count <= 5:
                print(f"  Unit Duplication in {p.get('mfg_part_num')}: {a.get('label')} -> value='{a.get('value')}', uom='{a.get('uom')}'")

print(f"\n--- 2. Unit Duplication instances found: {in_in_count} ---")

# 3. Check Corrupted Decimals (e.g., '045 in', '040 in', '050 in')
corrupted_decimals = 0
for p in products:
    attrs = p.get("attributes") or []
    for a in attrs:
        val = a.get('value', '')
        if isinstance(val, str) and ("045" in val or "040" in val or "050" in val or "035" in val or "025" in val):
            corrupted_decimals += 1
            if corrupted_decimals <= 5:
                print(f"  Corrupted Decimal in {p.get('mfg_part_num')}: {a.get('label')} -> '{val}'")

print(f"\n--- 3. Corrupted Decimals found: {corrupted_decimals} ---")
