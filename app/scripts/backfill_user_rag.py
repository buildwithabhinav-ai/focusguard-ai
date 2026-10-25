from datetime import date, timedelta

from app.database import SessionLocal
from app.models import User

from app.services.analytics_service import (
    get_dashboard_metrics_for_date,
)

from app.services.rag.rag_service import rag_service


def main():

    db = SessionLocal()

    try:

        users = (
            db.query(User)
            .filter(
                User.is_active == True,
                User.role == "USER"
            )
            .all()
        )

        if not users:

            print(
                "No active users found."
            )

            return

        # -------------------------------------------------
        # Historical RAG range
        # -------------------------------------------------

        start_date = date(
            2026,
            7,
            12
        )

        end_date = date(
            2026,
            9,
            20
        )

        total_created_or_updated = 0
        total_skipped = 0

        print()
        print(
            "=============================================="
        )
        print(
            "FOCUSGUARD USER RAG BACKFILL"
        )
        print(
            "=============================================="
        )

        print(
            f"Date range: "
            f"{start_date.isoformat()} -> "
            f"{end_date.isoformat()}"
        )

        print(
            f"Active users: "
            f"{len(users)}"
        )

        print(
            "=============================================="
        )
        print()

        # -------------------------------------------------
        # Process every user
        # -------------------------------------------------

        for user in users:

            print()
            print(
                f"User: "
                f"{user.id} - "
                f"{user.email}"
            )

            current_date = start_date

            while current_date <= end_date:

                # -----------------------------------------
                # Get corrected historical analytics
                # -----------------------------------------

                metrics = (
                    get_dashboard_metrics_for_date(
                        db=db,
                        user_id=user.id,
                        target_date=current_date,
                    )
                )

                # -----------------------------------------
                # Skip completely empty dates
                # -----------------------------------------

                if (
                    metrics["active_time"] == 0
                    and metrics["idle_time"] == 0
                    and metrics["browser_time"] == 0
                ):

                    total_skipped += 1

                    current_date += timedelta(
                        days=1
                    )

                    continue

                # -----------------------------------------
                # Create/update RAG document
                # -----------------------------------------

                document = (
                    rag_service.create_daily_summary(
                        db,
                        user_id=user.id,
                        organization_id=user.organization_id,
                        date=current_date.isoformat(),
                        metrics=metrics,
                    )
                )

                total_created_or_updated += 1

                print(
                    f"  {current_date.isoformat()} | "
                    f"focus={metrics['focus_score']}% | "
                    f"active={metrics['active_time_text']} | "
                    f"idle={metrics['idle_time_text']} | "
                    f"browser={metrics['browser_time_text']} | "
                    f"document_id={document.id}"
                )

                current_date += timedelta(
                    days=1
                )

        # -------------------------------------------------
        # Complete
        # -------------------------------------------------

        print()
        print(
            "=============================================="
        )
        print(
            "USER RAG BACKFILL COMPLETE"
        )
        print(
            "=============================================="
        )

        print(
            "Documents created/updated:",
            total_created_or_updated
        )

        print(
            "Empty dates skipped:",
            total_skipped
        )

        print(
            "=============================================="
        )
        print()

    finally:

        db.close()


if __name__ == "__main__":

    main()