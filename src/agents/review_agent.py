from typing import List, Tuple
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct
from src.config import AUTO_APPROVE_CONFIDENCE_THRESHOLD
from src.models.reason_codes import has_blocking_reason, ReasonCode

class ReviewAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ReviewAgent")

    def process(self, products: List[EnrichedProduct]) -> Tuple[List[EnrichedProduct], List[EnrichedProduct]]:
        self.logger.info(f"Evaluating confidence & routing {len(products)} products...")

        approved = []
        human_review = []

        for p in products:
            overall = p.confidence.calculate_overall()

            # --- FINAL SAFETY GATE ---
            # Independent check: blocking reason codes override ANY numerical score.
            # This prevents high overall confidence from hiding unresolved identities.
            blocked = has_blocking_reason(p.confidence.flagged_reasons)

            # Also independently check critical field states directly on the product
            if p.manufacturer_name == "UNKNOWN" or p.confidence.manufacturer_confidence == 0.0:
                if ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY not in p.confidence.flagged_reasons:
                    p.confidence.flagged_reasons.append(ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY)
                blocked = True

            if blocked:
                p.confidence.needs_human_review = True
                human_review.append(p)
            elif overall >= AUTO_APPROVE_CONFIDENCE_THRESHOLD and not p.confidence.needs_human_review:
                p.confidence.needs_human_review = False
                approved.append(p)
            else:
                p.confidence.needs_human_review = True
                human_review.append(p)

        self.logger.info(f"Routing complete: {len(approved)} Auto-Approved ({(len(approved)/len(products))*100:.1f}%), {len(human_review)} Flagged for Human Review.")
        return approved, human_review
