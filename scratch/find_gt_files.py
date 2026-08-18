import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import os
from pathlib import Path
import pandas as pd

search_paths = [
    Path("e:/Desktop/UNIHACK"),
    Path("C:/Users/HP/.gemini/antigravity-ide/brain/9f0445cf-9f59-4a8e-a807-03a0ec4652c3"),
    Path("C:/Users/HP/Downloads"),
]

found = []
for base in search_paths:
    if not base.exists():
        continue
    for p in base.rglob("*"):
        if p.is_file() and p.suffix.lower() in [".csv", ".xlsx", ".xls"]:
            p_str = str(p.resolve())
            if any(skip in p_str for skip in [".git", "node_modules", ".system_generated", "venv"]):
                continue
            found.append(p)

print(f"Total CSV/XLSX files found across target paths: {len(found)}")
for m in sorted(set(found)):
    size = m.stat().st_size
    try:
        if m.suffix.lower() == ".csv":
            df = pd.read_csv(m, dtype=str, nrows=5)
            with open(m, "r", encoding="utf-8", errors="ignore") as f_obj:
                lines = sum(1 for _ in f_obj) - 1
            print(f"  [CSV] {m.name:45s} | {lines:5d} rows | {len(df.columns):3d} cols | {m}")
        elif m.suffix.lower() in [".xlsx", ".xls"]:
            xl = pd.ExcelFile(m)
            sheet_info = []
            for sname in xl.sheet_names:
                df = pd.read_excel(m, sheet_name=sname)
                sheet_info.append(f"'{sname}': {len(df)} rows x {len(df.columns)} cols")
            print(f"  [EXCEL] {m.name:43s} | sheets: [{', '.join(sheet_info)}] | {m}")
    except Exception as e:
        print(f"  [ERR] {m.name:45s} | {e}")
