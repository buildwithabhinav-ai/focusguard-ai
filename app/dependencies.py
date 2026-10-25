from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.security import verify_access_token
from app.security_scheme import bearer_scheme


# Database Dependency
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Get Current Logged In User
def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),

    db: Session = Depends(get_db)

):

    token = credentials.credentials

    try:

        payload = verify_access_token(token)

    except Exception as e:

        if str(e) == "TOKEN_EXPIRED":

            raise HTTPException(
            status_code=401,
            detail="Your login session has expired. Please log in again."
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token."
        )

    if payload is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    email = payload.get("sub")

    if email is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User Not Found"
        )

    return user