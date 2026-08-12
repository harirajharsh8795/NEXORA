import json
import re
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
INPUT_CSV = BASE_DIR / "data" / "raw" / "input.csv"
MASTERS_DIR = BASE_DIR / "data" / "masters"

def build_masters():
    MASTERS_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(INPUT_CSV, dtype=str).fillna("")

    # 1. Manufacturer Master
    raw_manufs = df["Part_Manuf"].unique()
    manuf_master = {}
    for m in raw_manufs:
        m_str = str(m).strip()
        if not m_str or m_str in ["-", "N/A"]:
            continue
        match = re.match(r"^(.*?)\s*(?:\(([^)]+)\))?$", m_str)
        if match:
            clean_name = match.group(1).strip()
            code = match.group(2).strip() if match.group(2) else ""
            manuf_master[m_str] = {
                "raw": m_str,
                "canonical_name": clean_name,
                "code": code
            }

    with open(MASTERS_DIR / "manufacturer_master.json", "w", encoding="utf-8") as f:
        json.dump(manuf_master, f, indent=2)

    # 2. Brand Master seed
    raw_brands = df["E1_Brand"].unique()
    brand_master = {
        "TREX": "Trex®",
        "TIMBERTECH": "TimberTech®",
        "FRIGIDAIRE": "FRIGIDAIRE®",
        "WHIRLPOOL": "Whirlpool®",
        "PHILIPS": "Philips",
        "MILWAUKEE": "Milwaukee",
        "DEWALT": "DEWALT",
        "DIABLO": "Diablo",
        "MAKITA": "Makita",
        "KICHLER": "Kichler",
        "FESTOOL": "Festool",
        "LEVITON": "Leviton",
        "RHEEM": "Rheem Manufacturing",
        "MIRKA": "Mirka",
        "SATCO": "Satco",
    }
    with open(MASTERS_DIR / "brand_master.json", "w", encoding="utf-8") as f:
        json.dump(brand_master, f, indent=2)

    # 3. UOM Standard Mapping
    uom_mapping = {
        '"': "in",
        "in.": "in",
        "inch": "in",
        "inches": "in",
        "ft.": "ft",
        "feet": "ft",
        "foot": "ft",
        "mm": "mm",
        "cm": "cm",
        "m": "m",
        "v": "V",
        "volt": "V",
        "volts": "V",
        "a": "A",
        "amp": "A",
        "amps": "A",
        "amperage": "A",
        "w": "W",
        "watt": "W",
        "watts": "W",
        "kw-hr": "kW-hr",
        "kwh": "kW-hr",
        "dba": "dBA",
        "decibel": "dBA",
        "decibels": "dBA",
        "psi": "psi",
        "lb": "lb",
        "lbs": "lb",
        "pound": "lb",
        "pounds": "lb",
        "pc": "pc",
        "pcs": "pc",
        "pack": "pk",
        "pk": "pk",
    }
    with open(MASTERS_DIR / "uom_mapping.json", "w", encoding="utf-8") as f:
        json.dump(uom_mapping, f, indent=2)

    # 4. Abbreviation Map
    abbrev_map = {
        "CPLG": "Coupling",
        "COUP": "Coupling",
        "BRS": "Brass",
        "BR": "Brass",
        "BRZ": "Bronze",
        "SST": "Stainless Steel",
        "SS": "Stainless Steel",
        "DKO": "Depressed Center",
        "MILW": "Milwaukee",
        "LED": "LED",
        "MED": "Medium",
        "CAND": "Candelabra",
        "CIRC": "Circular",
        "FRMING": "Framing",
        "CCT": "Color Temperature",
        "SHAPER": "Shaper",
        "JOINTER": "Jointer",
        "PLANER": "Planer",
    }
    with open(MASTERS_DIR / "abbreviation_map.json", "w", encoding="utf-8") as f:
        json.dump(abbrev_map, f, indent=2)

    # 5. Fraction Decimal Map
    fraction_map = {
        "0.125": "1/8",
        "0.25": "1/4",
        "0.375": "3/8",
        "0.5": "1/2",
        "0.625": "5/8",
        "0.75": "3/4",
        "0.875": "7/8",
        "0.045": ".045",
    }
    with open(MASTERS_DIR / "fraction_decimal_map.json", "w", encoding="utf-8") as f:
        json.dump(fraction_map, f, indent=2)

    print("Master lookup files generated successfully in data/masters/")

if __name__ == "__main__":
    build_masters()
