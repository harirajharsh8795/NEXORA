import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

query = "Freud Diablo DBDS14125A01F specifications"

print("--- Testing Yahoo Search ---")
try:
    r_yahoo = requests.get(f"https://search.yahoo.com/search?p={query}", headers=headers, timeout=8)
    print(f"Yahoo Status: {r_yahoo.status_code}")
    soup = BeautifulSoup(r_yahoo.text, "html.parser")
    results = soup.find_all("div", class_="dd algo algo-sr")
    if not results:
        results = soup.find_all("div", class_="compTitle")
    print(f"Yahoo Results: {len(results)}")
    for i, res in enumerate(results[:5]):
        h3 = res.find("h3")
        a = h3.find("a") if h3 else None
        p = res.parent.find("p") if res.parent else None
        print(f"\n  Result {i+1}: {h3.get_text(strip=True) if h3 else ''}")
        print(f"    URL: {a.get('href', '') if a else ''}")
except Exception as e:
    print(f"Yahoo error: {e}")
