import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

DATA_PATH = "data/"
VECTOR_PATH = "vectorstore/faiss_index"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50