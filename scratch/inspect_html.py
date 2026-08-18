import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests, re, json

r = requests.get('https://www.diablotools.com/products/DBDS14125A01F', headers={'User-Agent':'Mozilla/5.0'})
html = r.text

# Check for JSON-LD
ld_blocks = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Found {len(ld_blocks)} JSON-LD blocks")
for i, block in enumerate(ld_blocks):
    print(f"\n--- JSON-LD Block {i+1} ---")
    print(block[:800])

# Check for JS data stores
patterns = ['window.__INITIAL_STATE__', 'window.__NEXT_DATA__', 'productData', 'product_data', 
            '__PRELOADED_STATE__', 'window.__DATA__', 'dataLayer.push']
for p in patterns:
    if p in html:
        idx = html.index(p)
        print(f"\nFound '{p}' at char {idx}")
        print(html[idx:idx+300])

# Check for meta tags with product info
meta_matches = re.findall(r'<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"', html)
print(f"\nFound {len(meta_matches)} meta tags:")
for name, val in meta_matches[:15]:
    print(f"  {name}: {val[:100]}")

# Check for any JSON data embedded in script tags
script_data = re.findall(r'<script[^>]*>\s*(?:var|let|const)\s+\w+\s*=\s*(\{[^<]{100,})', html)
print(f"\nFound {len(script_data)} embedded JSON data blocks")
for i, sd in enumerate(script_data[:3]):
    print(f"\n--- Script Data {i+1} (first 400 chars) ---")
    print(sd[:400])
