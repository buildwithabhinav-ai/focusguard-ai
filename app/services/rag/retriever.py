from typing import Any

from sqlalchemy.orm import Session

from app.services.rag.embeddings import embed_text
from app.services.rag.vector_store import search_similar_documents


def retrieve_relevant_context(
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
) -> list[dict[str, Any]]:

    # =========================================================
    # VALIDATION
    # =========================================================

    if not query or not query.strip():
        return []

    if user_id is None and organization_id is None:
        raise ValueError(
            "Either user_id or organization_id must be provided "
            "for a scoped retrieval."
        )

    if (
        start_date is not None
        and end_date is not None
        and start_date > end_date
    ):
        raise ValueError(
            "start_date cannot be later than end_date."
        )

    # =========================================================
    # CREATE QUERY EMBEDDING
    # =========================================================

    query_embedding = embed_text(query)

    # =========================================================
    # VECTOR SEARCH
    # =========================================================

    results = search_similar_documents(
        db,
        query_embedding=query_embedding,
        user_id=user_id,
        organization_id=organization_id,
        document_type=document_type,
        exclude_date=exclude_date,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        min_similarity=min_similarity,
    )

    # =========================================================
    # FORMAT RESULTS
    # =========================================================

    return [
        {
            "document_id": document.id,
            "document_type": document.document_type,
            "content": document.content,
            "similarity": similarity,
            "metadata": document.document_metadata,
            "created_at": document.created_at,
        }
        for document, similarity in results
    ]