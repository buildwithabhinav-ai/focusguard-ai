from datetime import date, timedelta

from app.database import SessionLocal
from app.models import Organization
from app.services.analytics_service import (
    get_organization_dashboard_metrics_for_date,
)
from app.services.rag.rag_service import rag_service


def main():
    db = SessionLocal()

    try:
        # -------------------------------------------------
        # Get active organizations
        # -------------------------------------------------

        organizations = (
            db.query(Organization)
            .filter(
                Organization.is_active == True
            )
            .all()
        )

        if not organizations:
            print("No active organizations found.")
            return

        # -------------------------------------------------
        # Historical date range
        # -------------------------------------------------
        #
        # We use the same historical range we identified
        # from the existing project data.
        #
        # The current day is intentionally excluded because
        # today's organization RAG summary is already created
        # by the AI recommendation endpoint.
        # -------------------------------------------------

        start_date = date(2026, 7, 12)
        end_date = date(2026, 9, 20)

        total_created_or_updated = 0
        total_skipped = 0

        print()
        print("==============================================")
        print("FOCUSGUARD ORGANIZATION RAG BACKFILL")
        print("==============================================")
        print(
            f"Date range: "
            f"{start_date.isoformat()} -> "
            f"{end_date.isoformat()}"
        )
        print(
            f"Active organizations: "
            f"{len(organizations)}"
        )
        print("==============================================")
        print()

        # -------------------------------------------------
        # Process each organization
        # -------------------------------------------------

        for organization in organizations:

            print(
                f"\nOrganization: "
                f"{organization.id} - "
                f"{organization.organization_name}"
            )

            current_date = start_date

            while current_date <= end_date:

                # -------------------------------------------------
                # Get EXACT historical organization metrics
                # -------------------------------------------------

                metrics = (
                    get_organization_dashboard_metrics_for_date(
                        db=db,
                        organization_id=organization.id,
                        target_date=current_date,
                    )
                )

                # -------------------------------------------------
                # Skip completely empty dates
                # -------------------------------------------------

                if (
                    metrics["active_time"] == 0
                    and metrics["idle_time"] == 0
                    and metrics["browser_time"] == 0
                ):
                    total_skipped += 1

                    current_date += timedelta(days=1)
                    continue

                # -------------------------------------------------
                # Create/update organization daily RAG document
                # -------------------------------------------------

                document = (
                    rag_service.create_organization_daily_summary(
                        db,
                        organization_id=organization.id,
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

                current_date += timedelta(days=1)

        # -------------------------------------------------
        # Final result
        # -------------------------------------------------

        print()
        print("==============================================")
        print("BACKFILL COMPLETE")
        print("==============================================")
        print(
            "Documents created/updated:",
            total_created_or_updated
        )
        print(
            "Empty dates skipped:",
            total_skipped
        )
        print("==============================================")
        print()

    finally:
        db.close()


if __name__ == "__main__":
    main()