from typing import Any

from sqlalchemy.orm import Session

from app.services.rag.context_builder import build_rag_context
from app.services.rag.documents import (
    build_category_summary_document,
    build_daily_summary_document,
    build_organization_summary_document,
    build_website_summary_document,
)
from app.services.rag.embeddings import embed_text
from app.services.rag.retriever import retrieve_relevant_context
from app.services.rag.vector_store import (
    store_document,
    upsert_daily_summary,
    upsert_organization_daily_summary,
)


class RAGService:

    # =========================================================
    # USER DAILY SUMMARY
    # =========================================================

    def create_daily_summary(
        self,
        db: Session,
        *,
        user_id: int,
        organization_id: int | None,
        date: str,
        metrics: dict[str, Any],
    ):

        content = build_daily_summary_document(
            date=date,
            focus_score=metrics.get("focus_score"),
            browser_time=metrics.get("browser_time"),
            active_time=metrics.get("active_time"),
            idle_time=metrics.get("idle_time"),
            productive_time=metrics.get("productive_time"),
            non_productive_time=metrics.get("non_productive_time"),
            tab_switches=metrics.get("tab_switches"),
            top_websites=metrics.get("top_websites"),
            top_categories=metrics.get("top_categories"),
            productive_websites=metrics.get("productive_websites"),
            distracting_websites=metrics.get("distracting_websites"),
        )

        embedding = embed_text(content)

        return upsert_daily_summary(
            db,
            user_id=user_id,
            organization_id=organization_id,
            date=date,
            content=content,
            embedding=embedding,
        )

    # =========================================================
    # ORGANIZATION DAILY SUMMARY
    # Used by Sub Admin / Super Admin
    # =========================================================

    def create_organization_daily_summary(
        self,
        db: Session,
        *,
        organization_id: int,
        date: str,
        metrics: dict[str, Any],
    ):

        content = build_organization_summary_document(
            date=date,
            focus_score=metrics.get("focus_score"),
            browser_time=metrics.get("browser_time"),
            active_time=metrics.get("active_time"),
            idle_time=metrics.get("idle_time"),
            productive_time=metrics.get("productive_time"),
            non_productive_time=metrics.get("non_productive_time"),
            tab_switches=metrics.get("tab_switches"),
            top_websites=metrics.get("top_websites"),
            top_categories=metrics.get("top_categories"),
            productive_websites=metrics.get("productive_websites"),
            distracting_websites=metrics.get("distracting_websites"),
        )

        embedding = embed_text(content)

        return upsert_organization_daily_summary(
            db,
            organization_id=organization_id,
            date=date,
            content=content,
            embedding=embedding,
        )

    # =========================================================
    # WEBSITE SUMMARY
    # =========================================================

    def create_website_summary(
        self,
        db: Session,
        *,
        user_id: int,
        organization_id: int | None,
        date: str,
        websites: list[Any],
    ):

        content = build_website_summary_document(
            date=date,
            websites=websites,
        )

        embedding = embed_text(content)

        return store_document(
            db,
            user_id=user_id,
            organization_id=organization_id,
            document_type="website_summary",
            content=content,
            embedding=embedding,
            metadata={
                "date": date,
                "source": "dashboard_metrics",
            },
        )

    # =========================================================
    # CATEGORY SUMMARY
    # =========================================================

    def create_category_summary(
        self,
        db: Session,
        *,
        user_id: int,
        organization_id: int | None,
        date: str,
        categories: list[Any],
    ):

        content = build_category_summary_document(
            date=date,
            categories=categories,
        )

        embedding = embed_text(content)

        return store_document(
            db,
            user_id=user_id,
            organization_id=organization_id,
            document_type="category_summary",
            content=content,
            embedding=embedding,
            metadata={
                "date": date,
                "source": "dashboard_metrics",
            },
        )

    # =========================================================
    # RETRIEVE RAG CONTEXT
    # =========================================================

    def retrieve_context(
        self,
        db: Session,
        *,
        query: str,
        user_id: int | None = None,
        organization_id: int | None = None,
        document_type: str | None = None,
        exclude_date: str | None = None,
        start_date: str | None = None,
        end_date: str | None = None,
        limit: int = 5,
        min_similarity: float = 0.25,
    ) -> str:

        documents = retrieve_relevant_context(
            db,
            query=query,
            user_id=user_id,
            organization_id=organization_id,
            document_type=document_type,
            exclude_date=exclude_date,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
            min_similarity=min_similarity,
        )

        return build_rag_context(documents)


rag_service = RAGService()