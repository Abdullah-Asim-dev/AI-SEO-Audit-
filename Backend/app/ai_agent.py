import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# .env file load karna
load_dotenv()

def generate_seo_report(scraped_data: dict) -> str:
    hf_token = os.getenv("HF_TOKEN", "")
    
    if not hf_token:
        return "Error: HF_TOKEN is not set in environment configurations."
        
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
        
        # 💎 BULLETPROOF PARSING LOGIC: Handles both object and list structures
        if isinstance(completion, list):
            # If Hugging Face returns raw dictionary array inside a list
            if len(completion) > 0 and isinstance(completion[0], dict) and "generated_text" in completion[0]:
                return completion[0]["generated_text"]
            # Alternate raw chat text inside list
            elif len(completion) > 0 and hasattr(completion[0], 'choices'):
                return completion[0].choices[0].message.content
            else:
                return str(completion[0])
                
        # If it returns standard OpenAI style object structure
        if hasattr(completion, 'choices') and len(completion.choices) > 0:
            return completion.choices[0].message.content
            
        return str(completion)

    except Exception as e:
        return f"Hugging Face Client Pipeline Error: {str(e)}"
