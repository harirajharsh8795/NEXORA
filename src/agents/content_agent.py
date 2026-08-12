from typing import List
from src.agents.base_agent import BaseAgent
from src.models.product import EnrichedProduct
from src.engines.normalization_engine import NormalizationEngine

class ContentAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ContentAgent")
        self.norm = NormalizationEngine()

    def process(self, products: List[EnrichedProduct]) -> List[EnrichedProduct]:
        self.logger.info(f"Generating content representations for {len(products)} products...")

        for p in products:
            attrs_dict = {a.label: a.value for a in p.attributes}

            prod_type = attrs_dict.get("Product Type", "Product")
            brand = p.brand_name or p.manufacturer_name or ""
            mpn = p.mfg_part_num
            desc = p.part_desc

            # 1. MOBILE_DESC
            p.mobile_desc = f"{p.manufacturer_name} {brand}, {prod_type}, {mpn}".strip()

            # 2. INVOICE_DESC (ALL-CAPS, abbreviated)
            attr_summary = " ".join([f"{a.value}{a.uom}" for a in p.attributes if a.label not in ["Brand", "Model"]])
            inv_raw = f"{prod_type} {mpn} {attr_summary}".upper()
            p.invoice_desc = inv_raw[:50]  # Max char limit constraint

            # 3. SHORT_DESC (Structured title)
            p.short_desc = f"{brand} {mpn} {desc}".strip()[:150]

            # 4. LONG_DESC1 (Comprehensive)
            attr_full = ", ".join([f"{a.label}: {a.value} {a.uom}".strip() for a in p.attributes])
            p.long_desc1 = f"{brand} {prod_type} (MPN: {mpn}). Features: {attr_full if attr_full else desc}".strip()

            # 5. RETAIL_DESC / MARKETING_DESCRIPTION
            p.retail_desc = f"{brand} {prod_type}, Model {mpn}."
            p.marketing_description = f"High-quality {brand} {prod_type} designed for professional performance."

            # Product Name
            p.product_name = prod_type

            # Features 1..5 summary from attributes
            p.item_features = [
                f"{a.label}: {a.value} {a.uom}".strip() for a in p.attributes
            ]

        self.logger.info("Content generation completed successfully.")
        return products
