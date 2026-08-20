from typing import List
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct

class ValidationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ValidationAgent")

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Validating {len(products)} products against compliance rules...")

        for p in products:
            existing_reasons = list(p.confidence.flagged_reasons)

            # 1. Structural Malformed Input Check
            if not p.part_desc or not p.part_desc.strip() or "MALFORMED" in p.part_desc.upper() or "MALFORMED" in p.mfg_part_num.upper():
                p.confidence.needs_human_review = True
                if "MALFORMED_INPUT_DATA" not in existing_reasons:
                    existing_reasons.append("MALFORMED_INPUT_DATA")

            # 2. Unresolved Manufacturer Check
            if p.manufacturer_name == "UNKNOWN" or p.confidence.manufacturer_confidence < 0.60:
                p.confidence.needs_human_review = True
                if "UNRESOLVED_MANUFACTURER_IDENTITY" not in existing_reasons:
                    existing_reasons.append("UNRESOLVED_MANUFACTURER_IDENTITY")

            # 3. Description Char Limits Check
            if len(p.invoice_desc) > 50:
                p.invoice_desc = p.invoice_desc[:50]
            if len(p.short_desc) > 150:
                p.short_desc = p.short_desc[:150]

            p.confidence.flagged_reasons = existing_reasons

        self.logger.info("Validation completed successfully.")
        return products
