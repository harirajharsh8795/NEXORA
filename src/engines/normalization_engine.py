import json
import re
from pathlib import Path
from typing import Optional, Dict
from src.config import MASTERS_DIR

class NormalizationEngine:
    def __init__(self, masters_dir: Path = MASTERS_DIR):
        self.abbrev_map = self._load_json(masters_dir / "abbreviation_map.json")
        self.fraction_map = self._load_json(masters_dir / "fraction_decimal_map.json")

    def _load_json(self, filepath: Path) -> Dict:
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def expand_abbreviation(self, text: Optional[str]) -> Optional[str]:
        if not text:
            return None
        words = text.split()
        expanded_words = []
        for word in words:
            clean_word = word.strip(",.-").upper()
            if clean_word in self.abbrev_map:
                expanded_words.append(self.abbrev_map[clean_word])
            else:
                expanded_words.append(word)
        return " ".join(expanded_words)

    def normalize_dimension_value(self, val: Optional[str]) -> Optional[str]:
        if not val:
            return None
        clean_val = val.strip()
        if clean_val in self.fraction_map:
            return self.fraction_map[clean_val]
        return clean_val
