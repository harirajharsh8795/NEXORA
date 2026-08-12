import csv
import pandas as pd
from typing import List, Dict, Any
from pathlib import Path
from src.models.product import RawSKURecord, EnrichedProduct
from src.models.attribute import AttributeTriplet
from src.config import INPUT_CSV_PATH, DELIVERY_FORMAT_PATH

def get_delivery_format_columns(sample_path: Path = DELIVERY_FORMAT_PATH) -> List[str]:
    """Reads exact 252 header columns from delivery format file."""
    with open(sample_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        return next(reader)

DELIVERY_COLUMNS = get_delivery_format_columns()

def read_input_csv(file_path: Path = INPUT_CSV_PATH) -> List[RawSKURecord]:
    """Reads input CSV into list of RawSKURecord Pydantic objects."""
    records = []
    df = pd.read_csv(file_path, dtype=str).fillna("")
    for _, row in df.iterrows():
        record = RawSKURecord(
            mfg_part_num=str(row.get("Mfg_Part_Num", "")).strip(),
            part_desc=str(row.get("Part_Desc", "")).strip(),
            e1_brand=str(row.get("E1_Brand", "")).strip() if "E1_Brand" in row else None,
            unilog_brand=str(row.get("Unilog_Brand", "")).strip() if "Unilog_Brand" in row else None,
            dib_brand=str(row.get("DIB_Brand", "")).strip() if "DIB_Brand" in row else None,
            part_manuf=str(row.get("Part_Manuf", "")).strip() if "Part_Manuf" in row else None,
        )
        records.append(record)
    return records

def product_to_delivery_row(product: EnrichedProduct) -> Dict[str, Any]:
    """Maps EnrichedProduct object to exact delivery format row dictionary."""
    row = {col: "" for col in DELIVERY_COLUMNS}

    # URLs
    row["MFR URL"] = product.mfr_url or ""
    for i, ref in enumerate(product.ref_urls[:5]):
        row[f"Ref URL {i+1}"] = ref

    # Core Identifiers & Brand
    row["PART_NUMBER"] = product.mfg_part_num
    row["Dept"] = product.department
    row["Class"] = product.category_class
    row["Fine"] = product.fine_line
    row["SKU - MY_PART_NUMBER"] = product.mfg_part_num
    row["Mfg_Part_Num"] = product.mfg_part_num
    row["Part_Desc"] = product.part_desc
    row["E1_Brand"] = product.raw_brand or "-- Unbranded --"
    row["Unilog_Brand"] = "-- No Unilog Brand --"
    row["DIB_Brand"] = "-- No DIB Brand --"
    row["Part_Manuf"] = product.raw_manuf or ""
    row["MANUFACTURER_NAME"] = product.manufacturer_name
    row["BRAND_NAME"] = product.brand_name
    row["TRADE_NAME"] = product.trade_name or ""
    row["MANUFACTURER_PART_NUMBER"] = product.manufacturer_part_number or product.mfg_part_num
    row["ALTERNATE_PART_NUMBER"] = product.alternate_part_number or ""
    row["Classpath"] = product.classpath

    # Descriptions
    row["MOBILE_DESC"] = product.mobile_desc
    row["INVOICE_DESC"] = product.invoice_desc
    row["SHORT_DESC"] = product.short_desc
    row["LONG_DESC1"] = product.long_desc1
    row["RETAIL_DESC"] = product.retail_desc
    row["MARKETING_DESCRIPTION"] = product.marketing_description

    # Features (ITEM_FEATURES_1 to 20)
    for i, feature in enumerate(product.item_features[:20]):
        row[f"ITEM_FEATURES_{i+1}"] = feature

    # Supplementary
    row["With"] = product.with_spec or ""
    row["Standard/Approvals"] = product.standard_approvals or ""
    row["Prop 65"] = product.prop_65 or ""
    row["Application"] = product.application or ""
    row["Includes"] = product.includes or ""
    row["Product Name"] = product.product_name or ""

    # Attributes (ATTRIBUTE_LABEL 1..50, ATTRIBUTE_VALUE 1..50, ATTRIBUTE_UOM 1..50)
    attr_map = {attr.index: attr for attr in product.attributes}
    for i in range(1, 51):
        if i in attr_map:
            attr = attr_map[i]
            row[f"ATTRIBUTE_LABEL {i}"] = attr.label
            row[f"ATTRIBUTE_VALUE {i}"] = attr.value
            row[f"ATTRIBUTE_UOM {i}"] = attr.uom or ""

    # Commerce
    row["UPC"] = product.upc or ""
    row["EAN"] = product.ean or ""
    row["GTIN"] = product.gtin or ""
    row["UNSPSC"] = product.unspsc or ""
    row["Warranty"] = product.warranty or ""
    row["List Price"] = product.list_price or ""
    row["Selling Qty"] = product.selling_qty or ""
    row["Selling UOM"] = product.selling_uom or ""

    # Dimensions
    row["LENGTH"] = product.length or ""
    row["LENGTH_UOM"] = product.length_uom or ""
    row["HEIGHT"] = product.height or ""
    row["HEIGHT_UOM"] = product.height_uom or ""
    row["WIDTH"] = product.width or ""
    row["WIDTH_UOM"] = product.width_uom or ""
    row["WEIGHT"] = product.weight or ""
    row["WEIGHT_UOM"] = product.weight_uom or ""
    row["VOLUME"] = product.volume or ""
    row["VOLUME_UOM"] = product.volume_uom or ""

    # Media & Docs
    row["Product Image"] = product.product_image or ""
    for i, img in enumerate(product.alternate_images[:4]):
        row[f"Alternate Image {i+1}"] = img
    row["Specification Sheet"] = product.specification_sheet or ""
    row["Instruction/Installation Manual"] = product.instruction_manual or ""
    row["Actual Image (Yes/No)"] = product.actual_image_yes_no

    return row

def export_delivery_csv(products: List[EnrichedProduct], output_path: Path):
    """Exports list of EnrichedProduct objects into a delivery format CSV file."""
    rows = [product_to_delivery_row(p) for p in products]
    df = pd.DataFrame(rows, columns=DELIVERY_COLUMNS)
    df.to_csv(output_path, index=False, encoding="utf-8")
    return output_path
