from sqlalchemy import text
from app.database import engine

with engine.connect() as connection:
    result = connection.execute(
        text("SELECT extname FROM pg_extension WHERE extname = 'vector'")
    ).fetchall()

print(result)