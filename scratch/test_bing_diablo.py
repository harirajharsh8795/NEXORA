import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

query = "Diablo Tools DBDS14125A01F specifications"

print("--- Testing Bing Search for Diablo Tools MPN ---")
try:
    r_bing = requests.get(f"https://www.bing.com/search?q={query}", headers=headers, timeout=8)
    print(f"Bing Status: {r_bing.status_code}")
    soup = BeautifulSoup(r_bing.text, "html.parser")
    bing_results = soup.find_all("li", class_="b_algo")
    print(f"Bing Algo Results: {len(bing_results)}")
    for i, b in enumerate(bing_results[:5]):
        h2 = b.find("h2")
        p = b.find("p")
        a = h2.find("a") if h2 else None
        print(f"\n  Result {i+1}: {h2.get_text(strip=True) if h2 else ''}")
        print(f"    URL: {a.get('href', '') if a else ''}")
        print(f"    Snippet: {p.get_text(strip=True) if p else ''}")
except Exception as e:
    print(f"Bing error: {e}")
