import os
from functools import lru_cache
from typing import TYPE_CHECKING

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"


if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer


# Local embedding model.
# This model produces 384-dimensional embeddings.
MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model() -> "SentenceTransformer":
    """
    Load the embedding model only when it is actually needed.

    The import and model loading are both delayed until the first
    embedding request. The model is then cached and reused.
    """
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(
        MODEL_NAME,
        device="cpu",
    )


def embed_text(text: str) -> list[float]:
    """
    Convert a single text into a normalized embedding vector.
    """

    if not text or not text.strip():
        raise ValueError("Text must not be empty.")

    model = get_embedding_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )

    return embedding.tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Convert multiple texts into normalized embedding vectors.
    """

    if not texts:
        return []

    if any(not text or not text.strip() for text in texts):
        raise ValueError("Texts must not contain empty values.")

    model = get_embedding_model()

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )

    return embeddings.tolist()


def get_embedding_dimension() -> int:
    """
    Return the dimensionality of the embedding model.
    """

    model = get_embedding_model()

    return model.get_embedding_dimension()