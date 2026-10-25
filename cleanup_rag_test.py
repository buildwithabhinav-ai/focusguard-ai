from app.database import SessionLocal
from app.models import RAGDocument


def main():
    db = SessionLocal()

    try:
        deleted = (
            db.query(RAGDocument)
            .filter(RAGDocument.document_type == "test")
            .delete(synchronize_session=False)
        )

        db.commit()

        print(f"Deleted {deleted} test RAG document(s).")

    finally:
        db.close()


if __name__ == "__main__":
    main()