import re
from typing import List, Dict, Any, Tuple
from src.models.attribute import AttributeTriplet
from src.engines.uom_engine import UOMEngine
from src.engines.normalization_engine import NormalizationEngine
from src.engines.fraction_engine import FractionNormalizationEngine

class AttributeEngine:
    """Extracts structured (Label, Value, UOM) triplets based on description and classification."""

    def __init__(self):
        self.uom_engine = UOMEngine()
        self.norm_engine = NormalizationEngine()
        self.fraction_engine = FractionNormalizationEngine()


    def extract_attributes(self, part_desc: str, mfg_part_num: str, brand: str, manuf: str, classpath: str) -> List[AttributeTriplet]:
        triplets: List[AttributeTriplet] = []
        text = f"{part_desc} {mfg_part_num}".strip()
        text_upper = text.upper()

        if not part_desc or not part_desc.strip() or any(bad in text_upper for bad in ["MALFORMED", "GARBAGE", "BAD-DATA", "INVALID"]):
            return []

        # 1. Product Type / Subcategory
        prod_type = self._extract_product_type(text, classpath)
        if prod_type and prod_type != "Unknown Product":
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Product Type",
                value=prod_type,
                uom="",
                confidence=0.95
            ))

        # 2. Brand
        if brand and brand != "-- Unbranded --" and brand != "UNKNOWN":
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Brand",
                value=brand,
                uom="",
                confidence=0.98
            ))

        # 3. Model / MPN
        if mfg_part_num and not any(bad in mfg_part_num.upper() for bad in ["MALFORMED", "GARBAGE"]):
            triplets.append(AttributeTriplet(
                index=len(triplets)+1,
                label="Model",
                value=mfg_part_num,
                uom="",
                confidence=1.0
            ))

        # 4. Product-Specific Specification Extraction
        # Power Tools (Drills / Drivers)
        if "DRILL" in text_upper or "IMPACT" in text_upper or "DRIVER" in text_upper:
            volt_match = re.search(r"\b(\d{1,2})\s*(V|Volt|Volts)\b", text, re.IGNORECASE)
            if volt_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Voltage Rating", value=volt_match.group(1), uom="V", confidence=0.96))

            drive_match = re.search(r"\b(1/2|1/4|3/8|5/8)\s*(?:in|\")?\s*(?:Chuck|Drive|Hex)\b", text, re.IGNORECASE)
            if drive_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Chuck Size", value=f"{drive_match.group(1)} in", uom="", confidence=0.95))

            if "BRUSHLESS" in text_upper:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Motor Type", value="Brushless", uom="", confidence=0.98))

        # Pipe Fittings & Couplings
        elif "COUPLING" in text_upper or "CPLG" in text_upper or "FITTING" in text_upper or "PIPE" in text_upper:
            size_match = re.search(r"\b(\d+/\d+|\d+(?:\.\d+)?)\s*(?:in|\"|#)?\s*(?:CPLG|COUPLING|BRS|PIPE)?\b", text, re.IGNORECASE)
            if size_match:
                norm_sz = self.fraction_engine.normalize_measurement(size_match.group(1), uom="in")
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Fitting Size", value=norm_sz, uom="in", confidence=0.92))

            if re.search(r"\b(BRASS|BRS)\b", text_upper):
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Material", value="Brass", uom="", confidence=0.98))
            elif re.search(r"\b(STAINLESS|STAINLESS STEEL)\b", text_upper) or "SS" in text_upper.split():
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Material", value="Stainless Steel", uom="", confidence=0.98))
            elif re.search(r"\bSTEEL\b", text_upper):
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Material", value="Carbon Steel", uom="", confidence=0.98))

            press_match = re.search(r"\b(150|300|125|250)\s*(?:#|lb|PSI)\b", text, re.IGNORECASE)
            if press_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Pressure Rating", value=f"{press_match.group(1)} lb", uom="", confidence=0.95))

        # Circuit Breakers
        elif "BREAKER" in text_upper:
            amp_match = re.search(r"\b(\d{1,3})\s*(A|Amp|Amps)\b", text, re.IGNORECASE)
            if amp_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Amperage Rating", value=amp_match.group(1), uom="A", confidence=0.96))
            volt_match = re.search(r"\b(\d{3})\s*(V|Volt|Volts)\b", text, re.IGNORECASE)
            if volt_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Voltage Rating", value=volt_match.group(1), uom="V", confidence=0.96))
            pole_match = re.search(r"\b([123])\s*(?:-|\s*)Pole\b", text, re.IGNORECASE)
            if pole_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Number of Poles", value=pole_match.group(1), uom="", confidence=0.96))

        # Saw Blades & Abrasives
        elif "SAW" in text_upper or "BLADE" in text_upper or "CUT-OFF" in text_upper or "ABRASIVE" in text_upper:
            dim_match = re.search(r"\b(\d+-\d+/\d+|\d+/\d+|\d+(?:\.\d+)?)\s*(?:in|\")?\s*(?:x|X)?\b", text)
            if dim_match:
                norm_dim = self.fraction_engine.normalize_measurement(dim_match.group(1), uom="in")
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Blade Diameter", value=norm_dim, uom="in", confidence=0.95))
            teeth_match = re.search(r"\b(\d{1,3})\s*(?:-|\s*)?(?:T|Tooth|Teeth)\b", text, re.IGNORECASE)
            if teeth_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Number of Teeth", value=teeth_match.group(1), uom="", confidence=0.95))

        # Appliances / Dishwashers (e.g. PDSH4816AF)
        elif "DISHWASHER" in text_upper or "REFRIGERATOR" in text_upper or "WASHER" in text_upper or "DRYER" in text_upper or "APPLIANCE" in text_upper:
            if "SS" in text_upper.split() or "STAINLESS" in text_upper:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Material", value="Stainless Steel", uom="", confidence=0.98))
            volt_match = re.search(r"\b(\d{3})\s*(V|Volt|Volts)\b", text, re.IGNORECASE)
            if volt_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Voltage Rating", value=volt_match.group(1), uom="V", confidence=0.96))
            amp_match = re.search(r"\b(\d{1,2})\s*(A|Amp|Amps)\b", text, re.IGNORECASE)
            if amp_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Amperage Rating", value=amp_match.group(1), uom="A", confidence=0.96))
            sound_match = re.search(r"\b(\d{2})\s*(dBA|dB)\b", text, re.IGNORECASE)
            if sound_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Sound Level", value=sound_match.group(1), uom="dBA", confidence=0.95))

        # Faucets & Plumbing Fixtures
        elif "FAUCET" in text_upper or "SINK" in text_upper or "TAP" in text_upper:
            gpm_match = re.search(r"\b(\d+(?:\.\d+)?)\s*(?:GPM)\b", text, re.IGNORECASE)
            if gpm_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Flow Rate", value=gpm_match.group(1), uom="GPM", confidence=0.96))
            if "CHROME" in text_upper:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Finish", value="Chrome", uom="", confidence=0.98))
            elif "NICKEL" in text_upper or "BRUSHED NICKEL" in text_upper:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Finish", value="Brushed Nickel", uom="", confidence=0.98))

        # Decking & Railing
        elif "DECKING" in text_upper or "DECK" in text_upper:
            len_match = re.search(r"\b(\d+)\s*(?:ft|feet|')\b", text, re.IGNORECASE)
            if len_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Length", value=len_match.group(1), uom="ft", confidence=0.95))
            if "COMPOSITE" in text_upper:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Material", value="Composite", uom="", confidence=0.98))

        # Bushings
        elif "BUSHING" in text_upper:
            sz_match = re.search(r"\b(\d+/\d+|\d+(?:\.\d+)?)\b", text, re.IGNORECASE)
            if sz_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Bushing Size", value=sz_match.group(1), uom="in", confidence=0.92))

        # HVAC
        elif "HVAC" in text_upper or "THERMOSTAT" in text_upper or "FURNACE" in text_upper:
            cfm_match = re.search(r"\b(\d{3,4})\s*(?:CFM)\b", text, re.IGNORECASE)
            if cfm_match:
                triplets.append(AttributeTriplet(index=len(triplets)+1, label="Air Flow", value=cfm_match.group(1), uom="CFM", confidence=0.96))

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
