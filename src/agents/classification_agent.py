from typing import List
from src.agents.base_agent import BaseAgent
from src.engines.classification_engine import ClassificationEngine
from src.models.product import EnrichedProduct
from src.models.evidence import EvidenceItem

class ClassificationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ClassificationAgent")
        self.engine = ClassificationEngine()

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Classifying {len(products)} products into taxonomy...")

        for p in products:
            dept, cat_class, fine, classpath, conf = self.engine.classify(p.part_desc, p.mfg_part_num)

            p.department = dept
            p.category_class = cat_class
            p.fine_line = fine
            p.classpath = classpath

            p.confidence.classpath_confidence = conf

            p.evidence_graph.add_evidence(EvidenceItem(
                field_name="Classpath",
                value=classpath,
                confidence=conf,
                source_type="taxonomy_rule_matcher",
                snippet=f"Desc: {p.part_desc}"
            ))

        self.logger.info("Classification completed successfully.")
        return products
