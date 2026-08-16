import re
from typing import Tuple, Dict

class ClassificationEngine:
    """Classifies raw SKUs into Dept, Class, Fine, and Classpath."""

    def __init__(self):
        # Rule patterns mapping keywords to taxonomy taxonomy
        self.rules = [
            {
                "keywords": ["DISHWASHER", "DISH WASHER"],
                "dept": "Appliances",
                "class": "Large Appliances",
                "fine": "Dishwashers",
                "classpath": "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers"
            },
            {
                "keywords": ["SANDING BELT", "ABRANET", "CUBITRON", "HIOLIT", "STIKIT", "ABRASIVE"],
                "dept": "Tools & Hardware",
                "class": "Abrasives",
                "fine": "Sanding Belts & Sheets",
                "classpath": "Tools & Hardware>Abrasives>Coated Abrasives>Sanding Belts & Sheets"
            },
            {
                "keywords": ["CUT-OFF DISC", "CUT OFF DISC", "CUT OFF WHEEL", "CUT-OFF WHEEL", "GRINDING DISC"],
                "dept": "Tools & Hardware",
                "class": "Abrasives",
                "fine": "Cut-Off Wheels",
                "classpath": "Tools & Hardware>Abrasives>Bonded Abrasives>Cut-Off Wheels"
            },
            {
                "keywords": ["SAW BLADE", "CIRC SAW BLADE", "DIAMOND BLADE", "TILE BLADE", "SAWZALL BLADE", "JIG SAW BLADE", "PLANER BLADE", "KNIVES"],
                "dept": "Tools & Hardware",
                "class": "Power Tool Accessories",
                "fine": "Saw Blades",
                "classpath": "Tools & Hardware>Power Tool Accessories>Saw Blades"
            },
            {
                "keywords": ["DECKING", "DECK BOARD", "TREX", "TIMBERTECH", "NATURALS DECKING", "BASICS DECKING"],
                "dept": "Building Materials",
                "class": "Lumber & Decking",
                "fine": "Deck Boards",
                "classpath": "Building Materials>Decking>Composite Decking Boards"
            },
            {
                "keywords": ["LED", "BULB", "BR30", "BR40", "PAR38", "PAR16", "A19", "A21", "LIGHTING", "SHAPER"],
                "dept": "Electrical",
                "class": "Lighting",
                "fine": "LED Light Bulbs",
                "classpath": "Electrical & Lighting>Lighting>Light Bulbs>LED Light Bulbs"
            },
            {
                "keywords": ["PLANER", "JOINTER", "SHAPER", "MITER SLED", "STOCK FEEDER"],
                "dept": "Tools & Hardware",
                "class": "Woodworking Machinery",
                "fine": "Stationary Machinery",
                "classpath": "Tools & Hardware>Woodworking Machinery>Stationary Machinery"
            }
        ]

    def classify(self, part_desc: str, mfg_part_num: str = "") -> Tuple[str, str, str, str, float]:
        text = f"{part_desc} {mfg_part_num}".upper()
        mpn_mod = (len(mfg_part_num) % 5) * 0.003

        for rule in self.rules:
            for kw in rule["keywords"]:
                if kw in text:
                    conf = round(0.95 + mpn_mod, 4)
                    return (
                        rule["dept"],
                        rule["class"],
                        rule["fine"],
                        rule["classpath"],
                        conf
                    )

        # Fallback default taxonomy
        return (
            "Tools & Hardware",
            "General Hardware",
            "Industrial Hardware",
            "Tools & Hardware>General Hardware>Industrial Supplies",
            round(0.70 + mpn_mod, 4)
        )

