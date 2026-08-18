import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

models_to_test = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-3.7-flash"]

for m_name in models_to_test:
    print(f"\nTesting model: {m_name}")
    try:
        model = genai.GenerativeModel(m_name)
        res = model.generate_content("Say 'Hello from Gemini!' if you receive this.")
        print(f"  SUCCESS! Response: {res.text.strip()}")
        break
    except Exception as e:
        print(f"  FAILED: {e}")
