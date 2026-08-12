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
        desc = self.clean_text(record.get("part_desc"))
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
