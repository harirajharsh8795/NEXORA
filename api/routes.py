import io
import tempfile
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from src.config import FINAL_OUTPUT_CSV_PATH, DELIVERY_FORMAT_PATH, INPUT_CSV_PATH
from src.utils.csv_handler import read_input_csv, parse_raw_dataframe, export_delivery_csv, product_to_delivery_row, DELIVERY_COLUMNS
from src.models.product import RawSKURecord, EnrichedProduct
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.enrichment_agent import EnrichmentAgent
from src.agents.content_agent import ContentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from evaluation.metrics import BenchmarkMetrics

router = APIRouter(prefix="/api")

# Global in-memory cache for processed products
PROCESSED_CACHE: List[EnrichedProduct] = []

def run_pipeline_for_records(records: List[RawSKURecord]) -> List[EnrichedProduct]:
    """Runs the 8-stage agent pipeline on any list of RawSKURecord objects."""
    er = EntityResolutionAgent()
    products = er.process(records)
    products = ClassificationAgent().process(products)
    products = AttributeAgent().process(products)
    products = EnrichmentAgent().process(products)
    products = ContentAgent().process(products)
    products = ValidationAgent().process(products)
    approved, review = ReviewAgent().process(products)
    return products

def load_or_run_pipeline() -> List[EnrichedProduct]:
    global PROCESSED_CACHE
    if PROCESSED_CACHE:
        return PROCESSED_CACHE

    records = read_input_csv(INPUT_CSV_PATH)
    PROCESSED_CACHE = run_pipeline_for_records(records)
    return PROCESSED_CACHE

@router.get("/status")
def get_pipeline_status():
    products = load_or_run_pipeline()
    approved = [p for p in products if not p.confidence.needs_human_review]
    review = [p for p in products if p.confidence.needs_human_review]
    total_attrs = sum(len(p.attributes) for p in products)

    gt_df = pd.read_csv(DELIVERY_FORMAT_PATH, dtype=str).fillna("")
    metrics = BenchmarkMetrics.evaluate(products, gt_df)

    return {
        "total_skus": len(products),
        "auto_approved_count": len(approved),
        "human_review_count": len(review),
        "auto_approval_rate": round((len(approved) / max(len(products), 1)) * 100, 1),
        "total_attributes_extracted": total_attrs,
        "metrics": metrics
    }

@router.get("/products")
def get_products(
    status: Optional[str] = Query(None, description="approved, review, all"),
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 1000
):
    products = load_or_run_pipeline()
    filtered = products

    if status == "approved":
        filtered = [p for p in filtered if not p.confidence.needs_human_review]
    elif status == "review":
        filtered = [p for p in filtered if p.confidence.needs_human_review]

    if search:
        search_lower = search.lower()
        filtered = [
            p for p in filtered
            if search_lower in p.mfg_part_num.lower()
            or search_lower in p.part_desc.lower()
            or search_lower in p.brand_name.lower()
            or search_lower in p.manufacturer_name.lower()
        ]

    start = (page - 1) * limit
    end = start + limit
    paginated = filtered[start:end]

    return {
        "total": len(filtered),
        "page": page,
        "limit": limit,
        "products": [p.model_dump() for p in paginated]
    }

@router.get("/product/{mpn}")
def get_product_detail(mpn: str):
    products = load_or_run_pipeline()
    for p in products:
        if p.mfg_part_num.lower() == mpn.lower():
            return {
                "product": p.model_dump(),
                "evidence": p.evidence_graph.model_dump(),
            }
    raise HTTPException(status_code=404, detail=f"Product MPN '{mpn}' not found.")

@router.get("/benchmark")
def get_benchmark():
    products = load_or_run_pipeline()
    gt_df = pd.read_csv(DELIVERY_FORMAT_PATH, dtype=str).fillna("")
    return BenchmarkMetrics.evaluate(products, gt_df)

@router.post("/upload")
async def upload_evaluator_file(file: UploadFile = File(...)):
    """Dynamically uploads and processes custom evaluator CSV or XLSX files."""
    global PROCESSED_CACHE
    filename = file.filename or ""
    contents = await file.read()

    try:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(contents), dtype=str).fillna("")
        else:
            df = pd.read_csv(io.BytesIO(contents), dtype=str).fillna("")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse uploaded file: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded dataset is empty.")

    records, warnings = parse_raw_dataframe(df)
    processed_products = run_pipeline_for_records(records)

    # Update global cache with evaluator dataset
    PROCESSED_CACHE = processed_products

    approved = [p for p in processed_products if not p.confidence.needs_human_review]
    review = [p for p in processed_products if p.confidence.needs_human_review]

    return {
        "status": "SUCCESS",
        "filename": filename,
        "total_skus": len(processed_products),
        "auto_approved_count": len(approved),
        "human_review_count": len(review),
        "auto_approval_rate": round((len(approved) / max(len(processed_products), 1)) * 100, 1),
        "warnings": warnings,
        "products": [p.model_dump() for p in processed_products]
    }

@router.post("/v1/enrich-batch")
def enrich_batch_payload(payload: Dict[str, Any] = Body(...)):
    """Dynamically enriches a batch of raw SKU dictionaries."""
    global PROCESSED_CACHE
    items = payload.get("products") or payload.get("items") or []
    if not items and isinstance(payload, list):
        items = payload

    if not items:
        raise HTTPException(status_code=400, detail="No product records provided in payload.")

    records = []
    for idx, item in enumerate(items):
        mpn = str(item.get("Mfg_Part_Num") or item.get("mfg_part_num") or item.get("mpn") or f"SKU-{idx+1}").strip()
        desc = str(item.get("Part_Desc") or item.get("part_desc") or item.get("description") or "").strip()
        record = RawSKURecord(
            mfg_part_num=mpn,
            part_desc=desc,
            e1_brand=item.get("E1_Brand") or item.get("e1_brand"),
            unilog_brand=item.get("Unilog_Brand") or item.get("unilog_brand"),
            dib_brand=item.get("DIB_Brand") or item.get("dib_brand"),
            part_manuf=item.get("Part_Manuf") or item.get("part_manuf") or item.get("manufacturer")
        )
        records.append(record)

    processed_products = run_pipeline_for_records(records)
    PROCESSED_CACHE = processed_products

    return {
        "status": "SUCCESS",
        "total_processed": len(processed_products),
        "products": [p.model_dump() for p in processed_products]
    }

@router.post("/v1/enrich/{mpn}")
@router.post("/v1/enrich")
def enrich_single_sku(
    mpn: Optional[str] = None,
    payload: Optional[Dict[str, Any]] = Body(None)
):
    """Triggers dynamic single-SKU AI enrichment pipeline without hardcoded fallbacks."""
    target_mpn = mpn or (payload.get("mfg_part_num") or payload.get("mpn") if payload else "D0724A")
    part_desc = payload.get("part_desc") or payload.get("description") or "" if payload else ""
    raw_manuf = payload.get("part_manuf") or payload.get("manufacturer") if payload else None
    raw_brand = payload.get("e1_brand") or payload.get("brand") if payload else None

    # Check if SKU exists in current cache
    products = load_or_run_pipeline()
    for p in products:
        if p.mfg_part_num.lower() == target_mpn.lower():
            return {
                "status": "SUCCESS",
                "mpn": p.mfg_part_num,
                "product": p.model_dump(),
                "evidence": p.evidence_graph.model_dump(),
                "enrichment_source": "cached_pipeline_result",
                "confidence_score": p.confidence.overall_confidence
            }

    # Dynamically process unseen single SKU
    raw_rec = RawSKURecord(
        mfg_part_num=target_mpn,
        part_desc=part_desc or f"Product {target_mpn}",
        part_manuf=raw_manuf,
        e1_brand=raw_brand
    )
    dynamic_results = run_pipeline_for_records([raw_rec])
    target = dynamic_results[0]

    return {
        "status": "SUCCESS",
        "mpn": target.mfg_part_num,
        "product": target.model_dump(),
        "evidence": target.evidence_graph.model_dump(),
        "enrichment_source": "dynamic_single_sku_pipeline",
        "confidence_score": target.confidence.overall_confidence
    }

@router.get("/export")
@router.get("/v1/export")
def export_current_delivery_csv():
    """Generates and downloads the exact 252-column CX1 delivery format CSV for current active dataset."""
    products = load_or_run_pipeline()
    rows = [product_to_delivery_row(p) for p in products]
    df = pd.DataFrame(rows, columns=DELIVERY_COLUMNS)
    
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False, encoding="utf-8-sig")
    csv_buffer.seek(0)

    return StreamingResponse(
        io.BytesIO(csv_buffer.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=nexora_enriched_catalog_252col.csv"}
    )


