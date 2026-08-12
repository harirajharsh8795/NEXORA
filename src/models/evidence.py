from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EvidenceItem(BaseModel):
    field_name: str
    value: Any
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    source_type: str = Field(default="deterministic", description="deterministic, lov_match, fuzzy_match, llm_extraction, web_scrape, document")
    source_url: Optional[str] = None
    snippet: Optional[str] = None
    validated_by_lov: bool = False
    validated_by_uom: bool = False

class EvidenceGraph(BaseModel):
    product_mpn: str
    evidences: Dict[str, EvidenceItem] = Field(default_factory=dict)

    def add_evidence(self, item: EvidenceItem):
        self.evidences[item.field_name] = item
