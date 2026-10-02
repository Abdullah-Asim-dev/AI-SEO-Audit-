import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def scrape_website_seo(url: str) -> dict:
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=12)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        base_domain = urlparse(url).netloc
        
        # 1. Basic Metadata Extraction
        title = soup.title.string.strip() if soup.title else "Missing Title Tag"
        
        meta_desc = "Missing Meta Description"
        meta_tag = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
        if meta_tag:
            meta_desc = meta_tag.get('content', '').strip() or "Missing Meta Description"
            
        h1_tags = [h1.text.strip() for h1 in soup.find_all('h1') if h1.text.strip()]
        h2_count = len(soup.find_all('h2'))

        # Feature 1: Advanced Image Alt-Text Auditor
        images = soup.find_all('img')
        total_images = len(images)
        missing_alt_images = []
        
        for img in images:
            src = img.get('src', 'Unknown Source')
            alt = img.get('alt')
            if not alt or alt.strip() == "":
                clean_src = src.split('/')[-1][:40]  # Take file name up to 40 chars
                missing_alt_images.append(clean_src or src)

        # Feature 2: Broken Links Finder (Status Code Checker)
        links = soup.find_all('a', href=True)
        broken_links = []
        checked_links = set()
        link_limit = 10  # Capped at 10 internal links to keep it super fast

        for link in links:
            href = link.get('href')
            absolute_url = urljoin(url, href)
            parsed_href = urlparse(absolute_url)
            
            if parsed_href.netloc == base_domain and absolute_url not in checked_links:
                checked_links.add(absolute_url)
                if len(checked_links) > link_limit:
                    break
                try:
                    link_res = requests.head(absolute_url, headers=headers, timeout=4)
                    if link_res.status_code == 405 or link_res.status_code == 404:
                        link_res = requests.get(absolute_url, headers=headers, timeout=4)
                    
                    if link_res.status_code >= 400:
                        broken_links.append({"url": absolute_url, "status": link_res.status_code})
                except Exception:
                    broken_links.append({"url": absolute_url, "status": "Failed to resolve"})

        return {
            "status": "success",
            "url": url,
            "title": title,
            "meta_description": meta_desc,
            "h1_tags": h1_tags[:5],  
            "h2_count": h2_count,
            "total_images": total_images,
            "missing_alt_count": len(missing_alt_images),
            "missing_alt_list": missing_alt_images[:6],
            "broken_links_count": len(broken_links),
            "broken_links_list": broken_links[:5]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
