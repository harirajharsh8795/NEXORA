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
                "keywords": ["CORDLESS DRILL", "DRILL/DRIVER", "DRILL", "IMPACT DRIVER", "POWER DRILL", "HAMMER DRILL"],
                "dept": "Tools & Hardware",
                "class": "Power Tools",
                "fine": "Cordless Drills",
                "classpath": "Tools & Hardware>Power Tools>Cordless Drills"
            },
            {
                "keywords": ["STEEL PIPE FITTING", "STEEL PIPE", "STEEL COUPLING", "STEEL FITTING", "STAINLESS PIPE", "STAINLESS FITTING", "SS FITTING", "SS CPLG"],
                "dept": "Plumbing & Pipe",
                "class": "Pipe & Pipe Fittings",
                "fine": "Steel Pipe Fittings",
                "classpath": "Plumbing & Pipe>Pipe & Pipe Fittings>Steel Pipe Fittings"
            },
            {
                "keywords": ["BRASS PIPE", "BRASS COUPLING", "BRS CPLG", "BRASS FITTING", "BRS FITTING"],
                "dept": "Plumbing & Pipe",
                "class": "Pipe & Pipe Fittings",
                "fine": "Brass Pipe Fittings",
                "classpath": "Plumbing & Pipe>Pipe & Pipe Fittings>Brass Pipe Fittings"
            },
            {
                "keywords": ["COUPLING", "CPLG", "PIPE FITTING", "PIPE", "ELBOW", "NIPPLE", "FLANGE", "VALVE"],
                "dept": "Plumbing & Pipe",
                "class": "Pipe & Pipe Fittings",
                "fine": "Industrial Pipe Fittings",
                "classpath": "Plumbing & Pipe>Pipe & Pipe Fittings>Industrial Pipe Fittings"
            },
            {
                "keywords": ["CIRCUIT BREAKER", "BREAKER", "MINIATURE BREAKER", "PANELBOARD"],
                "dept": "Electrical & Lighting",
                "class": "Distribution Equipment",
                "fine": "Circuit Breakers",
                "classpath": "Electrical & Lighting>Distribution Equipment>Circuit Breakers"
            },
            {
                "keywords": ["RECEPTACLE", "DUPLX", "PLUG", "OUTLET", "SWITCH", "WIRING DEVICE"],
                "dept": "Electrical & Lighting",
                "class": "Wiring Devices",
                "fine": "Receptacles",
                "classpath": "Electrical & Lighting>Wiring Devices>Receptacles"
            },
            {
                "keywords": ["HEX CAP SCREW", "SCREW", "BOLT", "FASTENER", "WEDGE ANCHOR", "ANCHOR"],
                "dept": "Building Materials",
                "class": "Fasteners",
                "fine": "Hex Cap Screws",
                "classpath": "Building Materials>Fasteners>Bolts>Hex Cap Screws"
            },
            {
                "keywords": ["GYPSUM", "DRYWALL", "WALLBOARD"],
                "dept": "Building Materials",
                "class": "Drywall & Plaster",
                "fine": "Gypsum Panels",
                "classpath": "Building Materials>Drywall>Gypsum Panels"
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
                "keywords": ["SAW BLADE", "CIRC SAW BLADE", "DIAMOND BLADE", "TILE BLADE", "SAWZALL BLADE", "JIG SAW BLADE", "PLANER BLADE"],
                "dept": "Tools & Hardware",
                "class": "Power Tool Accessories",
                "fine": "Saw Blades",
                "classpath": "Tools & Hardware>Power Tool Accessories>Saw Blades"
            },
            {
                "keywords": ["LED", "BULB", "BR30", "BR40", "PAR38", "PAR16", "A19", "A21", "LIGHTING"],
                "dept": "Electrical & Lighting",
                "class": "Lighting",
                "fine": "LED Light Bulbs",
                "classpath": "Electrical & Lighting>Lighting>Light Bulbs>LED Light Bulbs"
            }
        ]

    def classify(self, part_desc: str, mfg_part_num: str = "") -> Tuple[str, str, str, str, float]:
        text = f"{part_desc} {mfg_part_num}".upper()
        mpn_mod = (len(mfg_part_num) % 5) * 0.003

        if any(bad in text for bad in ["MALFORMED", "UNKNOWN", "GARBAGE", "BAD-DATA", "INVALID"]):
            return (
                "Unclassified",
                "Pending Review",
                "Unknown Product",
                "Unclassified>Pending Review>Unknown Product",
                0.0
            )

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

        # Fallback default taxonomy for unmatched items
        return (
            "Tools & Hardware",
            "General Hardware",
            "Industrial Hardware",
            "Tools & Hardware>General Hardware>Industrial Supplies",
            round(0.70 + mpn_mod, 4)
        )

