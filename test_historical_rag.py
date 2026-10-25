from datetime import datetime

from app.database import SessionLocal

from app.services.analytics_service import (
    get_dashboard_metrics_for_date
)

from app.services.rag.rag_service import rag_service


def main():

    db = SessionLocal()

    try:

        user_id = 1
        organization_id = None
        target_date = datetime.strptime(
            "2026-07-12",
            "%Y-%m-%d"
        )

        date_string = target_date.strftime("%Y-%m-%d")

        print("\n===== GETTING REAL HISTORICAL ANALYTICS =====\n")

        metrics = get_dashboard_metrics_for_date(
            db,
            user_id=user_id,
            target_date=target_date
        )

        print(f"Date: {date_string}")
        print(f"Browser time: {metrics['browser_time_text']}")
        print(f"Active time: {metrics['active_time_text']}")
        print(f"Idle time: {metrics['idle_time_text']}")
        print(
            f"Productive time: "
            f"{metrics['productive_time_text']}"
        )
        print(
            f"Non-productive time: "
            f"{metrics['non_productive_time_text']}"
        )
        print(f"Focus score: {metrics['focus_score']}")
        print(f"Tab switches: {metrics['tab_switches']}")
        print(f"Top websites: {metrics['top_websites']}")
        print(f"Top categories: {metrics['top_categories']}")
        print(
            f"Productive websites: "
            f"{metrics['productive_websites']}"
        )
        print(
            f"Distracting websites: "
            f"{metrics['distracting_websites']}"
        )

        print("\n===== CREATING HISTORICAL RAG DOCUMENT =====\n")

        document = rag_service.create_daily_summary(
            db,
            user_id=user_id,
            organization_id=organization_id,
            date=date_string,
            metrics=metrics,
        )

        print("RAG document created/updated successfully.")
        print(f"Document ID: {document.id}")
        print(f"Document Type: {document.document_type}")
        print(f"User ID: {document.user_id}")
        print(f"Metadata: {document.document_metadata}")

        print("\n===== RAG DOCUMENT CONTENT =====\n")

        print(document.content)

    finally:

        db.close()


if __name__ == "__main__":
    main()