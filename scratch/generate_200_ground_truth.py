import os
import csv
import json

def generate_200_ground_truth_dataset():
    output_path = os.path.join("data", "ground_truth_200_items.csv")
    os.makedirs("data", exist_ok=True)

    # Base templates across 5 industrial departments
    templates = [
        # Appliances (50 SKUs)
        {
            "dept": "Appliances & Consumer Electronics",
            "class": "Kitchen Appliances",
            "fine": "Built-In Dishwashers",
            "classpath": "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers",
            "manuf": "Rheem Manufacturing",
            "brand": "FRIGIDAIRE®",
            "raw_manuf": "Appliance Dealers Cooperative (APPDE)",
            "mpn_prefix": "PDSH4816AF",
            "desc_prefix": "PDSH4816AF Dishwasher SS Built-In",
            "attrs": [
                ("Voltage Rating", "120", "V"),
                ("Amperage Rating", "15", "A"),
                ("Sound Level", "47", "dBA"),
                ("Material", "Stainless Steel", ""),
                ("Depth With Door Open", "50-1/4", "in")
            ]
        },
        {
            "dept": "Appliances & Consumer Electronics",
            "class": "Kitchen Appliances",
            "fine": "Built-In Dishwashers",
            "classpath": "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers",
            "manuf": "Whirlpool Corporation",
            "brand": "Whirlpool®",
            "raw_manuf": "Appliance Dealers Cooperative (APPDE)",
            "mpn_prefix": "WDTS7024RZ",
            "desc_prefix": "WDTS7024RZ Eco Series Dishwasher SS",
            "attrs": [
                ("Voltage Rating", "120", "V"),
                ("Amperage Rating", "10", "A"),
                ("Sound Level", "41", "dBA"),
                ("Material", "Stainless Steel", ""),
                ("Depth With Door Open", "50-3/16", "in")
            ]
        },
        # Tools & Hardware (50 SKUs)
        {
            "dept": "Tools & Hardware",
            "class": "Power Tool Accessories",
            "fine": "Saw Blades",
            "classpath": "Tools & Hardware>Power Tool Accessories>Saw Blades",
            "manuf": "Freud Inc",
            "brand": "Diablo®",
            "raw_manuf": "Freud Inc (2435)",
            "mpn_prefix": "D0724A",
            "desc_prefix": "Framing Saw Blade 7-1/4 in 24T",
            "attrs": [
                ("Blade Diameter", "7-1/4", "in"),
                ("Number of Teeth", "24", ""),
                ("Arbor Size", "5/8", "in"),
                ("Kerf Thickness", "0.059", "in"),
                ("Material", "Carbide", "")
            ]
        },
        {
            "dept": "Tools & Hardware",
            "class": "Abrasives",
            "fine": "Cut-Off Wheels & Discs",
            "classpath": "Tools & Hardware>Abrasives>Bonded Abrasives>Cut-Off Wheels",
            "manuf": "3 M Co",
            "brand": "3M®",
            "raw_manuf": "3 M Co (5293)",
            "mpn_prefix": "3MABR",
            "desc_prefix": "Cubitron II Cut-Off Wheel 4-1/2 in",
            "attrs": [
                ("Wheel Diameter", "4-1/2", "in"),
                ("Thickness", "0.045", "in"),
                ("Arbor Hole Size", "7/8", "in"),
                ("Maximum Speed", "13300", "rpm"),
                ("Abrasive Material", "Precision Shaped Grain", "")
            ]
        },
        {
            "dept": "Tools & Hardware",
            "class": "Abrasives",
            "fine": "Sanding Discs",
            "classpath": "Tools & Hardware>Abrasives>Coated Abrasives>Sanding Discs",
            "manuf": "Mirka Abrasives Inc",
            "brand": "Mirka®",
            "raw_manuf": "Mirka Abrasives Inc (MIRUS)",
            "mpn_prefix": "AUTONET",
            "desc_prefix": "Abranet 6 in Grip Mesh Disc 180 Grit",
            "attrs": [
                ("Disc Diameter", "6", "in"),
                ("Grit", "180", ""),
                ("Backing Weight", "Mesh", ""),
                ("Abrasive Material", "Aluminum Oxide", ""),
                ("Attachment Type", "Grip", "")
            ]
        },
        {
            "dept": "Tools & Hardware",
            "class": "Hand Tools",
            "fine": "Screwdrivers",
            "classpath": "Tools & Hardware>Hand Tools>Screwdrivers",
            "manuf": "Wera Tools NA Inc",
            "brand": "Wera®",
            "raw_manuf": "Wera Tools NA Inc (WERTO)",
            "mpn_prefix": "KRAFTFORM",
            "desc_prefix": "Kraftform Plus Slotted Screwdriver 1/4 in",
            "attrs": [
                ("Tip Size", "1/4", "in"),
                ("Shank Length", "4", "in"),
                ("Handle Material", "Multi-Component", ""),
                ("Overall Length", "8-1/2", "in"),
                ("Tip Type", "Slotted", "")
            ]
        },
        {
            "dept": "Tools & Hardware",
            "class": "Power Tool Accessories",
            "fine": "Driver Bits",
            "classpath": "Tools & Hardware>Power Tool Accessories>Driver Bits",
            "manuf": "Milwaukee Accessory",
            "brand": "Milwaukee®",
            "raw_manuf": "Milwaukee Accessory (4031)",
            "mpn_prefix": "SHOCKWAVE",
            "desc_prefix": "Shockwave Impact Duty Insert Bit PH2",
            "attrs": [
                ("Drive Size", "1/4", "in"),
                ("Bit Size", "PH2", ""),
                ("Overall Length", "1", "in"),
                ("Material", "Alloy Steel", ""),
                ("Shank Type", "Hex", "")
            ]
        },
        # Electrical & Lighting (30 SKUs)
        {
            "dept": "Electrical & Lighting",
            "class": "Wiring Devices",
            "fine": "Receptacles",
            "classpath": "Electrical & Lighting>Wiring Devices>Receptacles",
            "manuf": "Leviton Mfg Co",
            "brand": "Leviton®",
            "raw_manuf": "Leviton Mfg Co (4927)",
            "mpn_prefix": "5362-W",
            "desc_prefix": "Extra Heavy Duty Industrial Grade Duplex Receptacle 20A 125V",
            "attrs": [
                ("Voltage Rating", "125", "V"),
                ("Amperage Rating", "20", "A"),
                ("NEMA Configuration", "5-20R", ""),
                ("Number of Poles", "2", ""),
                ("Color", "White", "")
            ]
        },
        {
            "dept": "Electrical & Lighting",
            "class": "Wiring Devices",
            "fine": "Industrial Plugs",
            "classpath": "Electrical & Lighting>Wiring Devices>Plugs & Connectors",
            "manuf": "Cooper Wiring Devices",
            "brand": "Cooper®",
            "raw_manuf": "Cooper Wiring Devices (3560)",
            "mpn_prefix": "AH5966Y",
            "desc_prefix": "Arrow Hart Safety Grip Heavy Duty Plug 15A 125V",
            "attrs": [
                ("Voltage Rating", "125", "V"),
                ("Amperage Rating", "15", "A"),
                ("NEMA Configuration", "5-15P", ""),
                ("Number of Wires", "3", ""),
                ("Material", "Nylon", "")
            ]
        },
        # Building Materials (20 SKUs)
        {
            "dept": "Building Materials",
            "class": "Drywall & Plaster",
            "fine": "Gypsum Boards",
            "classpath": "Building Materials>Drywall>Gypsum Panels",
            "manuf": "Certainteed Gypsum",
            "brand": "CertainTeed®",
            "raw_manuf": "Certainteed Gypsum (2765)",
            "mpn_prefix": "TYPE-X",
            "desc_prefix": "Fire-Rated Type X Gypsum Board 5/8 in x 4 ft x 8 ft",
            "attrs": [
                ("Thickness", "5/8", "in"),
                ("Width", "4", "ft"),
                ("Length", "8", "ft"),
                ("Fire Rating", "Type X", ""),
                ("Edge Detail", "Tapered", "")
            ]
        }
    ]

    headers = [
        "SKU_ID", "Mfg_Part_Num", "Part_Desc", "E1_Brand", "Part_Manuf",
        "MANUFACTURER_NAME", "BRAND_NAME", "TRADE_NAME", "Classpath",
        "MOBILE_DESC", "INVOICE_DESC", "UNSPSC",
        "ATTRIBUTE_LABEL_1", "ATTRIBUTE_VALUE_1", "ATTRIBUTE_UOM_1",
        "ATTRIBUTE_LABEL_2", "ATTRIBUTE_VALUE_2", "ATTRIBUTE_UOM_2",
        "ATTRIBUTE_LABEL_3", "ATTRIBUTE_VALUE_3", "ATTRIBUTE_UOM_3",
        "ATTRIBUTE_LABEL_4", "ATTRIBUTE_VALUE_4", "ATTRIBUTE_UOM_4",
        "ATTRIBUTE_LABEL_5", "ATTRIBUTE_VALUE_5", "ATTRIBUTE_UOM_5"
    ]

    rows = []
    total_count = 200
    for i in range(total_count):
        tmpl = templates[i % len(templates)]
        variant = (i // len(templates)) + 1
        sku_id = f"GT200-SKU-{i+1:03d}"
        mpn = f"{tmpl['mpn_prefix']}-V{variant:02d}"
        desc = f"{tmpl['desc_prefix']} Variant {variant}"
        raw_manuf = tmpl["raw_manuf"]

        # Build attribute columns
        attr_cols = []
        for lbl, val, uom in tmpl["attrs"]:
            attr_cols.extend([lbl, val, uom])
        while len(attr_cols) < 15:
            attr_cols.extend(["", "", ""])

        row = [
            sku_id,
            mpn,
            desc,
            "-- Unbranded --",
            raw_manuf,
            tmpl["manuf"],
            tmpl["brand"],
            tmpl["brand"].replace("®", ""),
            tmpl["classpath"],
            f"• {tmpl['brand']} {tmpl['desc_prefix']}\n• High Durability Industrial Grade",
            f"{tmpl['brand'].replace('®', '').upper()} {desc[:30].upper()}",
            f"{40100000 + i}",
        ] + attr_cols

        rows.append(row)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"[OK] Generated ground truth 200-row benchmark dataset at: {output_path}")

if __name__ == "__main__":
    generate_200_ground_truth_dataset()

