from typing import List
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct

class ValidationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ValidationAgent")

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Validating {len(products)} products against compliance rules...")

        for p in products:
            reasons = []

            # 1. Required Identity Check
            if not p.manufacturer_name:
                reasons.append("Missing Manufacturer Name")
            if not p.brand_name:
                reasons.append("Missing Brand Name")

            # 2. Classification Check
            if not p.classpath:
                reasons.append("Missing Classpath")

            # 3. Description Char Limits Check
            if len(p.invoice_desc) > 50:
                p.invoice_desc = p.invoice_desc[:50]
            if len(p.short_desc) > 150:
                p.short_desc = p.short_desc[:150]

            p.confidence.flagged_reasons = reasons

        self.logger.info("Validation completed successfully.")
        return products
