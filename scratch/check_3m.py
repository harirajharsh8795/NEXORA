import json

with open("frontend/src/data/catalogData.json", "r", encoding="utf-8") as f:
    products = json.load(f)

items = [p for p in products if "3MABR" in p.get("mfg_part_num", "")]
print(f"Total 3MABR SKUs: {len(items)}")

for p in items[:8]:
    c = p.get("confidence", {})
    mpn = p.get("mfg_part_num")
    manuf_c = c.get("manufacturer_confidence")
    brand_c = c.get("brand_confidence")
    class_c = c.get("classpath_confidence")
    attr_c = c.get("attribute_confidence")
    overall = c.get("overall_confidence")
    print(f"MPN: {mpn}")
    print(f"  Manufacturer Conf (25%): {manuf_c}")
    print(f"  Brand Conf        (25%): {brand_c}")
    print(f"  Classpath Conf    (25%): {class_c}")
    print(f"  Attribute Conf    (25%): {attr_c}")
    print(f"  Calculated Sum: {(manuf_c*0.25 + brand_c*0.25 + class_c*0.25 + attr_c*0.25):.4f} -> Stored Overall: {overall}")
    print("-" * 50)
