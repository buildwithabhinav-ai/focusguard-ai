from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal

from app.models import (
    Organization,
    User,
    DeactivationRequest,
)

from app.schemas import (
    OrganizationCreate,
    OrganizationResponse,
    AssignOrganization,
    DeactivationRequestCreate,
    OrganizationUserCreate,
    OrganizationUserResponse,
)

from app.dependencies import get_current_user
from app.security import hash_password

from app.services.notification_service import notification_service


router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"]
)


# -----------------------------------------------------
# Database
# -----------------------------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -----------------------------------------------------
# Create Organization
# -----------------------------------------------------

@router.post(
    "/",
    response_model=OrganizationResponse
)
def create_organization(

    organization: OrganizationCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can create organizations."
        )

    existing = (
        db.query(Organization)
        .filter(
            Organization.organization_name
            == organization.organization_name
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Organization already exists."
        )

    new_organization = Organization(
        organization_name=organization.organization_name
    )

    db.add(new_organization)

    db.commit()

    db.refresh(new_organization)


    # -------------------------------------------------
    # Notification to Super Admin
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=current_user.id,

        title="Organization Created",

        message=(
            f'Organization '
            f'"{new_organization.organization_name}" '
            f'was created successfully.'
        ),

        notification_type="ORGANIZATION_CREATED"

    )


    return new_organization


# -----------------------------------------------------
# View Organizations
# -----------------------------------------------------

@router.get(
    "/",
    response_model=list[OrganizationResponse]
)
def get_organizations(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return (
        db.query(Organization)
        .all()
    )


# -----------------------------------------------------
# Assign Sub Admin to Organization
# -----------------------------------------------------

@router.put("/assign")
def assign_organization(

    request: AssignOrganization,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can assign organizations."
        )

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.role != "SUB_ADMIN":

        raise HTTPException(
            status_code=400,
            detail="Only Sub Admin can be assigned."
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id
            == request.organization_id
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    user.organization_id = request.organization_id

    db.commit()

    db.refresh(user)

    # -------------------------------------------------
    # Notification to Assigned Sub Admin
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=user.id,

        title="Organization Assigned",

        message=(
            f'You have been assigned to the organization '
            f'"{organization.organization_name}".'
        ),

        notification_type="ORGANIZATION_ASSIGNED"

    )

    return {

        "message": "Sub Admin assigned successfully."

    }


# -----------------------------------------------------
# Request Organization Deactivation
# -----------------------------------------------------

@router.post("/deactivation-request")
def request_deactivation(

    request: DeactivationRequestCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUB_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Sub Admin can send requests."
        )

    if current_user.organization_id is None:

        raise HTTPException(
            status_code=400,
            detail="Sub Admin is not assigned to any organization."
        )

    existing = (
        db.query(DeactivationRequest)
        .filter(
            DeactivationRequest.organization_id
            == current_user.organization_id,

            DeactivationRequest.status
            == "PENDING"
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="A pending request already exists."
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id
            == current_user.organization_id
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    new_request = DeactivationRequest(

        organization_id=current_user.organization_id,

        requested_by=current_user.id,

        reason=request.reason

    )

    db.add(new_request)

    db.commit()

    db.refresh(new_request)

    # -------------------------------------------------
    # Notify All Active Super Admins
    # -------------------------------------------------

    super_admins = (
        db.query(User)
        .filter(
            User.role == "SUPER_ADMIN",
            User.is_active == True
        )
        .all()
    )

    for admin in super_admins:

        notification_service.create_notification(

            db=db,

            user_id=admin.id,

            title="Organization Deactivation Request",

            message=(
                f'Sub Admin {current_user.full_name} '
                f'has requested deactivation of '
                f'"{organization.organization_name}".'
            ),

            notification_type="DEACTIVATION_REQUEST"

        )

    return {

        "message": "Request submitted successfully.",

        "request_id": new_request.id

    }


# -----------------------------------------------------
# View Pending Requests
# -----------------------------------------------------

@router.get("/deactivation-requests")
def get_deactivation_requests(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can view requests."
        )

    requests = (
        db.query(DeactivationRequest)
        .order_by(
            DeactivationRequest.requested_at.desc()
        )
        .all()
    )

    return requests


# -----------------------------------------------------
# Approve Deactivation Request
# -----------------------------------------------------

@router.put(
    "/deactivation-request/{request_id}/approve"
)
def approve_request(

    request_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can approve requests."
        )

    request = (
        db.query(DeactivationRequest)
        .filter(
            DeactivationRequest.id
            == request_id
        )
        .first()
    )

    if request is None:

        raise HTTPException(
            status_code=404,
            detail="Request not found."
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id
            == request.organization_id
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    request.status = "APPROVED"

    request.reviewed_by = current_user.id

    request.reviewed_at = datetime.now()

    organization.is_active = False

    db.commit()

    # -------------------------------------------------
    # Notify Requesting Sub Admin
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=request.requested_by,

        title="Deactivation Request Approved",

        message=(
            f'Your request to deactivate '
            f'"{organization.organization_name}" '
            f'has been approved.'
        ),

        notification_type="DEACTIVATION_APPROVED"

    )

    return {

        "message": "Request approved successfully.",

        "organization_status": "Inactive"

    }


# -----------------------------------------------------
# Reject Deactivation Request
# -----------------------------------------------------

@router.put(
    "/deactivation-request/{request_id}/reject"
)
def reject_request(

    request_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can reject requests."
        )

    request = (
        db.query(DeactivationRequest)
        .filter(
            DeactivationRequest.id
            == request_id
        )
        .first()
    )

    if request is None:

        raise HTTPException(
            status_code=404,
            detail="Request not found."
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id
            == request.organization_id
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    request.status = "REJECTED"

    request.reviewed_by = current_user.id

    request.reviewed_at = datetime.now()

    db.commit()

    # -------------------------------------------------
    # Notify Requesting Sub Admin
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=request.requested_by,

        title="Deactivation Request Rejected",

        message=(
            f'Your request to deactivate '
            f'"{organization.organization_name}" '
            f'has been rejected.'
        ),

        notification_type="DEACTIVATION_REJECTED"

    )

    return {

        "message": "Request rejected successfully."

    }


# -----------------------------------------------------
# Deactivate Organization User
# -----------------------------------------------------

@router.put("/users/{user_id}/deactivate")
def deactivate_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUB_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Sub Admin can deactivate users."
        )

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.role == "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Cannot deactivate Super Admin."
        )

    if user.role == "SUB_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Cannot deactivate another Sub Admin."
        )

    if user.organization_id != current_user.organization_id:

        raise HTTPException(
            status_code=403,
            detail="User belongs to another organization."
        )

    user.is_active = False

    db.commit()

    db.refresh(user)


    # -------------------------------------------------
    # Notification to Deactivated User
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=user.id,

        title="Account Deactivated",

        message=(
            "Your FocusGuard account has been "
            f"deactivated by Sub Admin "
            f"{current_user.full_name}."
        ),

        notification_type="USER_DEACTIVATED"

    )


    return {

        "message": "User deactivated successfully."

    }


# -----------------------------------------------------
# Reactivate Organization
# -----------------------------------------------------

@router.put("/{organization_id}/activate")
def activate_organization(

    organization_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can activate organizations."
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.id == organization_id
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    organization.is_active = True

    db.commit()

    db.refresh(organization)


    # -------------------------------------------------
    # Notify Sub Admins of Activated Organization
    # -------------------------------------------------

    sub_admins = (
        db.query(User)
        .filter(
            User.organization_id == organization.id,
            User.role == "SUB_ADMIN",
            User.is_active == True
        )
        .all()
    )


    for admin in sub_admins:

        notification_service.create_notification(

            db=db,

            user_id=admin.id,

            title="Organization Activated",

            message=(
                f'Organization '
                f'"{organization.organization_name}" '
                f'has been activated by Super Admin.'
            ),

            notification_type="ORGANIZATION_ACTIVATED"

        )


    return {

        "message": "Organization activated successfully."

    }


# -----------------------------------------------------
# Create Organization User
# -----------------------------------------------------

@router.post("/users")
def create_organization_user(

    user: OrganizationUserCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    # Only Sub Admin can create users

    if current_user.role != "SUB_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Sub Admin can create users."
        )

    # Sub Admin must belong to an organization

    if current_user.organization_id is None:

        raise HTTPException(
            status_code=400,
            detail="Sub Admin is not assigned to any organization."
        )

    # Check email already exists

    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Create user

    new_user = User(

        full_name=user.full_name,

        email=user.email,

        hashed_password=hash_password(
            user.password
        ),

        age=user.age,

        occupation=user.occupation,

        role="USER",

        organization_id=current_user.organization_id,

        is_active=True

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    # -------------------------------------------------
    # Notification to Newly Created User
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=new_user.id,

        title="Welcome to FocusGuard",

        message=(
            f'Your FocusGuard account has been created '
            f'by Sub Admin {current_user.full_name}. '
            f'You can now log in and start using the platform.'
        ),

        notification_type="USER_CREATED"

    )


    return {

        "message": "User created successfully.",

        "user_id": new_user.id,

        "organization_id":
            new_user.organization_id

    }


# -----------------------------------------------------
# View Organization Users
# -----------------------------------------------------

@router.get(
    "/users",
    response_model=list[OrganizationUserResponse]
)
def get_organization_users(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    # Only Sub Admin can view users

    if current_user.role != "SUB_ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Only Sub Admin can view organization users."
        )

    # Must belong to an organization

    if current_user.organization_id is None:

        raise HTTPException(
            status_code=400,
            detail="Sub Admin is not assigned to any organization."
        )

    users = (
        db.query(User)
        .filter(
            User.organization_id
            == current_user.organization_id,

            User.role == "USER"
        )
        .order_by(
            User.created_at.desc()
        )
        .all()
    )

    return users