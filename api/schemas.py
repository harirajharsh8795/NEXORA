from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PipelineStatusResponse(BaseModel):
    total_skus: int
    auto_approved_count: int
    human_review_count: int
    auto_approval_rate: float
    total_attributes_extracted: int
    pipeline_execution_time_sec: float
    metrics: Dict[str, Any]

class ProductSummaryResponse(BaseModel):
    mfg_part_num: str
    part_desc: str
    manufacturer_name: str
    brand_name: str
    classpath: str
    overall_confidence: float
    needs_human_review: bool
    flagged_reasons: List[str]
    attribute_count: int
