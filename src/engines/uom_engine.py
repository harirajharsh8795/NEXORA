import json
from pathlib import Path
from typing import Optional
from src.config import MASTERS_DIR

class UOMEngine:
    def __init__(self, masters_dir: Path = MASTERS_DIR):
        self.mapping_file = masters_dir / "uom_mapping.json"
        self.uom_map = {}
        if self.mapping_file.exists():
            with open(self.mapping_file, "r", encoding="utf-8") as f:
                self.uom_map = json.load(f)

    def normalize_uom(self, uom: Optional[str]) -> Optional[str]:
        if not uom:
            return None
        cleaned = uom.strip().lower()
        if cleaned in self.uom_map:
            return self.uom_map[cleaned]
        return uom.strip()
