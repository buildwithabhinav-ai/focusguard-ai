from fastapi.security import HTTPBearer

bearer_scheme = HTTPBearer(
    description="Enter your JWT Token"
)