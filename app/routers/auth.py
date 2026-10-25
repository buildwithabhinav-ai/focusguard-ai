from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, Organization

from app.schemas import (
    UserRegister,
    UserLogin,
    Token,
    Message,
    RefreshTokenRequest,
    ChangePassword,
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)

from app.config import SUPPORT_EMAIL
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ---------------------------------------------------
# Database Dependency
# ---------------------------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ---------------------------------------------------
# Register
# ---------------------------------------------------

@router.post(
    "/register",
    response_model=Message
)
def register_user(

    user: UserRegister,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    user_count = db.query(User).count()

    # Only allow registration if no users exist
    if user_count > 0:

        raise HTTPException(
            status_code=403,
            detail=(
                "Public registration is disabled. "
                "Contact your administrator."
            )
        )

    new_user = User(

        full_name=user.full_name,

        email=user.email,

        hashed_password=hash_password(
            user.password
        ),

        age=user.age,

        occupation=user.occupation,

        role="SUPER_ADMIN"

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Super Admin registered successfully."
    }


# ---------------------------------------------------
# Public User Registration
# ---------------------------------------------------

@router.post(
    "/register-user",
    response_model=Message
)
def register_public_user(

    user: UserRegister,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    new_user = User(

        full_name=user.full_name,

        email=user.email,

        hashed_password=hash_password(
            user.password
        ),

        age=user.age,

        occupation=user.occupation,

        # IMPORTANT:
        # Public registration can ONLY create USER.
        role="USER",

        # Public users are not automatically
        # assigned to an organization.
        organization_id=None,

        is_active=True

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Account created successfully. You can now log in."
    }


# ---------------------------------------------------
# Login
# ---------------------------------------------------

@router.post(
    "/login",
    response_model=Token
)
def login_user(

    user: UserLogin,

    db: Session = Depends(get_db)

):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if db_user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    # ---------------------------------------------------
    # Check Organization Status
    # ---------------------------------------------------

    if db_user.organization_id is not None:

        organization = db.query(
            Organization
        ).filter(
            Organization.id == db_user.organization_id
        ).first()

        if organization is None:

            raise HTTPException(
                status_code=404,
                detail="Organization not found."
            )

        if organization.is_active is False:

            raise HTTPException(
                status_code=403,
                detail=(
                    "Your organization has been deactivated. "
                    "Please contact the Super Admin or write to "
                    f"{SUPPORT_EMAIL}."
                )
            )

    # ---------------------------------------------------
    # Check User Status
    # ---------------------------------------------------

    if not db_user.is_active:

        raise HTTPException(
            status_code=403,
            detail=(
                "Your account has been deactivated. "
                "Please contact your administrator or write to "
                f"{SUPPORT_EMAIL}."
            )
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    refresh_token = create_refresh_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer"
    }


# ---------------------------------------------------
# Change Password
# ---------------------------------------------------

@router.patch(
    "/change-password",
    response_model=Message
)
def change_password(

    request: ChangePassword,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    # ---------------------------------------------------
    # Verify Current Password
    # ---------------------------------------------------

    if not verify_password(
        request.current_password,
        current_user.hashed_password
    ):

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect."
        )

    # ---------------------------------------------------
    # Check New Password Confirmation
    # ---------------------------------------------------

    if request.new_password != request.confirm_password:

        raise HTTPException(
            status_code=400,
            detail="New passwords do not match."
        )

    # ---------------------------------------------------
    # Password Length Validation
    # ---------------------------------------------------

    if len(request.new_password) < 8:

        raise HTTPException(
            status_code=400,
            detail=(
                "New password must be at least "
                "8 characters long."
            )
        )

    # ---------------------------------------------------
    # Prevent Reusing Current Password
    # ---------------------------------------------------

    if verify_password(
        request.new_password,
        current_user.hashed_password
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "New password must be different "
                "from the current password."
            )
        )

    # ---------------------------------------------------
    # Generate New Password Hash
    # ---------------------------------------------------

    new_password_hash = hash_password(
        request.new_password
    )

    # ---------------------------------------------------
    # IMPORTANT:
    # get_current_user() uses its own database session.
    #
    # Therefore current_user belongs to a different
    # SQLAlchemy session than `db`.
    #
    # We must fetch the user again using THIS session
    # before modifying and committing it.
    # ---------------------------------------------------

    db_user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if db_user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # ---------------------------------------------------
    # Update Password
    # ---------------------------------------------------

    db_user.hashed_password = new_password_hash

    db.commit()

    db.refresh(db_user)

    return {
        "message": "Password updated successfully."
    }


# ---------------------------------------------------
# Refresh Token
# ---------------------------------------------------

@router.post("/refresh-token")
def refresh_access_token(

    request: RefreshTokenRequest

):

    try:

        payload = verify_refresh_token(
            request.refresh_token
        )

    except Exception as e:

        if str(e) == "REFRESH_TOKEN_EXPIRED":

            raise HTTPException(
                status_code=401,
                detail=(
                    "Refresh token expired. "
                    "Please login again."
                )
            )

        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token."
        )

    access_token = create_access_token(
        {
            "sub": payload["sub"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "Bearer"
    }


# ---------------------------------------------------
# Logout
# ---------------------------------------------------

@router.post(
    "/logout",
    response_model=Message
)
def logout():

    return {
        "message": (
            "Logout successful. "
            "Remove JWT from client."
        )
    }