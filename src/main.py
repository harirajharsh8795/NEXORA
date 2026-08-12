import sys
import time
import pandas as pd
from pathlib import Path

# Ensure UTF-8 stdout encoding for Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import INPUT_CSV_PATH, DELIVERY_FORMAT_PATH, FINAL_OUTPUT_CSV_PATH
from src.utils.csv_handler import read_input_csv, export_delivery_csv
from src.agents.entity_resolution_agent import EntityResolutionAgent
from src.agents.classification_agent import ClassificationAgent
from src.agents.attribute_agent import AttributeAgent
from src.agents.content_agent import ContentAgent
from src.agents.validation_agent import ValidationAgent
from src.agents.review_agent import ReviewAgent
from evaluation.metrics import BenchmarkMetrics

def main():
    start_time = time.time()

    print("=========================================================")
    print("[+] UNIHACK PRODUCT INTELLIGENCE AGENT PIPELINE RUNNING")
    print("=========================================================")

    # 1. Read input
    print(f"\n[Stage 0] Loading raw input dataset: {INPUT_CSV_PATH}...")
    records = read_input_csv(INPUT_CSV_PATH)
    print(f"[OK] Successfully loaded {len(records)} raw SKUs.")

    # 2. Entity Resolution
    print("\n[Stage 1 & 2] Executing Entity Resolution Agent (Manufacturer + Brand)...")
    er_agent = EntityResolutionAgent()
    products = er_agent.process(records)
    print(f"[OK] Entity resolution completed for {len(products)} products.")

    # 3. Classification
    print("\n[Stage 3] Executing Product Classification Agent (Taxonomy / Classpath)...")
    cls_agent = ClassificationAgent()
    products = cls_agent.process(products)
    print(f"[OK] Classification completed.")

    # 4. Attribute Extraction & Normalization
    print("\n[Stage 4 & 5] Executing Attribute Extraction & Normalization Agent...")
    attr_agent = AttributeAgent()
    products = attr_agent.process(products)
    print(f"[OK] Attribute extraction completed.")

    # 5. Content Generation
    print("\n[Stage 7] Executing Content Generation Agent (Mobile, Invoice, Short, Long, Retail)...")
    content_agent = ContentAgent()
    products = content_agent.process(products)
    print(f"[OK] Content generation completed.")

    # 6. Validation Engine
    print("\n[Stage 8] Executing Validation Engine...")
    val_agent = ValidationAgent()
    products = val_agent.process(products)
    print(f"[OK] Validation rules applied.")

    # 7. Confidence & Human Review Routing
    print("\n[Stage 9] Executing Confidence Router & Human Review Agent...")
    review_agent = ReviewAgent()
    approved, review_queue = review_agent.process(products)

    # 8. Export Final Output
    export_delivery_csv(products, FINAL_OUTPUT_CSV_PATH)
    elapsed_time = round(time.time() - start_time, 2)
    print(f"\n[OK] Full Commerce-Ready Output Exported to: {FINAL_OUTPUT_CSV_PATH}")

    # 9. Evaluation Benchmarking
    print("\n=========================================================")
    print("EVALUATION BENCHMARK SCORECARD")
    print("=========================================================")
    gt_df = pd.read_csv(DELIVERY_FORMAT_PATH, dtype=str).fillna("")
    metrics = BenchmarkMetrics.evaluate(products, gt_df)

    print(f"  * Manufacturer Resolution Accuracy:  {metrics.get('manufacturer_accuracy', 0)}%")
    print(f"  * Brand Resolution Accuracy:         {metrics.get('brand_accuracy', 0)}%")
    print(f"  * Classpath Taxonomy Accuracy:       {metrics.get('classification_accuracy', 0)}%")
    print(f"  * LOV Compliance Rate:               {metrics.get('lov_compliance', 0)}%")
    print(f"  * UOM Compliance Rate:               {metrics.get('uom_compliance', 0)}%")
    print(f"  * Auto-Approval Rate (Conf >= 85%):  {(len(approved)/len(products))*100:.1f}%")
    print(f"  * Human Review Required Rate:        {(len(review_queue)/len(products))*100:.1f}%")
    print(f"  * Total Attributes Extracted:        {metrics.get('total_attributes_extracted', 0)}")
    print(f"  * Total Pipeline Time:              {elapsed_time}s ({round(elapsed_time/len(products), 4)}s/SKU)")
    print("=========================================================\n")

if __name__ == "__main__":
    main()
