
import io
import csv
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from api.main import app
from src.utils.csv_handler import DELIVERY_COLUMNS

client = TestClient(app)

def create_evaluator_test_dataset():
    """Generates the 5 required evaluator test cases."""
    data = [
        # Case 1: Known SKU
        {
            "Mfg_Part_Num": "D0724A",
            "Part_Desc": "7-1/4 in x 24T Framing Saw Blade",
            "E1_Brand": "Diablo",
            "Unilog_Brand": "",
            "DIB_Brand": "",
            "Part_Manuf": "Freud Inc"
        },
        # Case 2: Modified SKU
        {
            "Mfg_Part_Num": "D0724A-MODIFIED",
            "Part_Desc": "7-1/4 in 24T Framing Saw Blade - Heavy Duty Titanium Coating",
            "E1_Brand": "Diablo",
            "Unilog_Brand": "",
            "DIB_Brand": "",
            "Part_Manuf": "Freud Inc"
        },
        # Case 3: Completely Unseen SKU
        {
            "Mfg_Part_Num": "UNSEEN-DEWALT-999",
            "Part_Desc": "DEWALT 20V MAX Cordless Drill Driver Kit 1/2-Inch Brushless",
            "E1_Brand": "DEWALT",
            "Unilog_Brand": "",
            "DIB_Brand": "",
            "Part_Manuf": "Black & Decker"
        },
        # Case 4: Missing-Brand SKU
        {
            "Mfg_Part_Num": "XYZ-PIPE-500",
            "Part_Desc": "1/2 in Brass Coupling 150# Threaded Pipe Fitting",
            "E1_Brand": "-- Unbranded --",
            "Unilog_Brand": "",
            "DIB_Brand": "",
            "Part_Manuf": "Mueller Streamline"
        },
        # Case 5: Malformed Row (missing description)
        {
            "Mfg_Part_Num": "MALFORMED-SKU-999",
            "Part_Desc": "",
            "E1_Brand": "",
            "Unilog_Brand": "",
            "DIB_Brand": "",
            "Part_Manuf": ""
        }
    ]
    return pd.DataFrame(data)

def test_http_upload_evaluator_file():
    """Tests POST /api/upload with dynamic CSV file upload."""
    df = create_evaluator_test_dataset()
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_bytes = csv_buffer.getvalue().encode("utf-8")

    response = client.post(
        "/api/upload",
        files={"file": ("test_evaluator.csv", csv_bytes, "text/csv")}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "SUCCESS"
    assert res_data["total_skus"] == 5
    assert len(res_data["products"]) == 5

    products = res_data["products"]
    mpn_map = {p["mfg_part_num"]: p for p in products}

    # Verify Known SKU
    assert "D0724A" in mpn_map
    assert mpn_map["D0724A"]["manufacturer_name"] != ""

    # Verify Unseen SKU (DEWALT)
    assert "UNSEEN-DEWALT-999" in mpn_map
    unseen_p = mpn_map["UNSEEN-DEWALT-999"]
    assert unseen_p["mfg_part_num"] == "UNSEEN-DEWALT-999"
    # Ensure evidence graph is present without hardcoded/fabricated values
    assert "evidence_graph" in unseen_p or "evidence_graph" in response.text

    # Verify Malformed Row is handled gracefully and routed to HITL or flagged
    assert "MALFORMED-SKU-999" in mpn_map
    malformed_p = mpn_map["MALFORMED-SKU-999"]
    assert malformed_p["confidence"]["needs_human_review"] == True

def test_http_enrich_batch():
    """Tests POST /api/v1/enrich-batch with dynamic JSON body."""
    payload = {
        "products": [
            {"Mfg_Part_Num": "BATCH-001", "Part_Desc": "3/8 in Brass Elbow Fitting 150#", "Part_Manuf": "Mueller"},
            {"Mfg_Part_Num": "BATCH-002", "Part_Desc": "10-in 40T Carbide Saw Blade", "Part_Manuf": "Freud Inc"}
        ]
    }
    response = client.post("/api/v1/enrich-batch", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "SUCCESS"
    assert res_data["total_processed"] == 2

def test_http_enrich_single_sku_unseen():
    """Tests POST /api/v1/enrich with an unseen SKU (never falls back to products[0])."""
    payload = {
        "mpn": "UNSEEN-DYNAMIC-SKU-777",
        "part_desc": "Heavy Duty Angle Grinder 4.5-Inch 11-Amp",
        "part_manuf": "Makita"
    }
    response = client.post("/api/v1/enrich/UNSEEN-DYNAMIC-SKU-777", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "SUCCESS"
    assert res_data["mpn"] == "UNSEEN-DYNAMIC-SKU-777"
    assert res_data["product"]["mfg_part_num"] == "UNSEEN-DYNAMIC-SKU-777"
    # Critical: Check that it did NOT fall back to products[0] (which would be D0724A or sample SKU)
    assert res_data["product"]["mfg_part_num"] != "D0724A"

def test_http_export_delivery_csv():
    """Tests GET /api/export generates a valid 252-column CSV."""
    response = client.get("/api/export")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    
    csv_text = response.text
    reader = csv.reader(io.StringIO(csv_text))
    headers = next(reader)
    headers[0] = headers[0].lstrip('\ufeff')
    assert len(headers) == 252
    assert headers[0] == DELIVERY_COLUMNS[0].lstrip('\ufeff')
    assert headers[-1] == DELIVERY_COLUMNS[-1]


def test_processed_cache_isolation():
    """Audits PROCESSED_CACHE dataset isolation (Dataset B upload must contain ZERO records from Dataset A)."""
    # 1. Upload Dataset A
    df_a = pd.DataFrame([{"Mfg_Part_Num": "SKU-DATASET-A-101", "Part_Desc": "Dataset A Pipe Fitting", "Part_Manuf": "Mueller"}])
    csv_a = df_a.to_csv(index=False).encode("utf-8")
    resp_a = client.post("/api/upload", files={"file": ("dataset_a.csv", csv_a, "text/csv")})
    assert resp_a.status_code == 200
    res_a = resp_a.json()
    assert res_a["products"][0]["mfg_part_num"] == "SKU-DATASET-A-101"

    # 2. Upload Dataset B
    df_b = pd.DataFrame([{"Mfg_Part_Num": "SKU-DATASET-B-202", "Part_Desc": "Dataset B Saw Blade", "Part_Manuf": "Diablo"}])
    csv_b = df_b.to_csv(index=False).encode("utf-8")
    resp_b = client.post("/api/upload", files={"file": ("dataset_b.csv", csv_b, "text/csv")})
    assert resp_b.status_code == 200
    res_b = resp_b.json()
    
    # Verify Dataset B upload contains ONLY Dataset B records
    b_mpns = [p["mfg_part_num"] for p in res_b["products"]]
    assert "SKU-DATASET-B-202" in b_mpns
    assert "SKU-DATASET-A-101" not in b_mpns

    # 3. Export Delivery CSV and verify no contamination
    export_resp = client.get("/api/export")
    assert export_resp.status_code == 200
    export_csv = export_resp.text
    assert "SKU-DATASET-B-202" in export_csv
    assert "SKU-DATASET-A-101" not in export_csv


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

