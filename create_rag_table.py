from sqlalchemy import text

from app.database import engine


def create_rag_table():
    sql = """
    CREATE TABLE IF NOT EXISTS rag_documents (
        id SERIAL PRIMARY KEY,

        user_id INTEGER NULL,
        organization_id INTEGER NULL,

        document_type VARCHAR(100) NOT NULL,

        content TEXT NOT NULL,

        embedding VECTOR(384) NOT NULL,

        metadata JSONB NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS ix_rag_documents_user_id
        ON rag_documents (user_id);

    CREATE INDEX IF NOT EXISTS ix_rag_documents_organization_id
        ON rag_documents (organization_id);

    CREATE INDEX IF NOT EXISTS ix_rag_documents_document_type
        ON rag_documents (document_type);

    CREATE INDEX IF NOT EXISTS ix_rag_documents_created_at
        ON rag_documents (created_at);
    """

    try:
        with engine.begin() as connection:
            connection.execute(text(sql))

        print("RAG documents table created successfully.")

    except Exception as e:
        print("Failed to create RAG documents table.")
        print("Error:", e)


if __name__ == "__main__":
    create_rag_table()