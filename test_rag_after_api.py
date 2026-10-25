from app.database import SessionLocal
from app.models import RAGDocument


def main():
    db = SessionLocal()

    try:
        documents = (
            db.query(RAGDocument)
            .filter(
                RAGDocument.user_id == 1,
                RAGDocument.document_type == "daily_summary",
            )
            .order_by(RAGDocument.id.desc())
            .all()
        )

        print("\n===== USER RAG DOCUMENTS =====\n")

        if not documents:
            print("No daily RAG documents found.")
            return

        for document in documents:
            print(f"Document ID: {document.id}")
            print(f"User ID: {document.user_id}")
            print(f"Organization ID: {document.organization_id}")
            print(f"Type: {document.document_type}")
            print(f"Metadata: {document.document_metadata}")
            print("\nContent:")
            print(document.content)
            print("\n" + "=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    main()