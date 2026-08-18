import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Get all models that support generateContent
valid_models = []
try:
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            name = m.name.replace("models/", "")
            valid_models.append(name)
except Exception as e:
    print("List models error:", e)

print(f"Testing {len(valid_models)} supported generation models:")
working = []
for m in valid_models:
    try:
        model = genai.GenerativeModel(m)
        res = model.generate_content("Hi")
        print(f"  [OK] {m:35s} -> SUCCESS ({len(res.text)} chars)")
        working.append(m)
    except Exception as e:
        err = str(e)[:70].replace("\n", " ")
        print(f"  [FAIL] {m:33s} -> {err}")

print(f"\nTotal Working Models: {len(working)}")
print("Working list:", working)
