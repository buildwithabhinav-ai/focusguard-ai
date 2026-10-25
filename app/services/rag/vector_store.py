from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RAGDocument


def store_document(
    db: Session,
    *,
    user_id: int | None,
    organization_id: int | None,
    document_type: str,
    content: str,
    embedding: list[float],
    metadata: dict[str, Any] | None = None,
) -> RAGDocument:

    if not content or not content.strip():
        raise ValueError("Document content must not be empty.")

    if len(embedding) != 384:
        raise ValueError(
            f"Expected a 384-dimensional embedding, "
            f"got {len(embedding)} dimensions."
        )

    document = RAGDocument(
        user_id=user_id,
        organization_id=organization_id,
        document_type=document_type,
        content=content,
        embedding=embedding,
        document_metadata=metadata,
        created_at=datetime.utcnow(),
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def upsert_daily_summary(
    db: Session,
    *,
    user_id: int,
    organization_id: int | None,
    date: str,
    content: str,
    embedding: list[float],
) -> RAGDocument:

    if not content or not content.strip():
        raise ValueError("Document content must not be empty.")

    if len(embedding) != 384:
        raise ValueError(
            f"Expected a 384-dimensional embedding, "
            f"got {len(embedding)} dimensions."
        )

    query = (
        select(RAGDocument)
        .where(
            RAGDocument.user_id == user_id,
            RAGDocument.document_type == "daily_summary",
        )
    )

    documents = db.execute(query).scalars().all()

    existing_document = None

    for document in documents:
        metadata = document.document_metadata or {}

        if metadata.get("date") == date:
            existing_document = document
            break

    if existing_document:

        existing_document.content = content
        existing_document.embedding = embedding
        existing_document.organization_id = organization_id
        existing_document.document_metadata = {
            "date": date,
            "source": "dashboard_metrics",
        }

        db.commit()
        db.refresh(existing_document)

        return existing_document

    return store_document(
        db,
        user_id=user_id,
        organization_id=organization_id,
        document_type="daily_summary",
        content=content,
        embedding=embedding,
        metadata={
            "date": date,
            "source": "dashboard_metrics",
        },
    )


def upsert_organization_daily_summary(
    db: Session,
    *,
    organization_id: int,
    date: str,
    content: str,
    embedding: list[float],
) -> RAGDocument:

    if not content or not content.strip():
        raise ValueError("Document content must not be empty.")

    if len(embedding) != 384:
        raise ValueError(
            f"Expected a 384-dimensional embedding, "
            f"got {len(embedding)} dimensions."
        )

    query = (
        select(RAGDocument)
        .where(
            RAGDocument.organization_id == organization_id,
            RAGDocument.document_type == "organization_daily_summary",
        )
    )

    documents = db.execute(query).scalars().all()

    existing_document = None

    for document in documents:
        metadata = document.document_metadata or {}

        if metadata.get("date") == date:
            existing_document = document
            break

    if existing_document:

        existing_document.content = content
        existing_document.embedding = embedding
        existing_document.document_metadata = {
            "date": date,
            "source": "organization_dashboard_metrics",
        }

        db.commit()
        db.refresh(existing_document)

        return existing_document

    return store_document(
        db,
        user_id=None,
        organization_id=organization_id,
        document_type="organization_daily_summary",
        content=content,
        embedding=embedding,
        metadata={
            "date": date,
            "source": "organization_dashboard_metrics",
        },
    )


def search_similar_documents(
    db: Session,
    *,
    query_embedding: list[float],
    user_id: int | None = None,
    organization_id: int | None = None,
    document_type: str | None = None,
    limit: int = 5,
    min_similarity: float = 0.0,
    exclude_date: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
) -> list[tuple[RAGDocument, float]]:

    if len(query_embedding) != 384:
        raise ValueError(
            f"Expected a 384-dimensional query embedding, "
            f"got {len(query_embedding)} dimensions."
        )

    if limit < 1:
        raise ValueError("limit must be at least 1.")

    if user_id is None and organization_id is None:
        raise ValueError(
            "Either user_id or organization_id must be provided "
            "for a scoped RAG search."
        )

    if (
        start_date is not None
        and end_date is not None
        and start_date > end_date
    ):
        raise ValueError(
            "start_date cannot be later than end_date."
        )

    cosine_distance = RAGDocument.embedding.cosine_distance(
        query_embedding
    )

    similarity = (1 - cosine_distance).label("similarity")

    query = (
        select(RAGDocument, similarity)
        .where(cosine_distance <= 1 - min_similarity)
    )

    # =========================================================
    # SECURITY SCOPE
    # =========================================================

    # User-level retrieval only sees that user's documents.
    if user_id is not None:
        query = query.where(
            RAGDocument.user_id == user_id
        )

    # Organization-level retrieval only sees that
    # organization's documents.
    if organization_id is not None:
        query = query.where(
            RAGDocument.organization_id == organization_id
        )

    # =========================================================
    # DOCUMENT TYPE
    # =========================================================

    if document_type is not None:
        query = query.where(
            RAGDocument.document_type == document_type
        )

    # =========================================================
    # DATE FILTERING
    # =========================================================

    # Every RAG summary stores its historical date inside:
    #
    # document_metadata = {
    #     "date": "YYYY-MM-DD",
    #     ...
    # }
    #
    # SQLAlchemy's as_string() extracts the JSON date value
    # as text in PostgreSQL.
    #
    # Because the stored format is YYYY-MM-DD, normal string
    # comparison is also chronological.
    date_expression = (
        RAGDocument.document_metadata["date"].as_string()
    )

    # Exclude one specific date.
    #
    # Example:
    # exclude_date="2026-09-22"
    #
    # This prevents today's document from being retrieved when
    # today's metrics are already supplied directly.
    if exclude_date is not None:
        query = query.where(
            date_expression != exclude_date
        )

    # Only retrieve documents on or after start_date.
    if start_date is not None:
        query = query.where(
            date_expression >= start_date
        )

    # Only retrieve documents on or before end_date.
    if end_date is not None:
        query = query.where(
            date_expression <= end_date
        )

    # =========================================================
    # VECTOR SEARCH
    # =========================================================

    query = (
        query
        .order_by(cosine_distance)
        .limit(limit)
    )

    results = db.execute(query).all()

    return [
        (document, float(similarity_score))
        for document, similarity_score in results
    ]


def delete_user_documents(
    db: Session,
    *,
    user_id: int,
    document_type: str | None = None,
) -> int:

    query = select(RAGDocument).where(
        RAGDocument.user_id == user_id
    )

    if document_type is not None:
        query = query.where(
            RAGDocument.document_type == document_type
        )

    documents = db.execute(query).scalars().all()

    count = len(documents)

    for document in documents:
        db.delete(document)

    db.commit()

    return count


def delete_organization_documents(
    db: Session,
    *,
    organization_id: int,
    document_type: str | None = None,
) -> int:

    query = select(RAGDocument).where(
        RAGDocument.organization_id == organization_id
    )

    if document_type is not None:
        query = query.where(
            RAGDocument.document_type == document_type
        )

    documents = db.execute(query).scalars().all()

    count = len(documents)

    for document in documents:
        db.delete(document)

    db.commit()

    return count