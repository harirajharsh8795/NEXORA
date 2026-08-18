import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
resp = requests.post("https://html.duckduckgo.com/html/", data={"q": "Freud Diablo DBDS14125A01F specifications"}, headers=headers)
print(f"Status: {resp.status_code}")
soup = BeautifulSoup(resp.text, "html.parser")
titles = soup.find_all("a", class_="result__a")
print(f"Titles found: {len(titles)}")
for t in titles[:5]:
    print("  ->", t.get_text(strip=True))
