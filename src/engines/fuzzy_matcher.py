import json
from pathlib import Path
from typing import Tuple, Optional, Dict
from rapidfuzz import process, fuzz
from src.config import MASTERS_DIR, FUZZY_MATCH_THRESHOLD

class FuzzyMatcher:
    def __init__(self, masters_dir: Path = MASTERS_DIR):
        self.masters_dir = masters_dir
        self.manufacturer_master = self._load_json("manufacturer_master.json")
        self.brand_master = self._load_json("brand_master.json")
        
        self.manuf_names = list(set([
            v["canonical_name"] for v in self.manufacturer_master.values()
        ]))

    def _load_json(self, filename: str) -> Dict:
        filepath = self.masters_dir / filename
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def resolve_manufacturer(self, raw_manuf_name: Optional[str], part_desc: str = "") -> Tuple[str, float]:
        if not raw_manuf_name:
            return "", 0.0

        desc_upper = part_desc.upper() if part_desc else ""

        # Map distributor co-ops to actual canonical parent manufacturers
        if "APPLIANCE DEALERS COOPERATIVE" in raw_manuf_name.upper():
            if "FRIGIDAIRE" in desc_upper or "PDSH" in desc_upper:
                return "Rheem Manufacturing", 0.98
            if "WHIRLPOOL" in desc_upper or "WDTS" in desc_upper:
                return "Whirlpool Corporation", 0.98

        # Exact match in master
        if raw_manuf_name in self.manufacturer_master:
            return self.manufacturer_master[raw_manuf_name]["canonical_name"], 1.0

        # RapidFuzz match
        if self.manuf_names:
            match, score, _ = process.extractOne(
                raw_manuf_name,
                self.manuf_names,
                scorer=fuzz.WRatio
            )
            confidence = round(score / 100.0, 4)
            if score >= FUZZY_MATCH_THRESHOLD:
                return match, confidence

        return raw_manuf_name, 0.70

    def resolve_brand(self, raw_brand: Optional[str], resolved_manuf: str, part_desc: str) -> Tuple[str, float]:
        desc_upper = part_desc.upper() if part_desc else ""

        # Specific known product lines
        if "FRIGIDAIRE" in desc_upper or "PDSH" in desc_upper:
            return "FRIGIDAIRE®", 0.99
        if "WHIRLPOOL" in desc_upper or "WDTS" in desc_upper:
            return "Whirlpool®", 0.99

        # Exact match in brand master
        if raw_brand and raw_brand.upper() in self.brand_master:
            return self.brand_master[raw_brand.upper()], 0.98

        # Check if brand is embedded in description
        for key, canonical in self.brand_master.items():
            if key in desc_upper:
                return canonical, 0.95

        # Manufacturer defaults
        manuf_brand_map = {
            "Freud Inc": "Diablo",
            "Milwaukee Accessory": "Milwaukee",
            "Phillips Lighting": "Philips",
            "Boise Cascade": "Trex®",
            "Black & Decker": "DEWALT",
            "Makita": "Makita",
            "Festool": "Festool",
            "Kichler": "Kichler",
            "Leviton": "Leviton",
        }

        for m_key, b_val in manuf_brand_map.items():
            if m_key.lower() in resolved_manuf.lower():
                return b_val, 0.90

        if raw_brand:
            return raw_brand.title(), 0.70

        return resolved_manuf, 0.60
