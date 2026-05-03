from langchain_groq import ChatGroq
import os

def get_llm():
    return ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.1-70b-versatile",
        temperature=0
    )


def generate_answer(llm, context, query, mode="normal"):

    if mode == "topics":
        prompt = f"""
Extract the most important and repeated topics.

Return:
- Topic
- Importance (High/Medium/Low)
- Short reason

Use bullet points only.
Do NOT return JSON.

Context:
{context}
"""

    elif mode == "50":
        prompt = f"""
List ONLY high-frequency topics required to score 50%.

Use bullet points.
Do NOT return JSON.

Context:
{context}
"""

    elif mode == "75":
        prompt = f"""
List topics required to score 75%.

Include:
- High priority
- Medium priority

Use bullet points.
Do NOT return JSON.

Context:
{context}
"""

    elif mode == "100":
        prompt = f"""
Create a full preparation plan to score 100%.

Include:
- All topics
- Study order

Use steps or bullet points.
Do NOT return JSON.

Context:
{context}
"""

    elif mode == "mcq":
        prompt = f"""
Generate 10 MCQs.

Format strictly:

Q1:
A)
B)
C)
D)
Answer:

Repeat for all questions.
Do NOT return JSON.

Context:
{context}
"""

    elif mode == "24hr":
        prompt = f"""
Create a 24-hour revision plan.

Rules:
- Hour-wise breakdown
- Focus on high-weightage topics

Do NOT return JSON.

Context:
{context}
"""

    else:
        prompt = f"""
Answer the question clearly and concisely.

Do NOT return JSON.

Context:
{context}

Question:
{query}
"""

    response = llm.invoke(prompt)

    if hasattr(response, "content"):
        return response.content.strip()

    return str(response).strip()