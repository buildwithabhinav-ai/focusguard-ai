from datetime import datetime

from app.database import SessionLocal
from app.services.analytics_service import get_organization_dashboard_metrics
from app.services.rag.rag_service import rag_service


def main():

    db = SessionLocal()

    try:

        organization_id = 1

        today = datetime.now().strftime("%Y-%m-%d")

        print("\nGetting organization analytics...")

        metrics = get_organization_dashboard_metrics(
            db,
            organization_id=organization_id,
            period="today",
        )

        print("\n===== ORGANIZATION ANALYTICS =====\n")

        for key, value in metrics.items():
            print(f"{key}: {value}")

        print("\nCreating organization RAG document...")

        document = rag_service.create_organization_daily_summary(
            db,
            organization_id=organization_id,
            date=today,
            metrics=metrics,
        )

        print("\n===== ORGANIZATION RAG DOCUMENT =====\n")

        print(f"Document ID: {document.id}")
        print(f"Document Type: {document.document_type}")
        print(f"Organization ID: {document.organization_id}")

        print("\nContent:")
        print(document.content)

        print("\nTesting organization retrieval...")

        query = (
            "What are the organization's productivity patterns, "
            "focus score, productive time, idle time, "
            "and distracting websites?"
        )

        context = rag_service.retrieve_context(
            db,
            query=query,
            organization_id=organization_id,
            limit=5,
        )

        print("\n===== ORGANIZATION RAG CONTEXT =====\n")

        print(context)

    finally:
        db.close()


if __name__ == "__main__":
    main()