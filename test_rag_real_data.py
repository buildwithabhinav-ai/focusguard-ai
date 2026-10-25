from datetime import datetime

from app.database import SessionLocal
from app.services.analytics_service import get_dashboard_metrics
from app.services.rag.rag_service import rag_service


def main():

    db = SessionLocal()

    try:

        user_id = 1

        organization_id = None

        today = datetime.now().strftime("%Y-%m-%d")

        print("\nGetting real FocusGuard analytics...")

        metrics = get_dashboard_metrics(
            db,
            user_id=user_id,
            period="today",
        )

        print("\n===== CURRENT ANALYTICS =====\n")

        for key, value in metrics.items():
            print(f"{key}: {value}")

        print("\nCreating RAG document...")

        document = rag_service.create_daily_summary(
            db,
            user_id=user_id,
            organization_id=organization_id,
            date=today,
            metrics=metrics,
        )

        print("\n===== RAG DOCUMENT CREATED =====\n")

        print(f"Document ID: {document.id}")
        print(f"Document Type: {document.document_type}")
        print("\nContent:")
        print(document.content)

        print("\nTesting retrieval...")

        query = (
            "What were my productivity patterns, "
            "focus score, productive time, idle time, "
            "and distracting websites?"
        )

        context = rag_service.retrieve_context(
            db,
            query=query,
            user_id=user_id,
            limit=5,
        )

        print("\n===== RETRIEVED RAG CONTEXT =====\n")
        print(context)

    finally:
        db.close()


if __name__ == "__main__":
    main()