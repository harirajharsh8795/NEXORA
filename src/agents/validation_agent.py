from typing import List
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct
from src.models.reason_codes import ReasonCode

# Values treated as empty/missing descriptions
_EMPTY_DESCRIPTION_SENTINELS = {"", "--", "n/a", "unknown", "none", "null"}

class ValidationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ValidationAgent")

    @staticmethod
    def _is_empty_description(desc: str) -> bool:
        """Returns True if description is semantically empty."""
        if not desc:
            return True
        stripped = desc.strip()
        if not stripped:
            return True
        if stripped.lower() in _EMPTY_DESCRIPTION_SENTINELS:
            return True
        return False

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Validating {len(products)} products against compliance rules...")

        for p in products:
            existing_reasons = list(p.confidence.flagged_reasons)

            # 1. Structural Malformed Input Check
            #    ONLY for true structural/schema failures — NOT for missing entities
            mpn_upper = p.mfg_part_num.upper() if p.mfg_part_num else ""
            if "MALFORMED" in mpn_upper:
                p.confidence.needs_human_review = True
                if ReasonCode.MALFORMED_INPUT_DATA not in existing_reasons:
                    existing_reasons.append(ReasonCode.MALFORMED_INPUT_DATA)

            # 2. Unresolved Manufacturer Check
            #    This is NOT malformed input — it is a valid row with unresolved identity
            if p.manufacturer_name == "UNKNOWN" or p.confidence.manufacturer_confidence < 0.60:
                p.confidence.needs_human_review = True
                if ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY not in existing_reasons:
                    existing_reasons.append(ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY)

            # 3. Empty/Missing Description Check
            if self._is_empty_description(p.part_desc):
                p.confidence.needs_human_review = True
                if ReasonCode.MISSING_DESCRIPTION not in existing_reasons:
                    existing_reasons.append(ReasonCode.MISSING_DESCRIPTION)
                # If description is missing AND manufacturer is also unresolved,
                # there is insufficient context for any meaningful enrichment
                if p.manufacturer_name == "UNKNOWN" or p.confidence.manufacturer_confidence < 0.60:
                    if ReasonCode.INSUFFICIENT_PRODUCT_CONTEXT not in existing_reasons:
                        existing_reasons.append(ReasonCode.INSUFFICIENT_PRODUCT_CONTEXT)

            # 4. Description Char Limits Check
            if len(p.invoice_desc) > 50:
                p.invoice_desc = p.invoice_desc[:50]
            if len(p.short_desc) > 150:
                p.short_desc = p.short_desc[:150]

            p.confidence.flagged_reasons = existing_reasons

        self.logger.info("Validation completed successfully.")
        return products
