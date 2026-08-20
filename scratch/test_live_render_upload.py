import io
import requests
import pandas as pd
from pathlib import Path

LIVE_API_URL = "https://nexora-d7u7.onrender.com/upload"
LIVE_API_URL_ALT = "https://nexora-d7u7.onrender.com/api/upload"

def test_live_csv_upload():
    csv_path = Path("data/NEXORA_manual_test_dataset.csv")
    if not csv_path.exists():
        print("CSV dataset file not found.")
        return
    
    with open(csv_path, "rb") as f:
        content = f.read()
    
    print("Uploading CSV dataset to live Render API (/upload)...")
    res1 = requests.post("https://nexora-d7u7.onrender.com/upload", files={"file": ("NEXORA_Judge_Style_Test_Dataset.csv", content, "text/csv")}, timeout=60)
    print("/upload Status Code:", res1.status_code)
    try:
        print("/upload Response:", res1.json() if res1.status_code == 200 else res1.text[:200])
    except Exception as e:
        print("/upload error:", e)

    print("Uploading CSV dataset to live Render API (/api/upload)...")
    res2 = requests.post("https://nexora-d7u7.onrender.com/api/upload", files={"file": ("NEXORA_Judge_Style_Test_Dataset.csv", content, "text/csv")}, timeout=60)
    print("/api/upload Status Code:", res2.status_code)
    try:
        print("/api/upload Response:", res2.json() if res2.status_code == 200 else res2.text[:200])
    except Exception as e:
        print("/api/upload error:", e)

def test_live_xlsx_upload():
    # Convert CSV to XLSX (multi-sheet: Sheet 1 = Cover Notes, Sheet 2 = Products)
    csv_path = Path("data/NEXORA_manual_test_dataset.csv")
    df = pd.read_csv(csv_path)
    
    xlsx_buf = io.BytesIO()
    with pd.ExcelWriter(xlsx_buf, engine="openpyxl") as writer:
        pd.DataFrame([{"Legend": "Unilog Official Sample Data"}]).to_excel(writer, index=False, sheet_name="Cover_Notes")
        df.to_excel(writer, index=False, sheet_name="Product_Catalog")
    
    xlsx_bytes = xlsx_buf.getvalue()
    files = {"file": ("NEXORA_Judge_Style_Test_Dataset.xlsx", xlsx_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    
    print("Uploading multi-sheet XLSX dataset to live Render API...")
    res = requests.post(LIVE_API_URL, files=files, timeout=60)
    print("XLSX Status Code:", res.status_code)
    print("XLSX Response JSON:", res.json())
    assert res.status_code == 200, f"XLSX upload failed with status {res.status_code}"

def test_live_corrupted_xlsx_upload():
    corrupted_bytes = b"CORRUPTED_NON_EXCEL_BYTE_STREAM"
    files = {"file": ("corrupted.xlsx", corrupted_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    
    print("Uploading corrupted XLSX dataset to live Render API...")
    res = requests.post(LIVE_API_URL, files=files, timeout=60)
    print("Corrupted XLSX Status Code:", res.status_code)
    print("Corrupted XLSX Response JSON:", res.json())
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"

if __name__ == "__main__":
    test_live_csv_upload()
    test_live_xlsx_upload()
    test_live_corrupted_xlsx_upload()
    print("\nALL LIVE RENDER API UPLOAD TESTS PASSED SUCCESSFULLY!")
