import re
from typing import List, Dict, Any, Tuple
from src.models.attribute import AttributeTriplet
from src.engines.uom_engine import UOMEngine
from src.engines.normalization_engine import NormalizationEngine

class AttributeEngine:
    """Extracts structured (Label, Value, UOM) triplets based on description and classification."""

    def __init__(self):
        self.uom_engine = UOMEngine()
        self.norm_engine = NormalizationEngine()

    def extract_attributes(self, part_desc: str, mfg_part_num: str, brand: str, manuf: str, classpath: str) -> List[AttributeTriplet]:
        triplets: List[AttributeTriplet] = []
        text = f"{part_desc} {mfg_part_num}".strip()

        # 1. Product Type / Subcategory
        prod_type = self._extract_product_type(text, classpath)
        if prod_type:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Product Type",
                value=prod_type,
                uom="",
                confidence=0.95
            ))

        # 2. Brand
        if brand:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Brand",
                value=brand,
                uom="",
                confidence=0.98
            ))

        # 3. Model / MPN
        if mfg_part_num:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Model",
                value=mfg_part_num,
                uom="",
                confidence=1.0
            ))

        # 4. Dimensions & Specifications (Regex extraction)
        # Grit Size (e.g., P150, P120, P80, 80 Grit)
        grit_match = re.search(r"\b(P\d{2,4}|\d{2,4}\s*Grit)\b", text, re.IGNORECASE)
        if grit_match:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Grit",
                value=grit_match.group(1).upper(),
                uom="",
                confidence=0.95
            ))

        # Dimensions e.g. 5"x.045"x7/8", 1/2"x18", 1nx6-16'
        dim_match = re.search(r"(\d+(?:\.\d+)?(?:/\d+)?)\s*(?:\"|in)?\s*[xX]\s*(\d+(?:\.\d+)?(?:/\d+)?)\s*(?:\"|in)?(?:\s*[xX]\s*(\d+(?:\.\d+)?(?:/\d+)?)\s*(?:\"|in)?)?", text)
        if dim_match:
            dims = [d for d in dim_match.groups() if d]
            if len(dims) == 1:
                triplets.append(AttributeTriplet(
                    index=len(triplets)+1,
                    label="Diameter",
                    value=self.norm_engine.normalize_dimension_value(dims[0]),
                    uom="in",
                    confidence=0.90
                ))
            elif len(dims) == 2:
                triplets.append(AttributeTriplet(
                    index=len(triplets)+1,
                    label="Size",
                    value=f"{dims[0]} in x {dims[1]} in",
                    uom="in",
                    confidence=0.90
                ))
            elif len(dims) == 3:
                triplets.append(AttributeTriplet(
                    index=len(triplets)+1,
                    label="Size",
                    value=f"{dims[0]} in x {dims[1]} in x {dims[2]} in",
                    uom="in",
                    confidence=0.90
                ))

        # Wattage (e.g. 40W, 100W, 60W, 3HP, 2HP)
        watt_match = re.search(r"\b(\d+(?:\.\d+)?)\s*(W|Watt|Watts)\b", text, re.IGNORECASE)
        if watt_match:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Wattage",
                value=watt_match.group(1),
                uom="W",
                confidence=0.95
            ))

        hp_match = re.search(r"\b(\d+(?:\.\d+)?)\s*(HP|Horsepower)\b", text, re.IGNORECASE)
        if hp_match:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Horsepower",
                value=hp_match.group(1),
                uom="HP",
                confidence=0.95
            ))

        # Voltage (e.g. 120V, 230V, 115V)
        volt_match = re.search(r"\b(\d{2,3})\s*(V|Volt|Volts)\b", text, re.IGNORECASE)
        if volt_match:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Voltage Rating",
                value=volt_match.group(1),
                uom="V",
                confidence=0.95
            ))

        # Tooth Count (e.g. 24T, 60 Tooth, 12Teeth)
        teeth_match = re.search(r"\b(\d{1,3})\s*(?:T|Tooth|Teeth)\b", text, re.IGNORECASE)
        if teeth_match:
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Number of Teeth",
                value=teeth_match.group(1),
                uom="",
                confidence=0.95
            ))

        # Color / Finish (e.g., Stainless Steel, SS, Honey Grove, Tide Pool, Pebble Beach)
        if "SS" in text.split() or "STAINLESS" in text.upper():
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Material",
                value="Stainless Steel",
                uom="",
                confidence=0.95
            ))

        return triplets

    def _extract_product_type(self, text: str, classpath: str) -> str:
        text_upper = text.upper()
        if "DISHWASHER" in text_upper:
            return "Dishwasher"
        if "SANDING BELT" in text_upper:
            return "Sanding Belt"
        if "CUT-OFF DISC" in text_upper or "CUT OFF DISC" in text_upper:
            return "Cut-Off Disc"
        if "SAW BLADE" in text_upper or "BLADE" in text_upper:
            return "Saw Blade"
        if "DECKING" in text_upper:
            return "Decking Board"
        if "BULB" in text_upper or "LED" in text_upper:
            return "LED Light Bulb"
        if "PLANER" in text_upper:
            return "Planer"
        if "JOINTER" in text_upper:
            return "Jointer"
        return classpath.split(">")[-1] if ">" in classpath else "Hardware Item"
