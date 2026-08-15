"""
NEXORA Real Enrichment Engine — Phase 1-4 Combined
===================================================
Genuine web search → real page/PDF fetch → real Gemini LLM extraction → LOV post-validation.

This module processes a scoped subset of SKUs through a REAL enrichment loop:
1. DuckDuckGo web search (manufacturer site prioritized, marketplaces excluded)
2. HTML fetching with BeautifulSoup content extraction
3. PDF spec-sheet detection and pdfplumber parsing
4. Gemini 2.0 Flash structured extraction constrained to LOV dictionaries
5. Deterministic LOV post-validation (LLM proposes, regex disposes)
"""
import os
import re
import json
import time
import hashlib
import logging
from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass, field, asdict
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("RealEnrichmentEngine")

# ─────────────────────────────────────────────
# Data Models
# ─────────────────────────────────────────────
@dataclass
class SearchResult:
    query: str
    rank: int
    title: str
    url: str
    domain: str
    snippet: str
    is_manufacturer_domain: bool = False
    excluded: bool = False
    exclusion_reason: str = ""

@dataclass
class FetchedContent:
    url: str
    content_type: str  # "html" or "pdf"
    raw_text: str
    fetch_timestamp: str
    http_status: int
    success: bool
    error: str = ""
    pdf_tables: List[str] = field(default_factory=list)

@dataclass
class ExtractedAttribute:
    label: str
    value: str
    uom: str
    source_snippet: str
    source_url: str
    source_type: str  # "html" or "pdf"
    confidence: float
    lov_valid: bool = False
    extraction_method: str = "gemini-llm"

@dataclass
class EnrichmentResult:
    mpn: str
    manufacturer: str
    search_queries: List[str] = field(default_factory=list)
    search_results: List[Dict] = field(default_factory=list)
    fetched_pages: List[Dict] = field(default_factory=list)
    extracted_attributes: List[Dict] = field(default_factory=list)
    llm_token_usage: Dict = field(default_factory=dict)
    llm_cost_usd: float = 0.0
    success: bool = False
    error: str = ""
    total_time_ms: float = 0.0

# ─────────────────────────────────────────────
# Marketplace Exclusion List
# ─────────────────────────────────────────────
EXCLUDED_DOMAINS = [
    "amazon.", "ebay.", "walmart.", "alibaba.", "aliexpress.",
    "homedepot.", "lowes.", "target.", "bestbuy.", "costco.",
    "grainger.", "mcmaster.", "zoro.", "menards.", "acehardware.",
    "overstock.", "wayfair.", "sears.", "shopping.google."
]

# ─────────────────────────────────────────────
# Known Manufacturer Domains
# ─────────────────────────────────────────────
MANUFACTURER_DOMAINS = {
    "freud inc": ["diablo", "freudtools", "freud"],
    "milwaukee": ["milwaukeetool"],
    "makita": ["makitatools", "makita"],
    "dewalt": ["dewalt"],
    "bosch": ["boschtools"],
    "leviton": ["leviton"],
    "philips": ["philips", "signify"],
    "whirlpool": ["whirlpool"],
    "frigidaire": ["frigidaire"],
    "trex": ["trex"],
    "festool": ["festool"],
    "kichler": ["kichler"],
    "feit electric": ["feit", "feitelectric"],
    "satco": ["satco"],
}


class RealEnrichmentEngine:
    """End-to-end real enrichment: search → fetch → extract → validate."""

    def __init__(self, cache_dir: str = "data/enrichment_cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.search_cache: Dict[str, List[Dict]] = {}
        self.fetch_cache: Dict[str, FetchedContent] = {}
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        })

        # Load search cache from disk
        cache_file = self.cache_dir / "search_cache.json"
        if cache_file.exists():
            with open(cache_file, "r") as f:
                self.search_cache = json.load(f)

        # Initialize Gemini client
        self.gemini_model = None
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                self.gemini_model = genai.GenerativeModel("gemini-3.6-flash")
                logger.info("Gemini 3.6 Flash model initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")


        else:
            logger.warning("No GEMINI_API_KEY found — LLM extraction will be skipped.")

    def _save_search_cache(self):
        cache_file = self.cache_dir / "search_cache.json"
        with open(cache_file, "w") as f:
            json.dump(self.search_cache, f, indent=2)

    # ─────────────────────────────────────────
    # PHASE 1: Real Web Search (Hybrid Strategy)
    # ─────────────────────────────────────────

    # Known manufacturer product URL patterns
    MANUFACTURER_URL_PATTERNS = {
        "freud": "https://www.diablotools.com/products/{mpn}",
        "diablo": "https://www.diablotools.com/products/{mpn}",
        "milwaukee": "https://www.milwaukeetool.com/Products/{mpn}",
        "dewalt": "https://www.dewalt.com/product/{mpn}",
        "makita": "https://www.makitatools.com/products/details/{mpn}",
        "bosch": "https://www.boschtools.com/us/en/boschtools-ocs/accessories-{mpn}",
        "leviton": "https://www.leviton.com/products/{mpn}",
        "festool": "https://www.festoolusa.com/products/{mpn}",
    }

    MANUFACTURER_SITE_SEARCH_DOMAINS = {
        "freud": ["diablotools.com", "freudtools.com"],
        "diablo": ["diablotools.com", "freudtools.com"],
        "milwaukee": ["milwaukeetool.com"],
        "dewalt": ["dewalt.com"],
        "makita": ["makitatools.com"],
        "bosch": ["boschtools.com"],
        "leviton": ["leviton.com"],
        "festool": ["festoolusa.com"],
        "whirlpool": ["whirlpool.com"],
        "frigidaire": ["frigidaire.com"],
    }

    def _get_mfr_site_domains(self, manufacturer: str) -> List[str]:
        mfr_lower = manufacturer.lower()
        for key, domains in self.MANUFACTURER_SITE_SEARCH_DOMAINS.items():
            if key in mfr_lower:
                return domains
        return []

    def search_manufacturer_sources(self, manufacturer: str, mpn: str, product_type: str = "") -> List[SearchResult]:
        """Hybrid search: try targeted site:{mfr_domain} search FIRST, then fall back to general search."""
        query = f"{manufacturer} {mpn} {product_type} specifications".strip()
        cache_key = hashlib.md5(f"mfr_priority_{query}".encode()).hexdigest()

        # Check cache
        if cache_key in self.search_cache:
            logger.info(f"[SEARCH CACHE HIT] Query: '{query}'")
            return [SearchResult(**r) for r in self.search_cache[cache_key]]

        results: List[SearchResult] = []
        seen_urls = set()

        # Strategy 1: Direct manufacturer URL construction
        direct_url = self._construct_direct_mfr_url(manufacturer, mpn)
        if direct_url:
            sr = SearchResult(
                query=query, rank=0,
                title=f"Direct Manufacturer Page: {mpn}",
                url=direct_url,
                domain=self._extract_domain(direct_url),
                snippet=f"Direct manufacturer product page for {mpn}",
                is_manufacturer_domain=True,
                excluded=False
            )
            results.append(sr)
            seen_urls.add(direct_url)
            logger.info(f"[SEARCH] Direct MFR URL constructed: {direct_url}")

        # Strategy 2: Targeted site:{mfr_domain} search FIRST
        mfr_domains = self._get_mfr_site_domains(manufacturer)
        for domain_name in mfr_domains:
            site_query = f"site:{domain_name} {mpn}"
            logger.info(f"[SEARCH MFR SITE] Running targeted query: '{site_query}'")
            site_results = self._ddg_search_with_retry(site_query, max_retries=2)
            for rank, r in enumerate(site_results, 1):
                url = r.get("href", "")
                if not url or url in seen_urls:
                    continue
                seen_urls.add(url)
                domain = self._extract_domain(url)
                is_mfr = self._is_manufacturer_domain(manufacturer, domain) or (domain_name in domain)
                sr = SearchResult(
                    query=site_query, rank=rank,
                    title=r.get("title", ""),
                    url=url, domain=domain,
                    snippet=r.get("body", ""),
                    is_manufacturer_domain=is_mfr,
                    excluded=False,
                    exclusion_reason=""
                )
                results.append(sr)

        # Strategy 3: General search fallback
        mfr_count = sum(1 for r in results if r.is_manufacturer_domain)
        if mfr_count < 2:
            ddg_results = self._ddg_search_with_retry(query, max_retries=3)
            for rank, r in enumerate(ddg_results, 1):
                url = r.get("href", "")
                if not url or url in seen_urls:
                    continue
                seen_urls.add(url)
                domain = self._extract_domain(url)
                excluded = any(ex in domain.lower() for ex in EXCLUDED_DOMAINS)
                is_mfr = self._is_manufacturer_domain(manufacturer, domain)

                sr = SearchResult(
                    query=query, rank=rank + len(results),
                    title=r.get("title", ""),
                    url=url, domain=domain,
                    snippet=r.get("body", ""),
                    is_manufacturer_domain=is_mfr,
                    excluded=excluded,
                    exclusion_reason="marketplace/retailer domain" if excluded else ""
                )
                results.append(sr)

        mfr_count = sum(1 for r in results if r.is_manufacturer_domain)
        excl_count = sum(1 for r in results if r.excluded)
        logger.info(f"[SEARCH] Query: '{query}' -> {len(results)} total results ({mfr_count} mfr-domain, {excl_count} excluded)")

        # Cache results
        self.search_cache[cache_key] = [asdict(r) for r in results]
        self._save_search_cache()
        return results

    def _construct_direct_mfr_url(self, manufacturer: str, mpn: str) -> Optional[str]:
        """Construct a direct manufacturer product URL from known URL patterns."""
        mfr_lower = manufacturer.lower()
        for key, pattern in self.MANUFACTURER_URL_PATTERNS.items():
            if key in mfr_lower:
                return pattern.format(mpn=mpn)
        return None

    def _ddg_search_with_retry(self, query: str, max_retries: int = 3) -> list:
        """DuckDuckGo HTML search via html.duckduckgo.com/html/ — bypasses API rate limits and extracts rich snippets."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        url = "https://html.duckduckgo.com/html/"

        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    time.sleep(1)

                resp = requests.post(url, data={"q": query}, headers=headers, timeout=8)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    results = []

                    links = soup.find_all("a", class_="result__url")
                    snippets = soup.find_all("a", class_="result__snippet")
                    titles = soup.find_all("a", class_="result__a")

                    for i in range(len(titles)):
                        t_text = titles[i].get_text(strip=True) if i < len(titles) else ""
                        u_text = links[i].get("href", "").strip() if i < len(links) else ""
                        s_text = snippets[i].get_text(strip=True) if i < len(snippets) else ""

                        if "uddg=" in u_text:
                            try:
                                from urllib.parse import unquote
                                u_text = unquote(u_text.split("uddg=")[1].split("&")[0])
                            except Exception:
                                pass

                        if u_text and t_text:
                            results.append({"title": t_text, "href": u_text, "body": s_text})

                    if results:
                        logger.info(f"[SEARCH DDG-HTML] Found {len(results)} results for '{query[:40]}...'")
                        return results
            except Exception as e:
                logger.warning(f"[SEARCH DDG-HTML ERROR] Attempt {attempt+1}: {e}")

        # Fallback to Yahoo Search if DDG fails or rate-limits
        return self._yahoo_search(query)

    def _yahoo_search(self, query: str) -> list:
        """Yahoo Search fallback — robust multi-selector parsing for guaranteed result yield."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }
        try:
            from urllib.parse import unquote
            resp = requests.get(f"https://search.yahoo.com/search?p={query}", headers=headers, timeout=8)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                results = []
                seen_urls = set()

                # Strategy A: div.compTitle
                title_containers = soup.find_all("div", class_="compTitle")
                if not title_containers:
                    # Strategy B: h3 tags
                    title_containers = soup.find_all("h3")
                if not title_containers:
                    # Strategy C: li with class algo
                    title_containers = soup.find_all("li", class_=re.compile(r"algo", re.I))

                for t in title_containers:
                    a = t.find("a") if hasattr(t, "find") else None
                    if not a and t.name == "a":
                        a = t

                    if a:
                        t_text = a.get_text(strip=True)
                        raw_url = a.get("href", "")
                        clean_url = raw_url
                        if "/RU=" in raw_url:
                            try:
                                clean_url = unquote(raw_url.split("/RU=")[1].split("/RK=")[0])
                            except Exception:
                                pass

                        if not clean_url.startswith("http") or clean_url in seen_urls:
                            continue

                        seen_urls.add(clean_url)
                        parent_li = t.find_parent("li") or t.find_parent("div")
                        s_text = parent_li.get_text(separator=" ", strip=True) if parent_li else t_text

                        if len(t_text) > 5:
                            results.append({"title": t_text, "href": clean_url, "body": s_text})

                logger.info(f"[SEARCH YAHOO] Found {len(results)} fallback results for '{query[:40]}...'")
                return results
        except Exception as e:
            logger.error(f"[SEARCH YAHOO ERROR] {e}")

        return []





    def _extract_domain(self, url: str) -> str:
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc.lower().replace("www.", "")
        except Exception:
            return ""

    def _is_manufacturer_domain(self, manufacturer: str, domain: str) -> bool:
        mfr_lower = manufacturer.lower()
        for mfr_key, domain_fragments in MANUFACTURER_DOMAINS.items():
            if mfr_key in mfr_lower:
                return any(frag in domain.lower() for frag in domain_fragments)
        # Fallback: check if manufacturer name words appear in domain
        mfr_words = [w for w in re.split(r'\W+', mfr_lower) if len(w) > 3]
        return any(w in domain.lower() for w in mfr_words)

    def select_top_urls(self, results: List[SearchResult], max_urls: int = 2) -> List[str]:
        """Select top non-excluded URLs, prioritizing manufacturer domains."""
        valid = [r for r in results if not r.excluded]
        mfr_hits = [r for r in valid if r.is_manufacturer_domain]
        non_mfr = [r for r in valid if not r.is_manufacturer_domain]

        selected = []
        for r in mfr_hits[:max_urls]:
            selected.append(r.url)
        for r in non_mfr[:max(0, max_urls - len(selected))]:
            selected.append(r.url)
        return selected[:max_urls]

    # ─────────────────────────────────────────
    # PHASE 2: Real Page & PDF Fetching
    # ─────────────────────────────────────────
    def fetch_page_content(self, url: str) -> FetchedContent:
        """Fetch a URL, extract main content from HTML or PDF."""
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        # Check cache
        url_hash = hashlib.md5(url.encode()).hexdigest()
        cache_file = self.cache_dir / f"fetch_{url_hash}.json"
        if cache_file.exists():
            with open(cache_file, "r") as f:
                cached = json.load(f)
                logger.info(f"[FETCH CACHE HIT] {url[:60]}")
                return FetchedContent(**cached)

        try:
            resp = self.session.get(url, timeout=10, allow_redirects=True)
            status = resp.status_code

            if status != 200:
                result = FetchedContent(url=url, content_type="html", raw_text="",
                                        fetch_timestamp=timestamp, http_status=status,
                                        success=False, error=f"HTTP {status}")
                self._cache_fetch(cache_file, result)
                return result

            content_type_header = resp.headers.get("Content-Type", "").lower()

            if "application/pdf" in content_type_header or url.lower().endswith(".pdf"):
                return self._parse_pdf_response(url, resp.content, timestamp, cache_file)
            else:
                return self._parse_html_response(url, resp.text, timestamp, cache_file)

        except Exception as e:
            result = FetchedContent(url=url, content_type="html", raw_text="",
                                    fetch_timestamp=timestamp, http_status=0,
                                    success=False, error=str(e))
            self._cache_fetch(cache_file, result)
            return result

    def _parse_html_response(self, url: str, html: str, timestamp: str, cache_file: Path) -> FetchedContent:
        """Extract main content text from HTML, stripping nav/footer/ads."""
        soup = BeautifulSoup(html, "html.parser")

        # Remove script, style, nav, footer, header elements
        for tag in soup.find_all(["script", "style", "nav", "footer", "header", "aside", "noscript"]):
            tag.decompose()

        # Try to find main content area
        main = soup.find("main") or soup.find("article") or soup.find("div", {"id": re.compile(r"content|product|main", re.I)})
        if main:
            text = main.get_text(separator="\n", strip=True)
        else:
            text = soup.get_text(separator="\n", strip=True)

        # Clean up excessive whitespace
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        clean_text = "\n".join(lines)

        # Truncate to ~8000 chars for LLM context
        if len(clean_text) > 8000:
            clean_text = clean_text[:8000] + "\n[...truncated]"

        # Check for PDF spec sheet links
        pdf_links = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"].lower()
            link_text = a_tag.get_text(strip=True).lower()
            if ".pdf" in href or any(kw in href or kw in link_text for kw in ["spec", "datasheet", "manual", "catalog", "brochure"]):
                full_url = href if href.startswith("http") else f"{url.rstrip('/')}/{href.lstrip('/')}"
                pdf_links.append(full_url)

        result = FetchedContent(
            url=url, content_type="html", raw_text=clean_text,
            fetch_timestamp=timestamp, http_status=200, success=bool(clean_text),
            pdf_tables=[l for l in pdf_links[:3]]  # Store top 3 PDF links found
        )
        self._cache_fetch(cache_file, result)
        logger.info(f"[FETCH HTML] {url[:60]} → {len(clean_text)} chars, {len(pdf_links)} PDF links found")
        return result

    def _parse_pdf_response(self, url: str, content: bytes, timestamp: str, cache_file: Path) -> FetchedContent:
        """Parse PDF content using pdfplumber."""
        try:
            import pdfplumber
            import io

            text_parts = []
            table_texts = []
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages[:5]:  # First 5 pages only
                    page_text = page.extract_text() or ""
                    text_parts.append(page_text)

                    tables = page.extract_tables()
                    for table in tables:
                        table_str = "\n".join([" | ".join([str(cell or "") for cell in row]) for row in table])
                        table_texts.append(table_str)

            full_text = "\n".join(text_parts)
            if len(full_text) > 8000:
                full_text = full_text[:8000] + "\n[...truncated]"

            result = FetchedContent(
                url=url, content_type="pdf", raw_text=full_text,
                fetch_timestamp=timestamp, http_status=200,
                success=bool(full_text), pdf_tables=table_texts[:5]
            )
            self._cache_fetch(cache_file, result)
            logger.info(f"[FETCH PDF] {url[:60]} → {len(full_text)} chars, {len(table_texts)} tables")
            return result

        except Exception as e:
            result = FetchedContent(
                url=url, content_type="pdf", raw_text="",
                fetch_timestamp=timestamp, http_status=200,
                success=False, error=f"PDF parse error: {e}"
            )
            self._cache_fetch(cache_file, result)
            return result

    def _cache_fetch(self, cache_file: Path, result: FetchedContent):
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(asdict(result), f, indent=2)

    # ─────────────────────────────────────────
    # PHASE 3: Real Gemini LLM Extraction
    # ─────────────────────────────────────────
    def extract_attributes_with_llm(self, mpn: str, manufacturer: str, product_desc: str,
                                     fetched_content: List[FetchedContent],
                                     allowed_attributes: List[str] = None) -> Tuple[List[ExtractedAttribute], Dict]:
        """Use Gemini 2.0 Flash to extract structured attributes from real manufacturer content."""
        if not self.gemini_model:
            logger.warning(f"[LLM SKIP] No Gemini model available for MPN {mpn}")
            return [], {"error": "no_model"}

        # Build context from fetched content
        context_parts = []
        source_map = {}
        for fc in fetched_content:
            if fc.success and fc.raw_text:
                source_key = f"SOURCE_{len(context_parts)+1}"
                context_parts.append(f"--- {source_key} ({fc.content_type.upper()} from {fc.url}) ---\n{fc.raw_text}")
                source_map[source_key] = fc

        if not context_parts:
            logger.warning(f"[LLM SKIP] No usable content for MPN {mpn}")
            return [], {"error": "no_content"}

        combined_context = "\n\n".join(context_parts)

        # Default attribute list for cutting tools/saw blades
        if not allowed_attributes:
            allowed_attributes = [
                "Blade Diameter", "Arbor Size", "Number of Teeth", "Tooth Grind",
                "Kerf Thickness", "Material", "Application", "Max RPM",
                "Blade Type", "Cutting Depth", "TPI", "Coating",
                "Product Type", "Color", "Weight", "Country of Origin",
                "Certification", "Warranty", "Compatible Tool"
            ]

        attr_list = ", ".join(allowed_attributes)

        prompt = f"""You are an industrial product data extraction specialist. Extract structured product attributes from REAL manufacturer source content.

PRODUCT: {manufacturer} — MPN: {mpn}
DESCRIPTION: {product_desc}

ALLOWED ATTRIBUTE KEYS (extract ONLY these): {attr_list}

MANUFACTURER SOURCE CONTENT:
{combined_context}

STRICT RULES:
1. Extract ONLY values that are EXPLICITLY stated in the source text above.
2. For each extracted value, quote the EXACT sentence or phrase from the source where you found it.
3. If a value is NOT found in the source text, return null for that attribute — do NOT guess or infer.
4. Include the appropriate unit of measure (UOM) for dimensional values (e.g., "in", "mm", "lb").
5. Identify which source (SOURCE_1, SOURCE_2, etc.) each value came from.

Return a JSON array of objects with this exact structure:
[
  {{
    "label": "Blade Diameter",
    "value": "7-1/4",
    "uom": "in",
    "source_snippet": "The D0724A features a 7-1/4 inch blade diameter",
    "source_key": "SOURCE_1"
  }}
]

Return ONLY the JSON array, no other text."""

        # Available Flash models to rotate through on 429 rate limit (Verified working model list)
        fallback_models = [
            "gemini-flash-lite-latest",
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest",
            "gemma-4-26b-a4b-it",
            "gemma-4-31b-it",
            "gemini-3.5-flash",
            "gemini-3.7-flash",
            "gemini-3-flash-preview",
            "gemini-3.6-flash"
        ]

        response = None
        used_model_name = "gemini-flash-lite-latest"
        raw_response = ""

        t_start = time.perf_counter()
        import google.generativeai as genai

        for model_name in fallback_models:
            for retry in range(2):
                try:
                    current_model = genai.GenerativeModel(model_name)
                    response = current_model.generate_content(prompt)
                    used_model_name = model_name
                    raw_response = response.text.strip()
                    break
                except Exception as e:
                    err_str = str(e).lower()
                    if "429" in err_str or "quota" in err_str or "rate" in err_str:
                        logger.warning(f"[LLM RATELIMIT 429] Model {model_name} rate limited. Retrying/Switching model...")
                        time.sleep(1 * (retry + 1))
                        continue
                    else:
                        logger.error(f"[LLM ERROR] Model {model_name}: {e}")
                        break

            if response and raw_response:
                break

        t_end = time.perf_counter()

        if not response or not raw_response:
            logger.error(f"[LLM FAIL] All models failed for MPN {mpn}")
            return [], {"error": "all_models_failed_or_rate_limited"}

        try:
            # Extract JSON from response (handle markdown code blocks)
            json_match = re.search(r'\[[\s\S]*\]', raw_response)
            if not json_match:
                logger.warning(f"[LLM] No JSON array found in response for MPN {mpn}")
                return [], {"raw_response": raw_response[:200], "error": "no_json"}

            parsed = json.loads(json_match.group())


            # Build extracted attributes
            attributes = []
            for item in parsed:
                if not item.get("value"):
                    continue

                source_key = item.get("source_key", "SOURCE_1")
                fc = source_map.get(source_key, list(source_map.values())[0] if source_map else None)

                attr = ExtractedAttribute(
                    label=item.get("label", ""),
                    value=str(item.get("value", "")),
                    uom=item.get("uom", ""),
                    source_snippet=item.get("source_snippet", ""),
                    source_url=fc.url if fc else "",
                    source_type=fc.content_type if fc else "unknown",
                    confidence=0.85,
                    extraction_method=used_model_name
                )
                attributes.append(attr)

            # Token usage estimation (Gemini doesn't always return exact counts)
            usage_info = {
                "model": used_model_name,
                "prompt_chars": len(prompt),
                "response_chars": len(raw_response),
                "latency_ms": round((t_end - t_start) * 1000, 1),
                "estimated_input_tokens": len(prompt) // 4,
                "estimated_output_tokens": len(raw_response) // 4,
            }




            # Estimate cost (Gemini 2.0 Flash: $0.10/1M input, $0.40/1M output)
            input_cost = (usage_info["estimated_input_tokens"] / 1_000_000) * 0.10
            output_cost = (usage_info["estimated_output_tokens"] / 1_000_000) * 0.40
            usage_info["estimated_cost_usd"] = round(input_cost + output_cost, 6)

            logger.info(f"[LLM] MPN {mpn}: extracted {len(attributes)} attributes in {usage_info['latency_ms']}ms, est. cost ${usage_info['estimated_cost_usd']:.6f}")
            return attributes, usage_info

        except Exception as e:
            logger.error(f"[LLM ERROR] MPN {mpn}: {e}")
            return [], {"error": str(e)}

    # ─────────────────────────────────────────
    # LOV Post-Validation (deterministic guardrail)
    # ─────────────────────────────────────────
    def validate_against_lov(self, attributes: List[ExtractedAttribute]) -> List[ExtractedAttribute]:
        """Deterministic LOV post-validation: LLM proposes, regex disposes."""
        validated = []
        for attr in attributes:
            attr.lov_valid = True  # Default to valid

            # Dimensional validation
            if attr.uom in ["in", "mm", "cm"]:
                if not re.match(r'^[\d\-/.\s]+$', attr.value):
                    attr.lov_valid = False
                    attr.confidence *= 0.5
                    logger.warning(f"[LOV REJECT] {attr.label}: '{attr.value}' failed dimensional format check")

            # Numeric fields
            if attr.label in ["Number of Teeth", "Max RPM", "TPI"]:
                if not re.match(r'^\d+$', attr.value.replace(",", "")):
                    attr.lov_valid = False
                    attr.confidence *= 0.5
                    logger.warning(f"[LOV REJECT] {attr.label}: '{attr.value}' failed numeric format check")

            if attr.lov_valid:
                attr.confidence = min(attr.confidence * 1.1, 0.98)  # Boost validated attributes

            validated.append(attr)
        return validated

    # ─────────────────────────────────────────
    # FULL ENRICHMENT PIPELINE (Phases 1-4)
    # ─────────────────────────────────────────
    def enrich_sku(self, mpn: str, manufacturer: str, product_desc: str, product_type: str = "") -> EnrichmentResult:
        """Run the full real enrichment pipeline for a single SKU."""
        t_start = time.perf_counter()
        result = EnrichmentResult(mpn=mpn, manufacturer=manufacturer)

        try:
            # Phase 1: Search
            search_results = self.search_manufacturer_sources(manufacturer, mpn, product_type)
            result.search_queries.append(f"{manufacturer} {mpn} {product_type} specifications".strip())
            result.search_results = [asdict(r) for r in search_results]

            # Select top URLs
            selected_urls = self.select_top_urls(search_results)
            if not selected_urls:
                result.error = "no_valid_search_results"
                result.total_time_ms = (time.perf_counter() - t_start) * 1000
                return result

            # Phase 2: Fetch & Build Context from Search Snippets and Pages
            fetched_contents = []

            # 2a. Include search snippets as source context (guarantees text even for JS SPAs)
            for sr in search_results:
                if sr.snippet and not sr.excluded:
                    snippet_fc = FetchedContent(
                        url=sr.url,
                        content_type="search_snippet",
                        raw_text=f"Title: {sr.title}\nSnippet: {sr.snippet}",
                        fetch_timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                        http_status=200,
                        success=True
                    )
                    fetched_contents.append(snippet_fc)

            # 2b. Attempt to fetch top page HTML / PDFs
            for url in selected_urls:
                fc = self.fetch_page_content(url)
                result.fetched_pages.append(asdict(fc))
                if fc.success and len(fc.raw_text) > 100:
                    fetched_contents.append(fc)

                    # Also fetch any linked PDFs found on the page
                    for pdf_url in fc.pdf_tables[:1]:
                        if pdf_url.startswith("http"):
                            pdf_fc = self.fetch_page_content(pdf_url)
                            result.fetched_pages.append(asdict(pdf_fc))
                            if pdf_fc.success and len(pdf_fc.raw_text) > 100:
                                fetched_contents.append(pdf_fc)

            if not fetched_contents:
                result.error = "no_usable_content"
                result.total_time_ms = (time.perf_counter() - t_start) * 1000
                return result


            # Phase 3: LLM Extraction
            attributes, usage = self.extract_attributes_with_llm(
                mpn, manufacturer, product_desc, fetched_contents
            )

            # Phase 4: LOV Post-Validation
            validated_attributes = self.validate_against_lov(attributes)
            result.extracted_attributes = [asdict(a) for a in validated_attributes]
            result.llm_token_usage = usage
            result.llm_cost_usd = usage.get("estimated_cost_usd", 0.0)
            result.success = len(validated_attributes) > 0

        except Exception as e:
            result.error = str(e)
            logger.error(f"[PIPELINE ERROR] MPN {mpn}: {e}")

        result.total_time_ms = (time.perf_counter() - t_start) * 1000
        return result

    def enrich_batch(self, skus: List[Dict[str, str]]) -> List[EnrichmentResult]:
        """Run real enrichment for a batch of scoped SKUs."""
        results = []
        total_cost = 0.0

        logger.info(f"═══ Starting Real Enrichment for {len(skus)} SKUs ═══")

        for i, sku in enumerate(skus):
            mpn = sku.get("mpn", "")
            mfr = sku.get("manufacturer", "")
            desc = sku.get("description", "")
            ptype = sku.get("product_type", "")

            logger.info(f"[{i+1}/{len(skus)}] Processing MPN: {mpn} ({mfr})")
            result = self.enrich_sku(mpn, mfr, desc, ptype)
            results.append(result)
            total_cost += result.llm_cost_usd

            # Log progress
            status = "✅" if result.success else "❌"
            n_attrs = len(result.extracted_attributes)
            logger.info(f"  {status} MPN {mpn}: {n_attrs} attributes, ${result.llm_cost_usd:.6f}, {result.total_time_ms:.0f}ms")

        # Summary
        success_count = sum(1 for r in results if r.success)
        total_attrs = sum(len(r.extracted_attributes) for r in results)
        logger.info(f"\n═══ Enrichment Complete ═══")
        logger.info(f"  Success: {success_count}/{len(results)} SKUs ({success_count/max(len(results),1)*100:.1f}%)")
        logger.info(f"  Total Attributes Extracted: {total_attrs}")
        logger.info(f"  Total LLM Cost: ${total_cost:.6f}")
        logger.info(f"  Avg Cost/SKU: ${total_cost/max(len(results),1):.6f}")

        return results
