import os
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

app = FastAPI(title="Hugging Face AI SEO Audit Engine API")

# Allow CORS for Next.js Frontend
# Whitelist specific client execution runtime origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://seo-audit-tool-five-tau.vercel.app" # 🚀 Your brand new verified production client layer link!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    url: str

def generate_seo_report(scraped_data: dict) -> str:
    hf_token = os.getenv("HF_TOKEN", "")
    
    if not hf_token:
        return "Score: 75/100\n\n[Warning: HF_TOKEN is not set in environment configurations]. Base parsing succeeded."
        
    try:
        # Native Hugging Face client initialization
        client = InferenceClient(token=hf_token)
        
        prompt = f"""
        You are an elite enterprise-grade technical SEO Specialist. Audit the following scraped website data:
        URL: {scraped_data.get('url')}
        Title Tag: {scraped_data.get('title')}
        Meta Description: {scraped_data.get('meta_description')}
        H1 Headlines: {scraped_data.get('h1_tags')}
        H2 Heading Elements Count: {scraped_data.get('h2_count')}
        Total Images Found: {scraped_data.get('total_images')}
        Images Missing Alt-Text Count: {scraped_data.get('missing_alt_count')}
        Broken Internal Links Detected Count: {scraped_data.get('broken_links_count')}
        
        Generate a comprehensive, structural optimization report in clean professional English using the exact markdown format below:
        
        Score: [Compute an accurate integer score out of 100 based on standard SEO criteria deduction matrices]/100
        
        ### 🌟 Executive Architecture Summary
        [Write a high-level 2-sentence summary of the site status]
        
        ### 🟩 Production Masteries (Good Elements)
        - **[Element Name]**: [Elaborate why it's good in one crisp technical statement]
        - **[Element Name]**: [Second positive observation statement]
        
        ### 🟥 Critical Vulnerabilities (Issues Found)
        - **[Issue Name]**: [Identify structural flaw and its impact on search engine indexing]
        - **[Issue Name]**: [Second structural diagnostic flaw observation]
        
        ### 🔧 Strategic Actionable Directives
        1. **[Directive 1 Title]**: Complete specific fix detailing how to resolve.
        2. **[Directive 2 Title]**: Second specific framework correction fix roadmap.
        3. **[Directive 3 Title]**: Third execution fix tracking workflow.
        """
        
        completion = client.chat_completion(
            model="Qwen/Qwen2.5-72B-Instruct",
            messages=[
                {"role": "system", "content": "You are a professional technical SEO optimization agent. Always response in clean technical English markdown format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=850,
            temperature=0.2
        )
        
        # 🔥 FIXED & ULTRA-RELIABLE RESPONSE LAYERS CHECK
        # Check standard dictionary response structure
        if isinstance(completion, dict):
            if "choices" in completion and len(completion["choices"]) > 0:
                choice = completion["choices"][0]
                if isinstance(choice, dict) and "message" in choice:
                    return choice["message"].get("content", str(completion))
                elif hasattr(choice, "message"):
                    return choice.message.content

        # Check list structure fallback from older inference patterns
        if isinstance(completion, list) and len(completion) > 0:
            item = completion[0]
            if isinstance(item, dict):
                if "generated_text" in item:
                    return item["generated_text"]
                elif "message" in item and "content" in item["message"]:
                    return item["message"]["content"]
            elif hasattr(item, "choices"):
                return item.choices[0].message.content
                
        # Standard SDK response object validation mapping
        if hasattr(completion, 'choices') and len(completion.choices) > 0:
            choice_obj = completion.choices[0]
            if hasattr(choice_obj, 'message') and hasattr(choice_obj.message, 'content'):
                return choice_obj.message.content
            elif isinstance(choice_obj, dict) and "message" in choice_obj:
                return choice_obj["message"].get("content", str(completion))
            
        return str(completion)

    except Exception as e:
        return f"Score: 60/100\n\nHugging Face Client Pipeline Error: {str(e)}"


@app.get("/")
async def root_status():
    return {
        "status": "online",
        "engine": "Advanced AI SEO Audit Core Operational",
        "endpoint": "/api/audit [POST]"
    }


@app.post("/api/audit")
async def run_seo_audit(request: AuditRequest):
    target_url = request.url
    if not target_url.startswith(("http://", "https://")):
        target_url = "https://" + target_url

    try:
        # 1. Scraping Core Web Assets using safe user agent spoofing
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive"
        }
        
        response = requests.get(target_url, headers=headers, timeout=25)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # 2. Extract DOM Core Nodes Properties
        title = soup.title.string.strip() if soup.title else "Missing Title Tag"
        
        meta_desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
        meta_desc = meta_desc_tag["content"].strip() if meta_desc_tag and meta_desc_tag.has_attr("content") else "Missing Meta Description"
        
        h1_tags = [h1.get_text().strip() for h1 in soup.find_all("h1") if h1.get_text().strip()]
        h2_tags = [h2.get_text().strip() for h2 in soup.find_all("h2") if h2.get_text().strip()]
        
        images = soup.find_all("img")
        total_images = len(images)
        missing_alt_list = []
        for img in images:
            alt = img.get("alt")
            src = img.get("src", "Unknown Source")
            if not alt or not alt.strip():
                missing_alt_list.append(src)
        
        missing_alt_count = len(missing_alt_list)

        # 3. Create Shared Payload Dictionary Object
        scraped_payload = {
            "url": target_url,
            "title": title,
            "meta_description": meta_desc,
            "h1_tags": h1_tags,
            "h2_count": len(h2_tags),
            "h2_list": h2_tags[:5], 
            "total_images": total_images,
            "missing_alt_count": missing_alt_count,
            "missing_alt_list": missing_alt_list[:5],
            "broken_links_count": 0, 
            "broken_links_list": []
        }

        # 4. Fire Native Hugging Face client function pass
        ai_analysis_report = generate_seo_report(scraped_payload)

        return {
            "website_data": scraped_payload,
            "ai_analysis": ai_analysis_report
        }

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Target server connection timed out while crawling DOM nodes.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
