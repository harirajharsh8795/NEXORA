from typing import List
from src.agents.base_agent import BaseAgent
from src.engines.attribute_engine import AttributeEngine
from src.models.product import EnrichedProduct
from src.models.evidence import EvidenceItem

class AttributeAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="AttributeAgent")
        self.engine = AttributeEngine()

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Extracting attributes for {len(products)} products...")

        for p in products:
            attrs = self.engine.extract_attributes(
                part_desc=p.part_desc,
                mfg_part_num=p.mfg_part_num,
                brand=p.brand_name,
                manuf=p.manufacturer_name,
                classpath=p.classpath
            )
            p.attributes = attrs

            # Calculate average attribute confidence
            if attrs:
                avg_attr_conf = sum(a.confidence for a in attrs) / len(attrs)
            else:
                avg_attr_conf = 0.80

            p.confidence.attribute_confidence = round(avg_attr_conf, 4)

            # Record evidence for extracted attributes
            for attr in attrs:
                p.evidence_graph.add_evidence(EvidenceItem(
                    field_name=f"ATTRIBUTE_{attr.label}",
                    value=f"{attr.value} {attr.uom}".strip(),
                    confidence=attr.confidence,
                    source_type="attribute_extraction_regex",
                    validated_by_lov=attr.is_lov_valid,
                    validated_by_uom=attr.is_uom_standardized
                ))

        self.logger.info("Attribute extraction completed successfully.")
        return products
