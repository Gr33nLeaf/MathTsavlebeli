import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# --- ENABLE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Supabase and Gemini
api_key = os.getenv("GOOGLE_API_KEY")
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", google_api_key=api_key)


# 2. API for fetching questions (The "Database" part)
@app.get("/get-questions/")
def get_questions(points: int = None, topic: str = None):
    query = supabase.table("questions").select("*")

    # "Engineering" logic: Dynamic SQL building
    if points:
        query = query.eq("points", points)
    if topic:
        query = query.ilike("topic", f"%{topic}%")

    response = query.execute()
    return response.data


# 3. API for The AI Tutor
class ExplainRequest(BaseModel):
    user_query: str
    question_text: str


@app.post("/explain-solution/")
def explain_solution(request: ExplainRequest):
    prompt_template = PromptTemplate.from_template(
        """
        You are an expert Math Tutor helping a student prepare for national exams.

        The Context:
        Question: {question}

        The Student asks: "{user_query}"

        Instructions:
        1. Use the Official Solution as the ground truth.
        2. Explain the step the student is stuck on clearly.
        3. Use LaTeX formatting for math (e.g., $x^2$) so the website renders it correctly.
        4. Be encouraging but concise.
        5. Talk in Georgian language.
        6. Do not use "*".
        """
    )

    chain = prompt_template | llm

    response = chain.invoke({
        "question": request.question_text,
        "user_query": request.user_query
    })

    return {"reply": response.content}