import re
from typing import Dict, Any, Tuple, Optional
from src.config import SENTINEL_VALUES

class DataCleaningEngine:
    def __init__(self, sentinel_values=None):
        self.sentinels = sentinel_values or SENTINEL_VALUES

    def clean_text(self, text: Optional[str]) -> Optional[str]:
        if not text:
            return None
        cleaned = text.strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        if cleaned in self.sentinels:
            return None
        return cleaned

    def clean_description(self, desc: Optional[str]) -> Optional[str]:
        cleaned = self.clean_text(desc)
        if not cleaned:
            return None

        # Insert space between number/fraction and unit word/abbreviation (e.g. 24IN -> 24 in, 0.5IN -> 0.5 in)
        cleaned = re.sub(r"\b(\d+(?:/\d+|\.\d+)?)\s*(INCH|INCHES|FEET|FOOT|MM|CM|PSI|VOLT|VOLTS|AMP|AMPS|WATT|WATTS|LBS|GPM|CFM|HP|RPM)\b", r"\1 \2", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"(\d+(?:/\d+|\.\d+)?)\s*(IN|FT|V|A|W|LB)\b", r"\1 \2", cleaned)
        
        # Canonicalize unit casing
        cleaned = re.sub(r"\b(\d+(?:/\d+|\.\d+)?)\s+IN\b", r"\1 in", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\b(\d+(?:/\d+|\.\d+)?)\s+FT\b", r"\1 ft", cleaned, flags=re.IGNORECASE)

        # Normalize decimal measurements to fractions (e.g. 0.5 in -> 1/2 in)
        from src.engines.fraction_engine import FractionNormalizationEngine
        fraction_engine = FractionNormalizationEngine()
        cleaned = fraction_engine.normalize_measurement(cleaned)

        return cleaned

    def parse_manufacturer(self, raw_manuf: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
        cleaned = self.clean_text(raw_manuf)
        if not cleaned:
            return None, None
        
        # Regex to capture "Name (Code)" format, e.g., "Freud Inc (2435)"
        match = re.match(r"^(.*?)\s*(?:\(([^)]+)\))?$", cleaned)
        if match:
            name = match.group(1).strip()
            code = match.group(2).strip() if match.group(2) else None
            return name if name not in self.sentinels else None, code
        return cleaned, None

    def clean_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Cleans raw CSV record fields."""
        mpn = self.clean_text(record.get("mfg_part_num"))
        desc = self.clean_description(record.get("part_desc"))
        e1_brand = self.clean_text(record.get("e1_brand"))
        unilog_brand = self.clean_text(record.get("unilog_brand"))
        dib_brand = self.clean_text(record.get("dib_brand"))
        
        manuf_name, manuf_code = self.parse_manufacturer(record.get("part_manuf"))

        return {
            "mfg_part_num": mpn,
            "part_desc": desc,
            "e1_brand": e1_brand,
            "unilog_brand": unilog_brand,
            "dib_brand": dib_brand,
            "clean_manuf_name": manuf_name,
            "manuf_code": manuf_code,
        }
