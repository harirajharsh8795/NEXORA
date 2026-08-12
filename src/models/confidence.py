from pydantic import BaseModel, Field

class ConfidenceScore(BaseModel):
    manufacturer_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    brand_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    classpath_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    attribute_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    needs_human_review: bool = False
    flagged_reasons: list[str] = Field(default_factory=list)

    def calculate_overall(self, weights: dict = None):
        if not weights:
            weights = {
                "manufacturer": 0.25,
                "brand": 0.25,
                "classpath": 0.25,
                "attribute": 0.25
            }
        self.overall_confidence = round(
            self.manufacturer_confidence * weights.get("manufacturer", 0.25) +
            self.brand_confidence * weights.get("brand", 0.25) +
            self.classpath_confidence * weights.get("classpath", 0.25) +
            self.attribute_confidence * weights.get("attribute", 0.25),
            4
        )
        if self.overall_confidence < 0.85:
            self.needs_human_review = True
            if "Overall confidence below threshold (85%)" not in self.flagged_reasons:
                self.flagged_reasons.append("Overall confidence below threshold (85%)")
        return self.overall_confidence
