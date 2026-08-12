from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from src.models.attribute import AttributeTriplet
from src.models.confidence import ConfidenceScore
from src.models.evidence import EvidenceGraph

class RawSKURecord(BaseModel):
    mfg_part_num: str
    part_desc: str
    e1_brand: Optional[str] = None
    unilog_brand: Optional[str] = None
    dib_brand: Optional[str] = None
    part_manuf: Optional[str] = None

class EnrichedProduct(BaseModel):
    # Raw Inputs
    mfg_part_num: str
    part_desc: str
    raw_manuf: Optional[str] = None
    raw_brand: Optional[str] = None

    # Resolved Entities
    manufacturer_name: str = ""
    brand_name: str = ""
    trade_name: Optional[str] = ""
    manufacturer_part_number: str = ""
    alternate_part_number: Optional[str] = ""

    # Classification
    department: str = ""
    category_class: str = ""
    fine_line: str = ""
    classpath: str = ""

    # Descriptions
    mobile_desc: str = ""
    invoice_desc: str = ""
    short_desc: str = ""
    long_desc1: str = ""
    retail_desc: str = ""
    marketing_description: str = ""

    # Features (1 to 20)
    item_features: List[str] = Field(default_factory=list)

    # Attributes (1 to 50 triplets)
    attributes: List[AttributeTriplet] = Field(default_factory=list)

    # Supplementary Fields
    with_spec: Optional[str] = ""
    standard_approvals: Optional[str] = ""
    prop_65: Optional[str] = ""
    application: Optional[str] = ""
    includes: Optional[str] = ""
    product_name: str = ""

    # Identifiers & Commerce
    upc: Optional[str] = ""
    ean: Optional[str] = ""
    gtin: Optional[str] = ""
    unspsc: Optional[str] = ""
    warranty: Optional[str] = ""
    list_price: Optional[str] = ""
    selling_qty: Optional[str] = ""
    selling_uom: Optional[str] = ""

    # Dimensions
    length: Optional[str] = ""
    length_uom: Optional[str] = ""
    height: Optional[str] = ""
    height_uom: Optional[str] = ""
    width: Optional[str] = ""
    width_uom: Optional[str] = ""
    weight: Optional[str] = ""
    weight_uom: Optional[str] = ""
    volume: Optional[str] = ""
    volume_uom: Optional[str] = ""

    # Media & Links
    mfr_url: Optional[str] = ""
    ref_urls: List[str] = Field(default_factory=list)
    product_image: Optional[str] = ""
    alternate_images: List[str] = Field(default_factory=list)
    specification_sheet: Optional[str] = ""
    instruction_manual: Optional[str] = ""
    actual_image_yes_no: str = "Yes"

    # Governance & Provenance
    confidence: ConfidenceScore = Field(default_factory=ConfidenceScore)
    evidence_graph: EvidenceGraph = Field(default_factory=lambda: EvidenceGraph(product_mpn=""))
