import re
import json
from pathlib import Path
from typing import Dict, Optional, Tuple
from src.config import MASTERS_DIR

class FractionNormalizationEngine:
    """Production-grade deterministic fraction normalization engine."""

    def __init__(self, masters_dir: Path = MASTERS_DIR):
        self.masters_dir = masters_dir
        self.decimal_to_fraction_map = self._load_map()

    def _load_map(self) -> Dict[float, str]:
        filepath = self.masters_dir / "fraction_decimal_map.json"
        mapping = {}
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                raw_json = json.load(f)
                for dec_str, frac_str in raw_json.items():
                    try:
                        dec_val = float(dec_str)
                        mapping[dec_val] = frac_str
                    except ValueError:
                        pass

        # Standard 16ths and 32nds exact fraction table fallback
        fraction_table_16ths_32nds = {
            0.03125: "1/32", 0.0625: "1/16", 0.09375: "3/32", 0.125: "1/8",
            0.15625: "5/32", 0.1875: "3/16", 0.21875: "7/32", 0.25: "1/4",
            0.28125: "9/32", 0.3125: "5/16", 0.34375: "11/32", 0.375: "3/8",
            0.40625: "13/32", 0.4375: "7/16", 0.46875: "15/32", 0.5: "1/2",
            0.53125: "17/32", 0.5625: "9/16", 0.59375: "19/32", 0.625: "5/8",
            0.65625: "21/32", 0.6875: "11/16", 0.71875: "23/32", 0.75: "3/4",
            0.78125: "25/32", 0.8125: "13/16", 0.84375: "27/32", 0.875: "7/8",
            0.90625: "29/32", 0.9375: "15/16", 0.96875: "31/32"
        }
        for f_val, f_str in fraction_table_16ths_32nds.items():
            if f_val not in mapping:
                mapping[f_val] = f_str

        return mapping

    def float_to_fraction_str(self, val: float) -> Optional[str]:
        """Looks up exact float in conversion table."""
        # Round to 5 decimal places to avoid floating point precision issues
        val_rounded = round(val, 5)
        if val_rounded in self.decimal_to_fraction_map:
            return self.decimal_to_fraction_map[val_rounded]
        
        # Check tolerance within 1e-4
        for k, v in self.decimal_to_fraction_map.items():
            if abs(k - val_rounded) < 1e-4:
                return v
        return None

    def normalize_measurement(self, text: str, uom: Optional[str] = None) -> str:
        """Normalizes decimal measurements to fractions for length/dimension UOMs (in, ft)."""
        if not text:
            return ""

        # Only apply fraction conversion to length/dimension units or unitless numbers with decimal inches
        is_length = False
        if uom:
            u_clean = uom.strip().lower()
            if u_clean in ["in", "inch", "inches", "\"", "ft", "feet", "foot"]:
                is_length = True
        elif any(unit_kw in text.lower() for unit_kw in ["in", "inch", "\""]):
            is_length = True

        # Non-length units (V, A, W, dBA, lb, psi) should PRESERVE decimals (e.g. 120 V, 47 dBA)
        non_length_keywords = ["v", "volt", "a", "amp", "w", "watt", "dba", "decibel", "psi", "hz", "rpm"]
        if uom and uom.strip().lower() in non_length_keywords:
            return text

        # Regex for matching mixed numbers like "50.25" or "0.5" or "7.25"
        def _sub_func(match):
            whole_str = match.group(1) or ""
            dec_str = "0." + match.group(2)
            try:
                dec_val = float(dec_str)
                frac_str = self.float_to_fraction_str(dec_val)
                if frac_str:
                    if whole_str and whole_str != "0":
                        return f"{whole_str}-{frac_str}"
                    else:
                        return frac_str
            except ValueError:
                pass
            return match.group(0)

        # Match numbers with decimal point (e.g. 50.25, 0.5, 7.25)
        # Avoid matching part numbers like D0724A or SKUs by requiring numeric boundary
        pattern = r"\b(\d+)?\.(125|25|375|5|625|75|875|0625|1875|3125|4375|5625|6875|8125|9375|03125|09375|15625|21875|28125|34375|40625|46875|53125|59375|65625|71875|78125|84375|90625|96875)\b"

        if is_length or re.search(pattern, text):
            return re.sub(pattern, _sub_func, text)

        return text
