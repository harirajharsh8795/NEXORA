import csv
import pandas as pd
from typing import List, Dict, Any, Tuple
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

def parse_raw_dataframe(df: pd.DataFrame) -> Tuple[List[RawSKURecord], List[str]]:
    """Flexibly maps headers of an input dataframe into RawSKURecord objects."""
    records = []
    warnings = []
    
    # Header normalization dictionary
    col_map = {}
    for col in df.columns:
        c_clean = str(col).strip().lower().replace(" ", "_").replace("-", "_")
        if c_clean in ["mfg_part_num", "mpn", "part_number", "mfg_part_no", "part_num", "sku"]:
            col_map["mfg_part_num"] = col
        elif c_clean in ["part_desc", "description", "part_description", "item_description", "desc"]:
            col_map["part_desc"] = col
        elif c_clean in ["e1_brand", "e1brand", "brand", "brand_name"]:
            col_map["e1_brand"] = col
        elif c_clean in ["unilog_brand", "unilogbrand"]:
            col_map["unilog_brand"] = col
        elif c_clean in ["dib_brand", "dibbrand"]:
            col_map["dib_brand"] = col
        elif c_clean in ["part_manuf", "manufacturer", "manuf", "part_manufacturer", "mfr_name"]:
            col_map["part_manuf"] = col

    mpn_col = col_map.get("mfg_part_num")
    desc_col = col_map.get("part_desc")

    if not mpn_col:
        warnings.append("Mfg_Part_Num column not explicitly found. Using first column or fallback identifiers.")
    if not desc_col:
        warnings.append("Part_Desc column not explicitly found. Using secondary text column or empty description.")

    df_filled = df.fillna("")

    for idx, row in df_filled.iterrows():
        raw_mpn = str(row[mpn_col]).strip() if mpn_col and mpn_col in row else ""
        raw_desc = str(row[desc_col]).strip() if desc_col and desc_col in row else ""

        # Handle missing MPN or description gracefully
        if not raw_mpn:
            raw_mpn = f"RAW-ROW-{idx + 1}"
            warnings.append(f"Row {idx + 1}: Missing MPN assigned fallback '{raw_mpn}'")
        
        if not raw_desc and len(row) > 1:
            # Fallback to any string column if description missing
            for col_val in row.values:
                val_str = str(col_val).strip()
                if val_str and val_str != raw_mpn:
                    raw_desc = val_str
                    break

        record = RawSKURecord(
            mfg_part_num=raw_mpn,
            part_desc=raw_desc,
            e1_brand=str(row.get(col_map.get("e1_brand", ""), "")).strip() or None,
            unilog_brand=str(row.get(col_map.get("unilog_brand", ""), "")).strip() or None,
            dib_brand=str(row.get(col_map.get("dib_brand", ""), "")).strip() or None,
            part_manuf=str(row.get(col_map.get("part_manuf", ""), "")).strip() or None,
        )
        records.append(record)

    return records, warnings

def read_input_csv(file_path: Path = INPUT_CSV_PATH) -> List[RawSKURecord]:
    """Reads input CSV into list of RawSKURecord Pydantic objects."""
    df = pd.read_csv(file_path, dtype=str).fillna("")
    records, _ = parse_raw_dataframe(df)
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
