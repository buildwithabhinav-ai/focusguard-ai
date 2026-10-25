from sqlalchemy import text
from app.database import engine

try:
    with engine.connect() as connection:
        connection.execute(
            text("CREATE EXTENSION IF NOT EXISTS vector")
        )
        connection.commit()

    print("pgvector extension enabled successfully.")

except Exception as e:
    print("Could not enable pgvector.")
    print("Error:", e)