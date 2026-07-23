import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmailDraft(BaseModel):
    subject: str
    body: str

def get_gemini_client(api_key=None):
    if not api_key:
        api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please add it to your .env file.")
    return genai.Client(api_key=api_key)

def load_candidate_profile(profile_path="candidate_profile.json"):
    if not os.path.exists(profile_path):
        raise FileNotFoundError(f"Candidate profile not found at: {profile_path}")
    with open(profile_path, "r") as f:
        return json.load(f)

def generate_email_draft(contact, profile, client=None):
    """
    Generates a personalized email subject and body for a contact based on candidate profile.
    """
    if client is None:
        client = get_gemini_client()
        
    hr_name = contact.get("name", "HR Manager").strip()
    hr_title = contact.get("title", "").strip()
    hr_company = contact.get("company", "").strip()
    hr_category = contact.get("category", "").strip()
    
    # Extract first name
    first_name = hr_name.split()[0] if hr_name and hr_name.lower() != "hr manager" else "Hiring Team"
    if first_name.lower() in ["mr.", "ms.", "dr.", "mrs."]:
        parts = hr_name.split()
        first_name = parts[1] if len(parts) > 1 else "Hiring Team"

    # Candidate profile data
    cand_name = profile.get("full_name", "")
    cand_phone = profile.get("phone_number", "")
    cand_linkedin = profile.get("linkedin_profile", "")
    cand_designation = profile.get("current_designation", "")
    cand_exp = profile.get("experience_years", "")
    cand_domain = profile.get("industry_domain", "")
    cand_role = profile.get("target_role", "")
    cand_achievements = "\n".join([f"- {ach}" for ach in profile.get("achievements", [])])

    system_instruction = (
        "You are an expert career advisor and professional writer specialized in cold emailing. "
        "Your task is to write a highly professional, polite, and personalized cold outreach email. "
        "You must generate a structured JSON object containing 'subject' and 'body'. "
        "Do not include markdown tags like ```json or similar in the text values, just raw plain text. "
        "Use newlines (\\n) for spacing in the body."
    )

    prompt = f"""
Candidate Details:
- Name: {cand_name}
- Phone: {cand_phone}
- LinkedIn: {cand_linkedin}
- Current Designation: {cand_designation}
- Experience: {cand_exp} years
- Industry/Domain: {cand_domain}
- Target Role: {cand_role}
- Profile Highlights/Achievements:
{cand_achievements}

Recipient HR Details:
- Name: {hr_name} (First Name: {first_name})
- Title: {hr_title}
- Company: {hr_company}
- Tier Category: {hr_category}

Reference Template:
---
Subject: [Write a professional, short, click-worthy subject line. Example: Application for [Target Role] or Discussion: [Target Role] at [Company]]

Hi {first_name},

Hope you’re doing well.

I know you probably receive a lot of emails every day, so I’ll keep this brief.

I’m currently working as a {cand_designation} with {cand_exp} years of experience in {cand_domain}, and I’m actively looking for opportunities as a {cand_role}.

A quick snapshot of my profile:
[Include 2 to 3 candidate achievements formatted as clean bullet points. Keep them impactful.]

I’m reaching out in case there’s a suitable opening within your organization, either now or in the near future. If you feel my profile could be a good fit, I’d be grateful if you could consider my application.

I’ve attached my resume for your reference.

Thank you for your time. I truly appreciate it, and I hope to hear from you if there’s an opportunity that matches my background.

Best Regards,
{cand_name}
{cand_phone}
{cand_linkedin}
---

Instructions:
1. Generate the 'subject' and 'body' of the email.
2. In the body, replace bracketed placeholders with the candidate's actual values.
3. Keep the bulleted achievements clean and readable. Use a bullet character like '•' or '-'.
4. Ensure the tone is polite and professional.
5. In the email subject, customize it for the target role and company (e.g., "Exploring Senior Software Engineer opportunities at {hr_company}").
6. If the company or title is empty or generic, write a general but professional subject.
7. Return only the JSON object matching the requested schema.
"""

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EmailDraft,
            system_instruction=system_instruction,
            temperature=0.7
        )
    )
    
    # Parse output to verify it conforms to the structure
    result = json.loads(response.text)
    return result["subject"], result["body"]

def generate_resume_rewrite(company_name, target_role, profile, client=None):
    """
    Generates a tailored list of resume achievements for a specific company and role.
    """
    if client is None:
        client = get_gemini_client()
        
    cand_name = profile.get("full_name", "")
    cand_designation = profile.get("current_designation", "")
    cand_exp = profile.get("experience_years", "")
    cand_domain = profile.get("industry_domain", "")
    cand_achievements = "\n".join([f"- {ach}" for ach in profile.get("achievements", [])])

    system_instruction = (
        "You are an expert resume writer. Your task is to customize a candidate's resume achievements "
        "to align perfectly with the target company's business domain and the target role they are applying for. "
        "Keep the statements factual, action-oriented (using strong action verbs), and quantified with metrics."
    )

    prompt = f"""
Candidate Name: {cand_name}
Current Role: {cand_designation}
Years of Experience: {cand_exp}
Domain: {cand_domain}

Target Company: {company_name}
Target Role: {target_role}

Original Resume Achievements:
{cand_achievements}

Instructions:
1. Rewrite/tailor the original achievements to sound highly relevant to {company_name} and the role of {target_role}.
2. Retain the core factual achievements, but adjust wording, focus, or emphasis to match the tech stack, scale, or business objectives of {company_name}.
3. Provide the customized list of achievements formatted as 4-5 high-impact bullet points.
4. Output the result as a simple plain text block with bullet points (no wrapping HTML or code block markers).
"""

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7
        )
    )
    
    return response.text.strip()
