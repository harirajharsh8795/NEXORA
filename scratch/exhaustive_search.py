import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import os
import zipfile
from pathlib import Path
import pandas as pd

search_roots = [
    Path("e:/Desktop/UNIHACK"),
    Path("C:/Users/HP/Downloads"),
    Path("C:/Users/HP/Desktop"),
    Path("C:/Users/HP/Documents"),
    Path("C:/Users/HP/.gemini"),
    Path("E:/")
]

keywords = ["200", "unilog", "unihack", "delivery", "output", "input", "sample", "expected", "outcome", "ground"]

print("=== STARTING EXHAUSTIVE DISK SEARCH ===", flush=True)

seen = set()
match_count = 0

for root_dir in search_roots:
    if not root_dir.exists():
        continue
    print(f"\n--- Scanning Root: {root_dir} ---", flush=True)
    try:
        for root, dirs, files in os.walk(root_dir):
            p_str = root.lower()
            # Strict skip list for speed
            if any(skip in p_str for skip in [".git", "node_modules", "$recycle.bin", "system volume information", "appdata\\local", "anaconda3", "venv", ".venv", "site-packages"]):
                dirs.clear()
                continue
                
            for f in files:
                f_lower = f.lower()
                ext = Path(f).suffix.lower()
                full_path = Path(root) / f
                
                if full_path in seen:
                    continue
                seen.add(full_path)

                # Check Excel/CSV candidates
                if ext in [".xlsx", ".xls", ".csv"]:
                    if any(k in f_lower for k in keywords):
                        match_count += 1
                        try:
                            size = full_path.stat().st_size
                            if ext == ".csv":
                                df = pd.read_csv(full_path, dtype=str, nrows=5)
                                with open(full_path, "r", encoding="utf-8", errors="ignore") as f_obj:
                                    lines = sum(1 for _ in f_obj) - 1
                                print(f"📄 [CSV] {full_path.name:50s} | {size:9d} B | ~{lines:5d} rows x {len(df.columns):3d} cols | Path: {full_path}", flush=True)
                            else:
                                xl = pd.ExcelFile(full_path)
                                sheet_details = []
                                for sname in xl.sheet_names:
                                    df = pd.read_excel(full_path, sheet_name=sname)
                                    sheet_details.append(f"'{sname}': {len(df)} rows x {len(df.columns)} cols")
                                sheet_str = ", ".join(sheet_details)
                                print(f"📊 [EXCEL] {full_path.name:48s} | {size:9d} B | sheets: [{sheet_str}] | Path: {full_path}", flush=True)
                        except Exception as e:
                            print(f"⚠️ [ERR] {full_path.name:50s} | Error: {e}", flush=True)
                
                # Check ZIP candidates
                elif ext == ".zip":
                    if any(k in f_lower for k in ["200", "unilog", "unihack", "hackathon", "dataset", "sample"]):
                        try:
                            print(f"📦 [ZIP] {full_path.name:50s} | Path: {full_path}", flush=True)
                            with zipfile.ZipFile(full_path, 'r') as z:
                                for zinfo in z.infolist():
                                    if zinfo.filename.lower().endswith((".csv", ".xlsx", ".xls")):
                                        print(f"    └── Zip Content: {zinfo.filename} ({zinfo.file_size} bytes)", flush=True)
                        except Exception as e:
                            print(f"  ⚠️ Could not read ZIP {full_path}: {e}", flush=True)
    except Exception as err:
        print(f"Error scanning {root_dir}: {err}", flush=True)

print(f"\n=== EXHAUSTIVE DISK SEARCH COMPLETE (Found {match_count} candidates) ===", flush=True)
