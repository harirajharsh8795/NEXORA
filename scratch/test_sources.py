"""Quick test: find alternative sources that return real static HTML with product specs for Diablo tools."""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
from bs4 import BeautifulSoup

urls_to_test = [
    # Diablo's PDF catalog / spec sheets (direct PDF links)
    ("Diablo Product Page (SPA)", "https://www.diablotools.com/products/D0724A"),
    # Try Google cache
    ("Google Cache", "https://webcache.googleusercontent.com/search?q=cache:diablotools.com/products/D0724A"),
    # Try third-party spec sites (non-marketplace, non-retailer)
    ("ToolNut (third-party)", "https://www.toolnut.com/diablo-d0724a.html"),
    ("Acme Tools (third-party)", "https://www.acmetools.com/diablo-d0724a"),
    # CPO Outlets (tool specialty)
    ("CPO (third-party)", "https://www.cpooutlets.com/diablo-d0724a"),
    # Try direct Freud site
    ("Freud Tools", "https://www.freudtools.com/products/D0724A"),
    # Try toolbarn
    ("ToolBarn", "https://www.toolbarn.com/diablo-d0724a.html"),
]

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

for name, url in urls_to_test:
    try:
        r = requests.get(url, headers=headers, timeout=8, allow_redirects=True)
        soup = BeautifulSoup(r.text, "html.parser")
        # Remove scripts and styles
        for tag in soup.find_all(["script", "style"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        lines = [l for l in text.split("\n") if l.strip() and len(l.strip()) > 10]
        
        # Look for spec-related content
        spec_lines = [l for l in lines if any(kw in l.lower() for kw in ["diameter", "arbor", "teeth", "blade", "rpm", "kerf", "tooth", "spec", "size"])]
        
        print(f"\n{'='*60}")
        print(f"SOURCE: {name}")
        print(f"URL: {url}")
        print(f"Status: {r.status_code} | Final URL: {r.url[:80]}")
        print(f"Text Lines: {len(lines)} | Spec Lines: {len(spec_lines)}")
        if spec_lines:
            print("Spec-related content found:")
            for sl in spec_lines[:8]:
                print(f"  >> {sl[:120]}")
        elif lines:
            print("Sample content (first 5 lines):")
            for sl in lines[:5]:
                print(f"  >> {sl[:120]}")
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"SOURCE: {name} -> FAILED: {e}")
