from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class ConfidenceScore(BaseModel):
    manufacturer_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    brand_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    classpath_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    attribute_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    
    # Detailed Field-Level Confidence Dictionary
    field_scores: Dict[str, float] = Field(default_factory=dict)
    
    # Explainable HITL Routing Reasons
    needs_human_review: bool = False
    flagged_reasons: List[str] = Field(default_factory=list)

    def calculate_overall(self, weights: Dict[str, float] = None) -> float:
        if not weights:
            weights = {
                "manufacturer": 0.30,
                "brand": 0.25,
                "classpath": 0.25,
                "attribute": 0.20
            }
        
        self.overall_confidence = round(
            self.manufacturer_confidence * weights.get("manufacturer", 0.30) +
            self.brand_confidence * weights.get("brand", 0.25) +
            self.classpath_confidence * weights.get("classpath", 0.25) +
            self.attribute_confidence * weights.get("attribute", 0.20),
            4
        )

        # Record field scores into dictionary
        self.field_scores["MANUFACTURER_NAME"] = round(self.manufacturer_confidence, 2)
        self.field_scores["BRAND_NAME"] = round(self.brand_confidence, 2)
        self.field_scores["Classpath"] = round(self.classpath_confidence, 2)
        self.field_scores["ATTRIBUTES_AVG"] = round(self.attribute_confidence, 2)

        # Generate explainable HITL routing reason codes
        if self.manufacturer_confidence < 0.60:
            if "LOW_MANUFACTURER_CONFIDENCE" not in self.flagged_reasons:
                self.flagged_reasons.append("LOW_MANUFACTURER_CONFIDENCE: Manufacturer unverified or missing")
        
        if self.brand_confidence <= 0.60:
            if "UNBRANDED_CATALOG_ITEM" not in self.flagged_reasons:
                self.flagged_reasons.append("UNBRANDED_CATALOG_ITEM: Item has no verified brand")
        
        if self.classpath_confidence < 0.70:
            if "CLASSIFICATION_AMBIGUOUS" not in self.flagged_reasons:
                self.flagged_reasons.append("CLASSIFICATION_AMBIGUOUS: Category classification score below 70%")

        if self.attribute_confidence < 0.70:
            if "SPARSE_SPECIFICATIONS" not in self.flagged_reasons:
                self.flagged_reasons.append("SPARSE_SPECIFICATIONS: Low attribute population or validation rate")

        if self.overall_confidence < 0.85:
            self.needs_human_review = True
            if "OVERALL_SCORE_BELOW_THRESHOLD" not in self.flagged_reasons:
                self.flagged_reasons.append("OVERALL_SCORE_BELOW_THRESHOLD: Product overall confidence < 85%")

        return self.overall_confidence
