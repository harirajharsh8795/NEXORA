import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
import os
from pathlib import Path

root = Path("e:/Desktop/UNIHACK")
for r, d, fs in os.walk(root):
    if any(skip in r for skip in [".git", "node_modules", ".system_generated", "venv"]):
        continue
    for f in fs:
        full = Path(r) / f
        print(f"  {full.stat().st_size:10d} bytes | {full}")
