from typing import List
from src.agents.base_agent import BaseAgent
from src.engines.cleaning_engine import DataCleaningEngine
from src.engines.fuzzy_matcher import FuzzyMatcher
from src.models.product import EnrichedProduct, RawSKURecord
from src.models.evidence import EvidenceItem

class EntityResolutionAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="EntityResolutionAgent")
        self.cleaner = DataCleaningEngine()
        self.matcher = FuzzyMatcher()

    def process(self, raw_records: List[RawSKURecord]) -> List[EnrichedProduct]:
        enriched_products = []
        self.logger.info(f"Processing entity resolution for {len(raw_records)} records...")

        for rec in raw_records:
            clean_data = self.cleaner.clean_record(rec.model_dump())

            # Manufacturer Resolution
            resolved_manuf, manuf_conf = self.matcher.resolve_manufacturer(
                clean_data["clean_manuf_name"],
                clean_data["part_desc"] or ""
            )

            # Brand Resolution
            resolved_brand, brand_conf = self.matcher.resolve_brand(
                clean_data["e1_brand"] or clean_data["unilog_brand"] or clean_data["dib_brand"],
                resolved_manuf,
                clean_data["part_desc"] or ""
            )

            product = EnrichedProduct(
                mfg_part_num=clean_data["mfg_part_num"] or "",
                part_desc=clean_data["part_desc"] or "",
                raw_manuf=rec.part_manuf,
                raw_brand=rec.e1_brand,
                manufacturer_name=resolved_manuf,
                brand_name=resolved_brand,
                manufacturer_part_number=clean_data["mfg_part_num"] or "",
            )

            product.confidence.manufacturer_confidence = manuf_conf
            product.confidence.brand_confidence = brand_conf

            product.evidence_graph.product_mpn = product.mfg_part_num
            product.evidence_graph.add_evidence(EvidenceItem(
                field_name="MANUFACTURER_NAME",
                value=resolved_manuf,
                confidence=manuf_conf,
                source_type="fuzzy_match" if manuf_conf < 1.0 else "exact_match",
                snippet=f"Raw: {rec.part_manuf}"
            ))
            product.evidence_graph.add_evidence(EvidenceItem(
                field_name="BRAND_NAME",
                value=resolved_brand,
                confidence=brand_conf,
                source_type="rule_inference" if brand_conf < 0.98 else "exact_match",
                snippet=f"Raw: {rec.e1_brand} | Desc: {rec.part_desc}"
            ))

            enriched_products.append(product)

        self.logger.info("Entity resolution completed successfully.")
        return enriched_products
