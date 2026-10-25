from datetime import date, timedelta

from app.database import SessionLocal
from app.models import User

from app.services.analytics_service import (
    get_dashboard_metrics_for_date,
)

from app.services.rag.rag_service import rag_service

from app.services.rag.vector_store import (
    delete_user_documents,
)


START_DATE = date(2026, 7, 12)
END_DATE = date(2026, 9, 20)


def main():

    db = SessionLocal()

    try:

        users = (
            db.query(User)
            .filter(
                User.is_active == True,
                User.role == "USER",
            )
            .all()
        )

        print()
        print("==============================================")
        print("FOCUSGUARD USER RAG CLEAN REBUILD")
        print("==============================================")
        print(
            f"Date range: "
            f"{START_DATE.isoformat()} -> "
            f"{END_DATE.isoformat()}"
        )
        print(
            f"Active users: {len(users)}"
        )
        print("==============================================")
        print()

        total_deleted = 0
        total_rebuilt = 0
        total_skipped = 0

        # --------------------------------------------------
        # STEP 1: DELETE ALL OLD USER DAILY RAG DOCUMENTS
        # --------------------------------------------------

        print("STEP 1: Removing old user daily RAG documents...")
        print()

        for user in users:

            deleted = delete_user_documents(
                db,
                user_id=user.id,
                document_type="daily_summary",
            )

            total_deleted += deleted

            print(
                f"User {user.id} "
                f"({user.email}): "
                f"deleted {deleted} old documents"
            )

        print()
        print(
            f"Total old documents deleted: {total_deleted}"
        )

        # --------------------------------------------------
        # STEP 2: REBUILD FROM CORRECTED ANALYTICS
        # --------------------------------------------------

        print()
        print("STEP 2: Rebuilding user RAG documents...")
        print()

        for user in users:

            print(
                f"User: {user.id} - {user.email}"
            )

            current_date = START_DATE

            while current_date <= END_DATE:

                metrics = get_dashboard_metrics_for_date(
                    db=db,
                    user_id=user.id,
                    target_date=current_date,
                )

                # Completely empty day
                if (
                    metrics["active_time"] == 0
                    and metrics["idle_time"] == 0
                    and metrics["browser_time"] == 0
                ):

                    total_skipped += 1

                    current_date += timedelta(days=1)

                    continue

                document = rag_service.create_daily_summary(
                    db,
                    user_id=user.id,
                    organization_id=user.organization_id,
                    date=current_date.isoformat(),
                    metrics=metrics,
                )

                total_rebuilt += 1

                print(
                    f"  {current_date.isoformat()} | "
                    f"focus={metrics['focus_score']}% | "
                    f"active={metrics['active_time_text']} | "
                    f"idle={metrics['idle_time_text']} | "
                    f"browser={metrics['browser_time_text']} | "
                    f"document_id={document.id}"
                )

                current_date += timedelta(days=1)

        print()
        print("==============================================")
        print("USER RAG CLEAN REBUILD COMPLETE")
        print("==============================================")
        print(
            f"Old documents deleted: {total_deleted}"
        )
        print(
            f"New documents created: {total_rebuilt}"
        )
        print(
            f"Empty dates skipped: {total_skipped}"
        )
        print("==============================================")
        print()

    finally:
        db.close()


if __name__ == "__main__":
    main()