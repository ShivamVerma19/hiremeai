import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from groq import Groq
from pydantic import BaseModel
from pypdf import PdfReader

from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.responses import StreamingResponse

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key kaha hai bro")

client = Groq(api_key=my_api_key)

model = "openai/gpt-oss-20b"

#Resume Schema
class Experience(BaseModel):
    company: str|None = None
    role: str|None = None
    duration: str|None = None
    description: str|None = None
    skills_used: list[str] = []

class SelfAssessment(BaseModel):
    strengths: list[str] = []
    weaknesses: list[str] = []
    why_hire_you: str | None = None
    career_goals: str | None = None
    five_year_plan: str | None = None
    proudest_achievement: str | None = None
    biggest_challenge_overcome: str | None = None
    work_style: str | None = None
    motivation: str | None = None
    leadership_or_teamwork_example: str | None = None
    failure_and_learning: str | None = None
    handling_pressure_or_deadlines: str | None = None
    hobbies_and_interests: list[str] = []
    salary_expectations: str | None = None
    current_location_and_relocation: str | None = None
    notice_period: str | None = None

class Resume(BaseModel):
    name: str|None = None
    email: str|None = None
    phone: str|None = None

    total_experience: float|None = None
    skills: list[str] = []
    experiences: list[Experience] = []
    projects: list[str] = []
    certifications: list[str] = []
    educations: list[str] = []
    self_assessment: SelfAssessment | None = None

resume_schema = Resume.model_json_schema()

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

MY_SELF_ASSESSMENT = SelfAssessment(
    strengths=[
        "End-to-end ownership — I've shipped features across the full stack, from REST API and DB schema design to the Android UI consuming them",
        "Fast ramp-up on unfamiliar systems — picked up VAST/VMAP ad-tag specs and Google IMA SDK internals quickly while building the ad pipeline at VideoGate",
        "Comfortable moving between mobile and backend, which helps me debug issues that span both layers instead of just my own piece",
    ],
    weaknesses=[
        "Still building deeper expertise in distributed systems and infra-level scaling, since most of my experience so far has been feature-level ownership within smaller teams",
        "I sometimes spend more time polishing an implementation than the timeline strictly needs — I'm working on calibrating that against deadlines",
    ],
    why_hire_you=(
        "I've already shipped production features that touch both mobile and backend — an ad pipeline across three microservices, "
        "DRM live-stream ad integration, and a payments flow — so I can move fast without needing heavy hand-holding on either side of the stack."
    ),
    career_goals=(
        "Grow from feature-level ownership into more system-design responsibility — architecting services and mobile "
        "features from the ground up rather than just implementing a given spec."
    ),
    five_year_plan=(
        "Become someone a team leans on for both Android architecture decisions and backend service design, "
        "ideally on a product with real scale (like OTT/streaming, which I'm already working in)."
    ),
    proudest_achievement=(
        "Architecting and shipping the ad pipeline at VideoGate across three microservices — schema design, REST APIs, "
        "and VAST 3.0/4.2 skipoffset generation for both single and podded ad breaks — end to end."
    ),
    biggest_challenge_overcome=(
        "Debugging a client-side pricing issue in the PPV purchase flow — traced it to stale local state after purchase "
        "and fixed it by refetching stream details post-purchase rather than trusting cached pricing."
    ),
    work_style="I like owning a feature fully rather than a narrow slice — I'm comfortable being the one who designs the API, builds the client, and debugs across both.",
    motivation="I like that Android/OTT work sits right at the intersection of visible product polish and genuinely hard technical problems, like DRM playback and ad-tag timing.",
    leadership_or_teamwork_example=(
        "At Sagenest I built a LangGraph-based chatbot with session-aware conversations and FAISS retrieval — "
        "coordinating with the rest of the AI feature work rather than building it in isolation."
    ),
    failure_and_learning=(
        "Early on I underestimated how much production ad-serving depends on getting the VAST/VMAP spec details exactly right — "
        "learned to read the spec closely rather than pattern-match from documentation examples."
    ),
    handling_pressure_or_deadlines="I break ambiguous problems into the smallest shippable piece first, then iterate — that's how I approached the ad pipeline given it spanned three services.",
    hobbies_and_interests=[
        "Hoping to get into travel vlogging down the line — planning to start a YouTube/Instagram channel once things settle",
    ],
    salary_expectations="Open to discussing based on the role and responsibilities.",
    current_location_and_relocation="Currently based in Hyderabad; open to discussing based on the role.",
    notice_period="30 days",
)

RESUME_PATH = Path("Shivam Verma Resume.pdf")
RESUME_CACHE_PATH = Path("resume_data.json")

# module-level cache (in-memory, populated from the JSON file at startup)
_cached_resume: Resume | None = None


def get_parsed_resume() -> Resume:
    """
    Loads the pre-parsed resume from resume_data.json (fast, no LLM call).
    Run build_resume_cache.py manually to regenerate this file after
    updating the resume PDF.
    """
    global _cached_resume
    if _cached_resume is None:
        if not RESUME_CACHE_PATH.exists():
            raise RuntimeError(
                f"{RESUME_CACHE_PATH} not found. Run `python build_resume_cache.py` "
                "once to generate it before starting the server."
            )
        data = json.loads(RESUME_CACHE_PATH.read_text(encoding="utf-8"))
        resume = Resume(**data)
        resume.self_assessment = MY_SELF_ASSESSMENT
        _cached_resume = resume
    return _cached_resume


@asynccontextmanager
async def lifespan(app: FastAPI):
    # instant now — just reads a JSON file off disk, no LLM call
    get_parsed_resume()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://hiremeai-seven.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#give answer according to resume and question
def ask_candidate_stream(messages: list[ChatMessage], resume: Resume):

    system_prompt = f"""
    You are an AI assistant on Shivam Verma's portfolio site, answering HR/recruiter
    questions about him. You are NOT Shivam — you speak ABOUT him, in third person
    ("Shivam has...", "His strength is...", "He built..."). Never use "I" as if you
    are Shivam, and never say "your" — the person asking is HR, not the candidate,
    so "your notice period" is wrong; it must be "Shivam's notice period" or "his
    notice period".

    Candidate data (JSON):
    {resume.model_dump_json(indent=2)}

    Rules:

    1. If the question matches a field in self_assessment (strengths, weaknesses,
    notice_period, why_hire_you, etc.), base your answer on that field's content.
    Do not invent a different answer from skills or experience.

    2. For factual questions (experience, skills, education, projects, dates,
    companies) not covered by self_assessment, answer only using the resume data.
    Never invent facts.

    3. If neither self_assessment nor the resume covers the question, say
    "I don't have information on that — feel free to ask Shivam directly."

    4. Write in plain conversational sentences only. Do NOT use markdown: no **bold**,
    no bullet points, no numbered lists, no headers, no tables. If you're listing
    multiple things, weave them into flowing sentences separated by commas or
    "and", the way you'd actually speak in an interview.

    5. Keep answers concise — 2-4 sentences unless the question clearly needs more.

    Example of correct style:
    Q: "What are his strengths?"
    A: "Shivam's biggest strength is end-to-end ownership — he's shipped features
    that span the full stack, from REST APIs and database schemas to the Android UI
    consuming them. He also ramps up fast on unfamiliar systems, like when he picked
    up VAST/VMAP ad-tag specs and the Google IMA SDK while building VideoGate's ad
    pipeline."

    Q: "What's his notice period?"
    A: "Shivam's notice period is 30 days."
"""

    api_messages = [{"role": "system", "content": system_prompt}]
    api_messages += [{"role": m.role, "content": m.content} for m in messages]

    stream = client.chat.completions.create(
        model=model,
        messages=api_messages,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


#parse resume — still used, but only by build_resume_cache.py now, not at request time
def parse_resume(resume_text):
    system_prompt = f"""
    You are an expert resume parser.

    Extract information from the resume based on its meaning,
    not only based on exact section headings.

    Different resumes may use different headings.

    For example:
    - Experience
    - Professional Experience
    - Work History
    - Employment
    - Internships

    These may all contain relevant experience.

    Skills may also appear in the skills section, work experience,
    internships or projects.

    Return ONLY valid JSON matching this schema:

    {resume_schema}

    Important rules:

    1. Do not invent information.
    2. If a value is not available, return null.
    3. If a list has no information, return an empty list.
    4. Include internships inside experiences.
    5. Extract skills mentioned across the entire resume.
    """
    user_prompt = f"""
    Parse the following resume:

    {resume_text}
    """
    message_system={
        "role" : "system",
        "content" : system_prompt
    }
    message_user={
        "role" : "user",
        "content" : user_prompt
    }
    messages=[message_system, message_user]
    response_format={
        "type": "json_object"
    }
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format=response_format,
        max_tokens=8192,
        temperature=0,
        reasoning_effort="low",
    )
    raw_output = response.choices[0].message.content
    data = json.loads(raw_output)
    resume = Resume(**data)
    return resume


#read pdf — still used by build_resume_cache.py
def read_pdf(file_path: Path):
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "/n"

    return text


@app.get("/")
def home():
    return {
        "message": "resume parsed !!"
    }

@app.post("/chat")
def chat(request: ChatRequest):
    parsed_resume = get_parsed_resume()
    return StreamingResponse(
        ask_candidate_stream(request.messages, parsed_resume),
        media_type="text/plain",
    )