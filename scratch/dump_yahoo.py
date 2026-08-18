import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
query = "Freud Diablo DBDS14125A01F specifications"
r = requests.get(f"https://search.yahoo.com/search?p={query}", headers=headers, timeout=8)
soup = BeautifulSoup(r.text, "html.parser")

# Find all <h3> tags
h3_tags = soup.find_all("h3")
print(f"Found {len(h3_tags)} h3 tags")
for h in h3_tags[:8]:
    a = h.find("a")
    if a:
        txt = h.get_text(strip=True)
        href = a.get("href", "")
        # Find parent container text
        parent = h.find_parent("li") or h.find_parent("div")
        p_txt = parent.get_text(strip=True) if parent else ""
        print(f"\nTitle: {txt[:80]}")
        print(f"Href: {href[:80]}")
        print(f"Parent snippet: {p_txt[len(txt):len(txt)+150]}")
