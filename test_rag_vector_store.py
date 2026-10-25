from app.database import SessionLocal
from app.services.rag.embeddings import embed_text
from app.services.rag.vector_store import (
    search_similar_documents,
    store_document,
)


def main():
    db = SessionLocal()

    try:
        test_content = (
            "FocusGuard test document. "
            "The user spent time working on software development "
            "and maintained a productive focus session."
        )

        embedding = embed_text(test_content)

        document = store_document(
            db,
            user_id=1,
            organization_id=None,
            document_type="test",
            content=test_content,
            embedding=embedding,
            metadata={
                "source": "rag_test",
            },
        )

        print("Document stored successfully.")
        print("Document ID:", document.id)

        query = (
            "The user was productive while working on "
            "software development."
        )

        query_embedding = embed_text(query)

        results = search_similar_documents(
            db,
            query_embedding=query_embedding,
            user_id=1,
            limit=5,
        )

        print("\nSimilarity search results:")

        for result_document, similarity in results:
            print(
                f"- ID: {result_document.id}, "
                f"similarity: {similarity:.4f}"
            )
            print(f"  Content: {result_document.content}")

    finally:
        db.close()


if __name__ == "__main__":
    main()