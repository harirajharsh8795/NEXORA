from pydantic import BaseModel, Field
from typing import Optional

class AttributeTriplet(BaseModel):
    index: int = Field(ge=1, le=50)
    label: str
    value: str
    uom: Optional[str] = None
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    source_url: Optional[str] = None
    is_lov_valid: bool = True
    is_uom_standardized: bool = True
