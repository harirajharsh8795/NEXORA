import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
import os
from pathlib import Path

search_roots = [
    Path("C:/Users/HP/Desktop"),
    Path("C:/Users/HP/Downloads"),
    Path("C:/Users/HP/Documents"),
    Path("C:/Users/HP/.gemini")
]

keywords = ["200", "expected", "outcome", "delivery", "unilog", "unihack"]

found = []
for base in search_roots:
    if not base.exists():
        continue
    for root, dirs, files in os.walk(base):
        if any(skip in root for skip in [".git", "node_modules", ".system_generated", "AppData"]):
            continue
        for f in files:
            f_lower = f.lower()
            if any(k in f_lower for k in keywords) and f_lower.endswith((".csv", ".xlsx", ".xls")):
                full = Path(root) / f
                found.append(full)

print(f"Found {len(found)} candidate files:")
for m in sorted(set(found)):
    try:
        size = m.stat().st_size
        print(f"  {m.name:50s} | size: {size:8d} bytes | {m}")
    except Exception as e:
        print(f"  {m} | error: {e}")
