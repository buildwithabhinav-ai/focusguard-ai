from typing import Any


def build_rag_context(
    documents: list[dict[str, Any]],
    *,
    max_documents: int = 5,
    max_chars_per_document: int = 3000,
) -> str:

    if not documents:
        return ""

    selected_documents = documents[:max_documents]

    sections: list[str] = []

    for index, document in enumerate(selected_documents, start=1):

        content = str(
            document.get("content", "")
        ).strip()

        if not content:
            continue

        content = content[:max_chars_per_document]

        document_type = document.get(
            "document_type",
            "unknown"
        )

        similarity = document.get("similarity")

        if similarity is not None:
            similarity_text = f"{float(similarity):.3f}"
        else:
            similarity_text = "unknown"

        metadata = document.get("metadata") or {}

        historical_date = metadata.get("date")

        if historical_date:
            date_text = str(historical_date)
        else:
            date_text = "unknown"

        sections.append(
            f"[Historical Context {index}]\n"
            f"Document Type: {document_type}\n"
            f"Historical Date: {date_text}\n"
            f"Similarity: {similarity_text}\n"
            f"{content}"
        )

    if not sections:
        return ""

    return (
        "RELEVANT HISTORICAL FOCUSGUARD CONTEXT\n"
        "The following information was retrieved from the user's "
        "historical FocusGuard records.\n\n"
        "Important rules:\n"
        "- This is historical information, not today's current analytics.\n"
        "- Preserve the historical dates exactly as provided.\n"
        "- Use historical context only when relevant to the user's question.\n"
        "- Do not treat historical context as more authoritative than "
        "current analytics supplied by the application.\n"
        "- Do not invent information that is not present in the retrieved records.\n\n"
        + "\n\n".join(sections)
    )