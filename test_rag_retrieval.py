from app.database import SessionLocal
from app.services.rag.rag_service import rag_service


def main():
    db = SessionLocal()

    try:
        query = (
            "How productive was the user while working "
            "on software development?"
        )

        context = rag_service.retrieve_context(
            db,
            query=query,
            user_id=1,
            limit=5,
        )

        print("\n===== RAG CONTEXT =====\n")
        print(context)

    finally:
        db.close()


if __name__ == "__main__":
    main()