import sys
import json
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from api.routes import load_or_run_pipeline

def export_json():
    print("Running pipeline to generate full 1,000 product JSON bundle for frontend...")
    products = load_or_run_pipeline()
    print(f"Total products processed: {len(products)}")

    data = [p.model_dump() for p in products]

    output_path = Path(__file__).resolve().parent.parent / "frontend" / "src" / "data" / "catalogData.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    size_bytes = output_path.stat().st_size
    size_mb = size_bytes / (1024 * 1024)
    print(f"Successfully exported {len(data)} SKUs to {output_path}")
    print(f"File Size: {size_bytes} bytes ({size_mb:.2f} MB)")

if __name__ == "__main__":
    export_json()
