from datetime import datetime

from app.database import SessionLocal
from app.models import ActivityLog

from app.services.analytics_service import (
    get_dashboard_metrics_for_date
)

from app.services.rag.rag_service import rag_service


def main():

    db = SessionLocal()

    try:

        # ---------------------------------------------
        # User whose real historical data we are using
        # ---------------------------------------------

        user_id = 1

        # ---------------------------------------------
        # Get actual activity dates from PostgreSQL
        # ---------------------------------------------

        rows = (
            db.query(ActivityLog.start_time)
            .filter(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time.isnot(None)
            )
            .order_by(ActivityLog.start_time)
            .all()
        )

        dates = sorted(
            {
                row[0].date()
                for row in rows
            }
        )

        print("\n===== RAG HISTORICAL BACKFILL =====\n")
        print(f"User ID: {user_id}")
        print(f"Historical days found: {len(dates)}")

        if not dates:
            print("No historical activity found.")
            return

        print("\nDates to process:")

        for date in dates:
            print(f"- {date}")

        print("\n" + "=" * 60)

        # ---------------------------------------------
        # Process every real historical date
        # ---------------------------------------------

        created_count = 0

        for target_date in dates:

            date_string = target_date.strftime(
                "%Y-%m-%d"
            )

            print(
                f"\nProcessing {date_string}..."
            )

            # -----------------------------------------
            # Calculate analytics from real DB records
            # -----------------------------------------

            metrics = get_dashboard_metrics_for_date(
                db,
                user_id=user_id,
                target_date=datetime(
                    target_date.year,
                    target_date.month,
                    target_date.day
                )
            )

            # -----------------------------------------
            # Create/update RAG document
            # -----------------------------------------

            document = rag_service.create_daily_summary(
                db,
                user_id=user_id,
                organization_id=None,
                date=date_string,
                metrics=metrics,
            )

            created_count += 1

            print(
                f"Document ID: {document.id}"
            )

            print(
                f"Focus Score: "
                f"{metrics['focus_score']}"
            )

            print(
                f"Browser Time: "
                f"{metrics['browser_time_text']}"
            )

            print(
                f"Active Time: "
                f"{metrics['active_time_text']}"
            )

            print(
                f"Idle Time: "
                f"{metrics['idle_time_text']}"
            )

            print(
                f"Productive Time: "
                f"{metrics['productive_time_text']}"
            )

            print(
                f"Non-productive Time: "
                f"{metrics['non_productive_time_text']}"
            )

            print(
                f"Tab Switches: "
                f"{metrics['tab_switches']}"
            )

        # ---------------------------------------------
        # Final result
        # ---------------------------------------------

        print("\n" + "=" * 60)

        print(
            "\n===== BACKFILL COMPLETE =====\n"
        )

        print(
            f"Processed days: {created_count}"
        )

        print(
            "All documents were generated "
            "from real FocusGuard database data."
        )

    finally:

        db.close()


if __name__ == "__main__":
    main()