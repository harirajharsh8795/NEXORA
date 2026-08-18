import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = "https://html.duckduckgo.com/html/"
data = {'q': 'Freud Diablo DBDS14125A01F specifications'}

try:
    r = requests.post(url, data=data, headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    soup = BeautifulSoup(r.text, 'html.parser')
    results = soup.find_all('a', class_='result__url')
    snippets = soup.find_all('a', class_='result__snippet')
    titles = soup.find_all('a', class_='result__a')
    
    print(f"Found {len(results)} results")
    for i in range(min(len(results), 5)):
        print(f"\n--- Result {i+1} ---")
        print(f"Title: {titles[i].get_text(strip=True) if i < len(titles) else ''}")
        print(f"URL: {results[i].get('href', '').strip()}")
        print(f"Snippet: {snippets[i].get_text(strip=True) if i < len(snippets) else ''}")

except Exception as e:
    print(f"Error: {e}")
