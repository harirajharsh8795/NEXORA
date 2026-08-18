import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
query = "Freud Diablo DBDS14125A01F specifications"
r = requests.get(f"https://search.yahoo.com/search?p={query}", headers=headers, timeout=8)
soup = BeautifulSoup(r.text, "html.parser")

titles = soup.find_all("div", class_="compTitle")
print(f"Found {len(titles)} div.compTitle tags")
for t in titles[:6]:
    a = t.find("a")
    if a:
        title_text = a.get_text(strip=True)
        href = a.get("href", "")
        # Find next text div
        parent_li = t.find_parent("li")
        snippet = parent_li.get_text(strip=True) if parent_li else ""
        print(f"\nTitle: {title_text}")
        print(f"Href: {href[:100]}")
        print(f"Snippet: {snippet[:150]}")
