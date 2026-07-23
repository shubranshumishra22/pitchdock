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

def generate_email_draft(contact, profile, client=None, jd_text=None):
    """
    Generates a personalized high-converting cold outreach email subject and body for a contact.
    """
    if client is None:
        client = get_gemini_client()
        
    hr_name = contact.get("name", "").strip() or "Hiring Team"
    hr_title = contact.get("title", "").strip()
    hr_company = contact.get("company", "").strip()
    
    if not jd_text:
        jd_text = contact.get("jd_text", "")

    # Candidate profile data
    cand_name = profile.get("full_name", "")
    cand_phone = profile.get("phone_number", "")
    cand_linkedin = profile.get("linkedin_profile", "")
    cand_designation = profile.get("current_designation", "")
    cand_exp = profile.get("experience_years", "")
    cand_domain = profile.get("industry_domain", "")
    cand_role = contact.get("target_role") or profile.get("target_role") or cand_designation or "Software Engineer"
    
    raw_achievements = profile.get("achievements", [])
    if isinstance(raw_achievements, str):
        try:
            raw_achievements = json.loads(raw_achievements)
        except Exception:
            raw_achievements = [raw_achievements]

    resume_data = {
        "candidate_name": cand_name,
        "current_designation": cand_designation,
        "experience_years": cand_exp,
        "industry_domain": cand_domain,
        "target_role": cand_role,
        "achievements": raw_achievements,
        "phone": cand_phone,
        "linkedin": cand_linkedin
    }

    system_instruction = (
        "You are an expert cold-outreach copywriter who has worked with technical recruiters at top companies. "
        "Recruiters skim 200+ emails a day and decide to open/reply within 5-10 seconds. Your job is to write a "
        "candidate outreach email that survives that skim.\n\n"
        "RULES FOR THE EMAIL:\n\n"
        "1. SUBJECT LINE (under 60 characters):\n"
        "   - Lead with role + one standout signal (years of experience, a recognizable company, or a metric), not a generic phrase.\n"
        "   - Bad: 'Exploring Software Engineer opportunities at Affle'\n"
        "   - Good: '5 YOE SWE — interested in Affle's backend team'\n\n"
        "2. OPENING LINE (no throat-clearing):\n"
        "   - Never say 'I know you read hundreds of these' or any line about the recruiter's inbox — it wastes their first 3 seconds on nothing.\n"
        "   - Open with who the candidate is + the single most relevant qualifier for THIS role, pulled directly from the resume.\n\n"
        "3. BODY (max 2 bullet points, each ONE line if possible):\n"
        "   - Every bullet must contain a number, scale, or named technology relevant to the JD — never generic phrases like 'robust, scalable solutions' or 'significantly reducing' without a number attached.\n"
        "   - Pull bullets directly from resume_data. If jd_text is provided, prioritize the 1-2 resume achievements that most closely match the JD's stated requirements — mirror its keywords where truthful.\n"
        "   - Never fabricate achievements. If resume data is missing or can't be parsed, explicitly flag this to the user instead of inventing accomplishments.\n\n"
        "4. CLOSE:\n"
        "   - One line, low-friction ask ('Open to a 10-min chat this week?' beats 'Happy to send more detail').\n"
        "   - Sign with the candidate's real name, pulled from resume_data — never a placeholder like 'Jane Doe.'\n\n"
        "5. LENGTH: Under 120 words total, excluding subject line. Recruiters reward brevity.\n\n"
        "6. TONE: Confident, specific, zero fluff. Cut any sentence that could apply to literally any other candidate.\n\n"
        "You must generate a structured JSON object containing 'subject' and 'body'. Do not include markdown tags like ```json or similar in the text values, just raw plain text."
    )

    prompt = f"""
INPUTS:
- Candidate resume/parsed data: {json.dumps(resume_data, indent=2)}
- Target role: {cand_role}
- Target company: {hr_company or 'Tech Team'}
- Recruiter name: {hr_name}
- Job description (if provided): {jd_text or 'N/A'}

OUTPUT FORMAT:
Generate a structured JSON matching schema with:
- "subject": <subject line>
- "body": <email body>
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
