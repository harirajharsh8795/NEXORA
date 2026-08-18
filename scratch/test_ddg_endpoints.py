import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print("Testing GET on html.duckduckgo.com:")
r1 = requests.get("https://html.duckduckgo.com/html/?q=Freud+Diablo+DBDS14125A01F+specifications", headers=headers)
print(f"  Status: {r1.status_code}, Length: {len(r1.text)}")

print("\nTesting POST on lite.duckduckgo.com:")
r2 = requests.post("https://lite.duckduckgo.com/lite/", data={"q": "Freud Diablo DBDS14125A01F specifications"}, headers=headers)
print(f"  Status: {r2.status_code}, Length: {len(r2.text)}")

print("\nTesting GET on lite.duckduckgo.com:")
r3 = requests.get("https://lite.duckduckgo.com/lite/?q=Freud+Diablo+DBDS14125A01F+specifications", headers=headers)
print(f"  Status: {r3.status_code}, Length: {len(r3.text)}")
soup = BeautifulSoup(r3.text, "html.parser")
snippets = soup.find_all("td", class_="result-snippet")
print(f"  Snippets found: {len(snippets)}")
for s in snippets[:3]:
    print("  ->", s.get_text(strip=True)[:100])
