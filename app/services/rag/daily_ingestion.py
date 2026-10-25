from datetime import date, timedelta

from app.database import SessionLocal
from app.models import User, Organization

from app.services.analytics_service import (
    get_dashboard_metrics_for_date,
    get_organization_dashboard_metrics_for_date,
)

from app.services.rag.rag_service import rag_service


def ingest_user_daily_rag(target_date: date) -> int:
    """
    Create/update one daily RAG summary for every active user
    who has activity on the target date.
    """

    db = SessionLocal()

    created_or_updated = 0

    try:

        users = (
            db.query(User)
            .filter(
                User.is_active == True,
                User.role == "USER"
            )
            .all()
        )

        for user in users:

            metrics = get_dashboard_metrics_for_date(
                db=db,
                user_id=user.id,
                target_date=target_date,
            )

            # Skip users with no activity.
            if (
                metrics["active_time"] == 0
                and metrics["idle_time"] == 0
                and metrics["browser_time"] == 0
            ):
                continue

            rag_service.create_daily_summary(
                db,
                user_id=user.id,
                organization_id=user.organization_id,
                date=target_date.isoformat(),
                metrics=metrics,
            )

            created_or_updated += 1

            print(
                f"[RAG] User {user.id} "
                f"daily summary processed for "
                f"{target_date.isoformat()}"
            )

        return created_or_updated

    finally:
        db.close()


def ingest_organization_daily_rag(target_date: date) -> int:
    """
    Create/update one daily RAG summary for every active
    organization that has activity on the target date.
    """

    db = SessionLocal()

    created_or_updated = 0

    try:

        organizations = (
            db.query(Organization)
            .filter(
                Organization.is_active == True
            )
            .all()
        )

        for organization in organizations:

            metrics = (
                get_organization_dashboard_metrics_for_date(
                    db=db,
                    organization_id=organization.id,
                    target_date=target_date,
                )
            )

            # Skip organizations with no activity.
            if (
                metrics["active_time"] == 0
                and metrics["idle_time"] == 0
                and metrics["browser_time"] == 0
            ):
                continue

            rag_service.create_organization_daily_summary(
                db,
                organization_id=organization.id,
                date=target_date.isoformat(),
                metrics=metrics,
            )

            created_or_updated += 1

            print(
                f"[RAG] Organization "
                f"{organization.id} "
                f"daily summary processed for "
                f"{target_date.isoformat()}"
            )

        return created_or_updated

    finally:
        db.close()


def run_daily_rag_ingestion() -> None:
    """
    Process yesterday's activity and store it as
    historical RAG knowledge.

    This function is intentionally safe to run repeatedly
    because the underlying RAG service performs an upsert
    for the same user/organization and date.
    """

    target_date = date.today() - timedelta(days=1)

    print()
    print("==============================================")
    print("FOCUSGUARD DAILY RAG INGESTION")
    print("==============================================")
    print(
        f"Processing date: "
        f"{target_date.isoformat()}"
    )
    print("==============================================")

    user_count = ingest_user_daily_rag(
        target_date
    )

    organization_count = (
        ingest_organization_daily_rag(
            target_date
        )
    )

    print()
    print("==============================================")
    print("DAILY RAG INGESTION COMPLETE")
    print("==============================================")
    print(
        f"User documents processed: "
        f"{user_count}"
    )
    print(
        f"Organization documents processed: "
        f"{organization_count}"
    )
    print("==============================================")
    print()