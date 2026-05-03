from retriever import get_retriever
from generator import get_llm, generate_answer
from utils import format_docs

def chat():
    retriever = get_retriever()

    print("📚 AI Learning Assistant Ready\n")

    while True:
        print("\nSelect Mode:")
        print("1. Normal Q&A")
        print("2. Important Topics")
        print("3. 50% Strategy")
        print("4. 75% Strategy")
        print("5. 100% Strategy")
        print("6. MCQ Generator")
        print("7. 24-Hour Prep Plan")
        print("0. Exit")

        choice = input("Enter choice: ")

        if choice == "0":
            break

        query = input("\nEnter your query: ")

        docs = retriever.get_relevant_documents(query)
        context = format_docs(docs)

        mode_map = {
            "1": "normal",
            "2": "topics",
            "3": "50",
            "4": "75",
            "5": "100",
            "6": "mcq",
            "7": "24hr"
        }

        mode = mode_map.get(choice, "normal")

        llm = get_llm()   # ✅ safe here

        answer = generate_answer(llm, context, query, mode)

        print("\n📌 Result:\n")
        print(answer)
        print("\n" + "="*50)


if __name__ == "__main__":
    chat()