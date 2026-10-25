from datetime import datetime, timedelta

from jose import JWTError
from jose import ExpiredSignatureError
from jose import jwt
from passlib.context import CryptContext

from app.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)

# -------------------------------------------------------
# Password Hashing Configuration
# -------------------------------------------------------

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# -------------------------------------------------------
# Hash Password
# -------------------------------------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# -------------------------------------------------------
# Verify Password
# -------------------------------------------------------

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# -------------------------------------------------------
# Create Access Token
# -------------------------------------------------------

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "access"
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# -------------------------------------------------------
# Create Refresh Token
# -------------------------------------------------------

def create_refresh_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "refresh"
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# -------------------------------------------------------
# Verify Access Token
# -------------------------------------------------------

def verify_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "access":

            raise Exception("INVALID_ACCESS_TOKEN")

        return payload

    except ExpiredSignatureError:

        raise Exception("TOKEN_EXPIRED")

    except JWTError:

        raise Exception("INVALID_TOKEN")


# -------------------------------------------------------
# Verify Refresh Token
# -------------------------------------------------------

def verify_refresh_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "refresh":

            raise Exception("INVALID_REFRESH_TOKEN")

        return payload

    except ExpiredSignatureError:

        raise Exception("REFRESH_TOKEN_EXPIRED")

    except JWTError:

        raise Exception("INVALID_REFRESH_TOKEN")


# -------------------------------------------------------
# Create Invitation Token
# -------------------------------------------------------

def create_invitation_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=24
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "invitation"
        }
    )

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# -------------------------------------------------------
# Verify Invitation Token
# -------------------------------------------------------

def verify_invitation_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "invitation":

            return None

        return payload

    except JWTError:

        return None