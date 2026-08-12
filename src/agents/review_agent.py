from typing import List, Tuple
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct
from src.config import AUTO_APPROVE_CONFIDENCE_THRESHOLD

class ReviewAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ReviewAgent")

    def process(self, products: List[EnrichedProduct]) -> Tuple[List[EnrichedProduct], List[EnrichedProduct]]:
        self.logger.info(f"Evaluating confidence & routing {len(products)} products...")

        approved = []
        human_review = []

        for p in products:
            overall = p.confidence.calculate_overall()

            if overall >= AUTO_APPROVE_CONFIDENCE_THRESHOLD and not p.confidence.flagged_reasons:
                p.confidence.needs_human_review = False
                approved.append(p)
            else:
                p.confidence.needs_human_review = True
                human_review.append(p)

        self.logger.info(f"Routing complete: {len(approved)} Auto-Approved ({(len(approved)/len(products))*100:.1f}%), {len(human_review)} Flagged for Human Review.")
        return approved, human_review
