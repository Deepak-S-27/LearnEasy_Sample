from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from config import VECTOR_PATH

def get_retriever():
    embeddings = HuggingFaceEmbeddings()
    db = FAISS.load_local(VECTOR_PATH, embeddings)
    return db.as_retriever(search_kwargs={"k": 3})