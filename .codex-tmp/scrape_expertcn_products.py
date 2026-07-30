from __future__ import annotations

import hashlib
import html
import json
import mimetypes
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree

import requests
from bs4 import BeautifulSoup


WORKSPACE = Path(r"C:\Users\Nassim\Documents\expertcn 5.6")
SITEMAP_URL = "https://www.expertcn.fr/product-sitemap.xml"
OUTPUT_PATH = WORKSPACE / ".codex-tmp" / "expertcn-products-scraped.json"
IMAGE_ROOT = WORKSPACE / "public" / "images" / "shop" / "official"
USER_AGENT = "Mozilla/5.0 (compatible; ExpertCNCatalogueAudit/1.0; +https://www.expertcn.fr/)"
TIMEOUT = 40


def clean_text(element) -> str:
    if not element:
        return ""
    for unwanted in element.select("script, style, form, .woocommerce-product-attributes, .download-file"):
        unwanted.decompose()
    block_nodes = element.find_all(["p", "li"], recursive=True)
    source_lines = [node.get_text(" ", strip=True) for node in block_nodes] if block_nodes else [element.get_text(" ", strip=True)]
    lines = [re.sub(r"\s+", " ", line).strip() for line in source_lines]
    compact: list[str] = []
    for line in lines:
        if line and (not compact or compact[-1] != line):
            compact.append(line)
    return "\n".join(compact)


def split_content(element) -> list[str]:
    if not element:
        return []
    blocks: list[str] = []
    for child in element.find_all(["p", "li", "h2", "h3", "h4"], recursive=True):
        value = re.sub(r"\s+", " ", child.get_text(" ", strip=True)).strip()
        if not value or value.lower() in {"description", "fiche produit"}:
            continue
        if child.name == "li":
            value = f"• {value}"
        if value not in blocks:
            blocks.append(value)
    if not blocks:
        value = clean_text(element)
        if value:
            blocks.append(value)
    return blocks


def soup_from_html(value: str) -> BeautifulSoup:
    soup = BeautifulSoup(value or "", "html.parser")
    marker = soup.find("img", src=re.compile(r"ECN-cube_sans-fond", re.I))
    if marker:
        container = marker.find_parent("p") or marker
        for sibling in list(container.find_next_siblings()):
            sibling.decompose()
        container.decompose()
    return soup


def store_options(attributes: list[dict]) -> list[dict]:
    options: list[dict] = []
    for attribute in attributes or []:
        if not attribute.get("has_variations"):
            continue
        values = [term.get("name", "").strip() for term in attribute.get("terms", []) if term.get("name", "").strip()]
        if values:
            options.append({"name": attribute.get("name", "Configuration").strip(), "values": values})
    return options


def absolute_media_url(value: str) -> str:
    if not value:
        return ""
    value = html.unescape(value).strip()
    if value.startswith("//"):
        return f"https:{value}"
    return value


def parse_json_ld(soup: BeautifulSoup) -> list[dict]:
    entries: list[dict] = []
    for script in soup.select('script[type="application/ld+json"]'):
        raw = script.string or script.get_text()
        if not raw.strip():
            continue
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(value, list):
            entries.extend(item for item in value if isinstance(item, dict))
        elif isinstance(value, dict):
            graph = value.get("@graph")
            if isinstance(graph, list):
                entries.extend(item for item in graph if isinstance(item, dict))
            entries.append(value)
    return entries


def product_json_ld(entries: list[dict]) -> dict:
    for entry in entries:
        entry_type = entry.get("@type")
        if entry_type == "Product" or (isinstance(entry_type, list) and "Product" in entry_type):
            return entry
    return {}


def gallery_urls(soup: BeautifulSoup, schema_product: dict, sitemap_images: list[str]) -> list[str]:
    values: list[str] = []
    selectors = [
        ".woocommerce-product-gallery__image a[href]",
        ".woocommerce-product-gallery__image img[data-large_image]",
        ".woocommerce-product-gallery__image img[src]",
        ".woocommerce-product-gallery__image--placeholder img[src]",
    ]
    for selector in selectors:
        for node in soup.select(selector):
            candidate = node.get("href") or node.get("data-large_image") or node.get("src")
            candidate = absolute_media_url(candidate)
            if candidate and candidate not in values:
                values.append(candidate)
    schema_images = schema_product.get("image", [])
    if isinstance(schema_images, str):
        schema_images = [schema_images]
    for candidate in schema_images:
        candidate = absolute_media_url(candidate)
        if candidate and candidate not in values:
            values.append(candidate)
    if not values:
        values.extend(sitemap_images)
    return [
        value
        for value in values
        if value
        and "ECN-cube_sans-fond" not in value
        and "logo" not in Path(urlparse(value).path).name.lower()
    ]


def parse_variations(form) -> list[dict]:
    if not form:
        return []
    raw = html.unescape(form.get("data-product_variations", "")).strip()
    if not raw or raw == "false":
        return []
    try:
        variations = json.loads(raw)
    except json.JSONDecodeError:
        return []
    parsed: list[dict] = []
    for item in variations:
        image_data = item.get("image") or {}
        parsed.append(
            {
                "id": item.get("variation_id"),
                "sku": item.get("sku") or None,
                "attributes": item.get("attributes") or {},
                "description": BeautifulSoup(item.get("variation_description") or "", "html.parser").get_text(
                    " ", strip=True
                ),
                "imageUrl": absolute_media_url(image_data.get("full_src") or image_data.get("src") or ""),
                "isPurchasable": bool(item.get("is_purchasable")),
                "isInStock": bool(item.get("is_in_stock")),
            }
        )
    return parsed


def parse_options(soup: BeautifulSoup) -> list[dict]:
    options: list[dict] = []
    for row in soup.select("table.variations tr"):
        label = row.select_one("label")
        select = row.select_one("select")
        if not select:
            continue
        name = re.sub(r"\s+", " ", label.get_text(" ", strip=True)).strip() if label else select.get("name", "")
        values = [
            re.sub(r"\s+", " ", option.get_text(" ", strip=True)).strip()
            for option in select.select("option")
            if option.get("value")
        ]
        if values:
            options.append({"name": name, "values": values})
    return options


def parse_sitemap() -> list[dict]:
    response = requests.get(SITEMAP_URL, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
    response.raise_for_status()
    root = ElementTree.fromstring(response.content)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9", "image": "http://www.google.com/schemas/sitemap-image/1.1"}
    products: list[dict] = []
    for node in root.findall("sm:url", namespace):
        location = node.findtext("sm:loc", default="", namespaces=namespace)
        if "/produit/" not in location:
            continue
        products.append(
            {
                "url": location,
                "slug": urlparse(location).path.rstrip("/").split("/")[-1],
                "lastModified": node.findtext("sm:lastmod", default="", namespaces=namespace),
                "sitemapImages": [
                    absolute_media_url(image_node.text or "")
                    for image_node in node.findall("image:image/image:loc", namespace)
                ],
            }
        )
    return products


def scrape_product(item: dict) -> dict:
    response = requests.get(item["url"], headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
    response.raise_for_status()
    store_response = requests.get(
        f"https://www.expertcn.fr/wp-json/wc/store/v1/products?slug={item['slug']}",
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT,
    )
    store_response.raise_for_status()
    store_results = store_response.json()
    store_product = store_results[0] if store_results else {}
    soup = BeautifulSoup(response.text, "html.parser")
    entries = parse_json_ld(soup)
    schema_product = product_json_ld(entries)
    canonical = soup.select_one('link[rel="canonical"]')
    title_node = (
        soup.select_one("h1.product_title")
        or soup.select_one("h2.product_title")
        or soup.select_one(".summary h1")
        or soup.select_one(".summary h2")
        or soup.select_one("h1")
        or soup.select_one("h2")
    )
    short_node = soup.select_one(".woocommerce-product-details__short-description")
    description_node = soup.select_one("#tab-description") or soup.select_one(".woocommerce-Tabs-panel--description")
    sku_node = soup.select_one(".sku")
    category_nodes = soup.select(".posted_in a")
    tag_nodes = soup.select(".tagged_as a")
    form = soup.select_one("form.variations_form")
    store_images = [
        absolute_media_url(image.get("src", ""))
        for image in store_product.get("images", [])
        if image.get("src")
    ]
    images = store_images or gallery_urls(soup, schema_product, item["sitemapImages"])
    store_short_soup = soup_from_html(store_product.get("short_description", ""))
    store_description_soup = soup_from_html(store_product.get("description", ""))
    store_type = store_product.get("type")
    store_attributes = store_product.get("attributes", [])
    store_variations = store_product.get("variations", [])
    return {
        **item,
        "httpStatus": response.status_code,
        "productId": store_product.get("id"),
        "canonicalUrl": canonical.get("href") if canonical else item["url"],
        "title": store_product.get("name")
        or (re.sub(r"\s+", " ", title_node.get_text(" ", strip=True)).strip() if title_node else schema_product.get("name", "")),
        "shortDescription": clean_text(store_short_soup) or clean_text(short_node) or schema_product.get("description", ""),
        "description": split_content(store_description_soup) or split_content(description_node),
        "descriptionText": clean_text(store_description_soup) or clean_text(description_node),
        "sku": store_product.get("sku")
        or (re.sub(r"\s+", " ", sku_node.get_text(" ", strip=True)).strip() if sku_node else None),
        "categories": [category.get("name", "") for category in store_product.get("categories", [])]
        or [node.get_text(" ", strip=True) for node in category_nodes],
        "categorySlugs": [category.get("slug", "") for category in store_product.get("categories", [])],
        "tags": [tag.get("name", "") for tag in store_product.get("tags", [])]
        or [node.get_text(" ", strip=True) for node in tag_nodes],
        "productType": store_type or ("variable" if form else "simple"),
        "options": store_options(store_attributes) or parse_options(soup),
        "variations": store_variations or parse_variations(form),
        "imageUrls": images,
        "seoTitle": (soup.select_one('meta[property="og:title"]') or {}).get("content", ""),
        "seoDescription": (soup.select_one('meta[name="description"]') or {}).get("content", ""),
    }


def image_extension(url: str, content_type: str) -> str:
    suffix = Path(unquote(urlparse(url).path)).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}:
        return ".jpg" if suffix == ".jpeg" else suffix
    guessed = mimetypes.guess_extension(content_type.split(";")[0].strip()) if content_type else None
    return ".jpg" if guessed == ".jpe" else (guessed or ".jpg")


def download_image(slug: str, url: str, position: int) -> str:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
    response.raise_for_status()
    extension = image_extension(url, response.headers.get("content-type", ""))
    basename = Path(unquote(urlparse(url).path)).stem
    basename = re.sub(r"[^a-zA-Z0-9._-]+", "-", basename).strip("-")[:80] or f"image-{position}"
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:8]
    folder = IMAGE_ROOT / slug
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / f"{position:02d}-{basename}-{digest}{extension}"
    if not target.exists() or target.stat().st_size != len(response.content):
        target.write_bytes(response.content)
    return f"/images/shop/official/{slug}/{target.name}"


def main() -> None:
    started = time.time()
    sitemap_products = parse_sitemap()
    scraped: list[dict] = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        future_map = {executor.submit(scrape_product, item): item for item in sitemap_products}
        for index, future in enumerate(as_completed(future_map), start=1):
            item = future_map[future]
            try:
                product = future.result()
                scraped.append(product)
                print(f"[{index:02d}/{len(sitemap_products)}] {product['slug']} ({len(product['imageUrls'])} image(s))")
            except Exception as error:
                print(f"[{index:02d}/{len(sitemap_products)}] ERROR {item['slug']}: {error}")
                scraped.append({**item, "error": str(error), "httpStatus": None})

    scraped.sort(key=lambda product: [item["slug"] for item in sitemap_products].index(product["slug"]))
    for product in scraped:
        local_images: list[str] = []
        for position, image_url in enumerate(product.get("imageUrls", []), start=1):
            try:
                local_images.append(download_image(product["slug"], image_url, position))
            except Exception as error:
                print(f"IMAGE ERROR {product['slug']} {image_url}: {error}")
        product["images"] = local_images
        for variation in product.get("variations", []):
            image_url = variation.get("imageUrl")
            if not image_url:
                continue
            try:
                variation["image"] = download_image(product["slug"], image_url, len(local_images) + 1)
            except Exception as error:
                print(f"VARIATION IMAGE ERROR {product['slug']} {image_url}: {error}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(scraped, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = [product for product in scraped if product.get("error")]
    print(
        json.dumps(
            {
                "source": SITEMAP_URL,
                "products": len(scraped),
                "failures": len(failures),
                "images": sum(len(product.get("images", [])) for product in scraped),
                "output": str(OUTPUT_PATH),
                "elapsedSeconds": round(time.time() - started, 1),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
