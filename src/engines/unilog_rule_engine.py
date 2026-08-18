import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
from src.config import MASTERS_DIR

class UnilogRuleEngine:
    """Production machine-readable rule engine enforcing Unilog PIM guidelines."""

    def __init__(self, masters_dir: Path = MASTERS_DIR):
        self.masters_dir = masters_dir
        self.uom_map = self._load_json("uom_mapping.json")
        self.abbreviation_map = self._load_json("abbreviation_map.json")
        self.fraction_map = self._load_json("fraction_decimal_map.json")
        self.brand_master = self._load_json("brand_master.json")
        self.manuf_master = self._load_json("manufacturer_master.json")

    def _load_json(self, filename: str) -> Dict:
        filepath = self.masters_dir / filename
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    # Category 1: UOM Normalization
    def normalize_uom(self, raw_uom: str) -> str:
        """Source: Unilog Master UOM Standards (uom_mapping.json)."""
        if not raw_uom:
            return ""
        u_clean = raw_uom.strip().lower()
        if u_clean in self.uom_map:
            return self.uom_map[u_clean]
        return raw_uom.strip()

    # Category 2: Fraction Normalization
    def normalize_fraction(self, text: str) -> str:
        """Source: Decimal_Fraction.xlsx (fraction_decimal_map.json)."""
        if not text:
            return ""
        
        # Replace decimal parts with fractions if matched in table
        result = text
        for dec, frac in self.fraction_map.items():
            # Match decimal after whole number like "50.25" or standalone "0.25"
            pattern = r"(\b\d+)\." + re.escape(dec.split(".")[1]) + r"\b"
            def _replace_mixed(match):
                whole = match.group(1)
                if whole == "0":
                    return frac
                return f"{whole}-{frac}"
            result = re.sub(pattern, _replace_mixed, result)


            # Standalone decimal replacement like "0.5" -> "1/2"
            pattern_standalone = r"\b0\." + re.escape(dec.split(".")[1]) + r"\b"
            result = re.sub(pattern_standalone, frac, result)

        return result

    # Category 3: Character Limits
    def enforce_char_limits(self, invoice_desc: str, short_desc: str, mobile_desc: str) -> Tuple[str, str, str]:
        """Source: Unilog Internal Content Guidelines (Max char limits)."""
        inv_clean = invoice_desc[:50] if invoice_desc else ""
        short_clean = short_desc[:150] if short_desc else ""
        mob_clean = mobile_desc[:50] if mobile_desc else ""
        return inv_clean, short_clean, mob_clean

    # Category 4: Casing Rules
    def enforce_casing(self, invoice_desc: str, brand_name: str) -> Tuple[str, str]:
        """Source: Unilog POS Invoice ALL-CAPS & Trademark Brand Casing."""
        inv_upper = invoice_desc.upper() if invoice_desc else ""
        brand_formatted = brand_name.title() if brand_name else ""
        
        # Add registered trademark symbol if present in brand master
        if brand_name:
            b_upper = brand_name.upper()
            if b_upper in self.brand_master:
                brand_formatted = self.brand_master[b_upper]

        return inv_upper, brand_formatted

    # Category 5: Hyphenation Rules
    def enforce_hyphenation(self, text: str) -> str:
        """Source: Unilog Mixed Fraction & Dimension Hyphenation."""
        if not text:
            return ""
        # Ensure mixed number fractions have hyphens (e.g., "50 1/4" -> "50-1/4")
        return re.sub(r"(\b\d+)\s+(\d+/\d+)", r"\1-\2", text)

    # Category 6: Technical Abbreviations Expansion
    def expand_abbreviations(self, raw_text: str) -> str:
        """Source: Unilog Master Abbreviations (abbreviation_map.json)."""
        if not raw_text:
            return ""
        words = raw_text.split()
        expanded_words = []
        for word in words:
            w_clean = re.sub(r"[^\w]", "", word).upper()
            if w_clean in self.abbreviation_map:
                expanded_words.append(self.abbreviation_map[w_clean])
            else:
                expanded_words.append(word)
        return " ".join(expanded_words)

    # Category 7: Controlled Values & Brand Canonicalization
    def canonicalize_brand(self, raw_brand: str, manufacturer: str) -> str:
        """Source: Manufacturer & Brand Master Vocabulary."""
        if not raw_brand or raw_brand == "-- Unbranded --":
            return manufacturer.title() if manufacturer else "Generic"
        b_upper = raw_brand.upper()
        if b_upper in self.brand_master:
            return self.brand_master[b_upper]
        return raw_brand.title()

    # Category 8: Title & Description Construction Rules
    def construct_short_title(self, brand: str, mpn: str, desc: str) -> str:
        """Rule: SHORT_DESC = {BRAND} {MPN} {DESCRIPTION} (max 150 chars)."""
        title = f"{brand} {mpn} {desc}".strip()
        return title[:150]

    def construct_invoice_header(self, prod_type: str, mpn: str, specs: str) -> str:
        """Rule: INVOICE_DESC = ALL-CAPS abbreviated header (max 50 chars)."""
        raw = f"{prod_type} {mpn} {specs}".upper()
        return raw[:50]
