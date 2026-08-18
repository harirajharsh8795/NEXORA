import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

query = "Freud Diablo DBDS14125A01F specifications"
r = requests.get(f"https://search.yahoo.com/search?p={query}", headers=headers, timeout=8)
soup = BeautifulSoup(r.text, "html.parser")

results = []
for div in soup.find_all("div", class_="dd algo algo-sr"):
    h3 = div.find("h3")
    a = h3.find("a") if h3 else None
    comp_text = div.find("div", class_="compText") or div.find("p")
    
    if a and h3:
        title = h3.get_text(strip=True)
        raw_url = a.get("href", "")
        # Extract clean URL from Yahoo tracking redirect
        clean_url = raw_url
        if "/RU=" in raw_url:
            try:
                clean_url = unquote(raw_url.split("/RU=")[1].split("/RK=")[0])
            except Exception:
                pass
        
        snippet = comp_text.get_text(strip=True) if comp_text else ""
        results.append({"title": title, "url": clean_url, "snippet": snippet})

print(f"Parsed {len(results)} clean results from Yahoo:")
for i, res in enumerate(results):
    print(f"\n[{i+1}] {res['title']}")
    print(f"    URL: {res['url']}")
    print(f"    Snippet: {res['snippet'][:120]}")
