from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, Organization

from app.schemas import (
    ChangeRole,
    InviteSubAdmin,
    AcceptInvitation
)

from app.role_checker import require_super_admin

from app.security import (
    create_invitation_token,
    verify_invitation_token,
    hash_password
)

from app.config import FRONTEND_URL
from app.email_service import send_invitation_email, send_welcome_email
from app.services.notification_service import notification_service


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# -------------------------------------------------
# Database Dependency
# -------------------------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -------------------------------------------------
# Admin Dashboard
# -------------------------------------------------

@router.get("/dashboard")
def admin_dashboard(

    current_user=Depends(require_super_admin)

):

    return {

        "message": "Welcome Super Admin",

        "email": current_user.email,

        "role": current_user.role

    }


# -------------------------------------------------
# View All Users
# -------------------------------------------------

@router.get("/all-users")
def get_all_users(

    db: Session = Depends(get_db),

    current_user=Depends(require_super_admin)

):

    users = db.query(User).all()

    return users


# -------------------------------------------------
# Change User Role
# -------------------------------------------------

@router.put("/change-role/{user_id}")
def change_role(

    user_id: int,

    role_data: ChangeRole,

    db: Session = Depends(get_db),

    current_user=Depends(require_super_admin)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    user.role = role_data.role

    db.commit()

    db.refresh(user)

    return {

        "message": "Role Updated Successfully.",

        "new_role": user.role

    }


# -------------------------------------------------
# Delete User
# -------------------------------------------------

@router.delete("/delete-user/{user_id}")
def delete_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(require_super_admin)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    db.delete(user)

    db.commit()

    return {

        "message": "User Deleted Successfully."

    }


# -------------------------------------------------
# Statistics
# -------------------------------------------------

@router.get("/statistics")
def statistics(

    db: Session = Depends(get_db),

    current_user=Depends(require_super_admin)

):

    total_users = db.query(User).count()

    total_admins = db.query(User).filter(
        User.role == "SUPER_ADMIN"
    ).count()

    total_subadmins = db.query(User).filter(
        User.role == "SUB_ADMIN"
    ).count()

    total_users_only = db.query(User).filter(
        User.role == "USER"
    ).count()

    return {

        "Total Users": total_users,

        "Super Admins": total_admins,

        "Sub Admins": total_subadmins,

        "Users": total_users_only

    }


# -------------------------------------------------
# Invite Sub Admin
# -------------------------------------------------

@router.post("/invite-sub-admin")
def invite_sub_admin(

    invitation: InviteSubAdmin,

    db: Session = Depends(get_db),

    current_user=Depends(require_super_admin)

):

    # -------------------------------------------------
    # Validate organization
    # -------------------------------------------------

    organization = db.query(Organization).filter(
        Organization.id == invitation.organization_id
    ).first()

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail="Organization not found."
        )

    if not organization.is_active:

        raise HTTPException(
            status_code=400,
            detail="Cannot invite a Sub Admin to an inactive organization."
        )


    # -------------------------------------------------
    # Check whether email already exists
    # -------------------------------------------------

    existing_user = db.query(User).filter(
        User.email == invitation.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )


    # -------------------------------------------------
    # Generate Invitation Token
    # -------------------------------------------------

    token = create_invitation_token(

        {

            "email": invitation.email,

            "name": invitation.full_name,

            "role": "SUB_ADMIN",

            "organization_id": invitation.organization_id

        }

    )


    # -------------------------------------------------
    # Frontend Invitation Link
    # -------------------------------------------------

    invitation_link = (
        f"{FRONTEND_URL}/#/accept-invitation?token={token}"
    )


    # -------------------------------------------------
    # Send Invitation Email
    # -------------------------------------------------

    success, email_error = send_invitation_email(

        invitation.email,

        invitation.full_name,

        invitation_link,

        organization.organization_name

    )


    # -------------------------------------------------
    # Tell the Super Admin what happened
    # -------------------------------------------------

    if success:

        notification_service.create_notification(

            db=db,

            user_id=current_user.id,

            title="Invitation Sent",

            message=(
                f'An invitation e-mail was sent to '
                f'{invitation.email} to join '
                f'"{organization.organization_name}" as Sub Admin.'
            ),

            notification_type="INVITATION_SENT"

        )

        return {

            "message": "Invitation Email Sent Successfully.",

            "email_sent": True

        }

    notification_service.create_notification(

        db=db,

        user_id=current_user.id,

        title="Invitation Not Delivered",

        message=(
            f'The invitation e-mail to {invitation.email} '
            f'("{organization.organization_name}") could not be sent: '
            f'{email_error} Share the invitation link manually.'
        ),

        notification_type="INVITATION_FAILED"

    )

    # The Super Admin who created the invitation receives the
    # link so it can be shared manually when e-mail is unavailable.
    return {

        "message": (
            "Invitation created, but the e-mail could not be sent. "
            "Copy the link below and send it to "
            f"{invitation.email} yourself."
        ),

        "email_sent": False,

        "email_error": email_error,

        "invitation_link": invitation_link

    }


# -------------------------------------------------
# Accept Invitation
# -------------------------------------------------

@router.post("/accept-invitation")
def accept_invitation(

    token: str,

    data: AcceptInvitation,

    background_tasks: BackgroundTasks,

    db: Session = Depends(get_db)

):

    # -------------------------------------------------
    # Verify Invitation Token
    # -------------------------------------------------

    payload = verify_invitation_token(token)

    if payload is None:

        raise HTTPException(

            status_code=400,

            detail="Invalid or Expired Invitation."

        )


    # -------------------------------------------------
    # Validate required invitation data
    # -------------------------------------------------

    email = payload.get("email")

    full_name = payload.get("name")

    role = payload.get("role")

    organization_id = payload.get("organization_id")


    if not email or not full_name:

        raise HTTPException(

            status_code=400,

            detail="Invalid invitation data."

        )


    if role != "SUB_ADMIN":

        raise HTTPException(

            status_code=400,

            detail="Invalid invitation role."

        )


    if organization_id is None:

        raise HTTPException(

            status_code=400,

            detail="Invitation is not associated with an organization."

        )


    # -------------------------------------------------
    # Verify Organization
    # -------------------------------------------------

    organization = db.query(Organization).filter(
        Organization.id == organization_id
    ).first()

    if organization is None:

        raise HTTPException(

            status_code=404,

            detail="Organization not found."

        )


    if not organization.is_active:

        raise HTTPException(

            status_code=400,

            detail="This organization is no longer active."

        )


    # -------------------------------------------------
    # Check whether user already exists
    # -------------------------------------------------

    existing_user = db.query(User).filter(

        User.email == email

    ).first()

    if existing_user:

        raise HTTPException(

            status_code=400,

            detail="User already exists."

        )


    # -------------------------------------------------
    # Create Sub Admin
    # -------------------------------------------------

    new_user = User(

        full_name=full_name,

        email=email,

        hashed_password=hash_password(
            data.password
        ),

        role="SUB_ADMIN",

        organization_id=organization_id,

        is_active=True

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    # -------------------------------------------------
    # Notifications and welcome e-mail
    # -------------------------------------------------

    notification_service.create_notification(

        db=db,

        user_id=new_user.id,

        title="Welcome to FocusGuard",

        message=(
            f'Your Sub Admin account for '
            f'"{organization.organization_name}" is ready. '
            f'You can now create users for your organization.'
        ),

        notification_type="SUB_ADMIN_WELCOME"

    )

    super_admins = db.query(User).filter(
        User.role == "SUPER_ADMIN",
        User.is_active == True
    ).all()

    for super_admin in super_admins:

        notification_service.create_notification(

            db=db,

            user_id=super_admin.id,

            title="Invitation Accepted",

            message=(
                f'{new_user.full_name} ({new_user.email}) accepted the '
                f'invitation and joined '
                f'"{organization.organization_name}" as Sub Admin.'
            ),

            notification_type="INVITATION_ACCEPTED"

        )

    # Best effort and off the request path: a slow or failed welcome
    # e-mail must neither delay nor undo the sign-up.
    background_tasks.add_task(

        send_welcome_email,

        new_user.email,

        new_user.full_name,

        organization.organization_name,

        f"{FRONTEND_URL}/#/login"

    )


    # -------------------------------------------------
    # Success
    # -------------------------------------------------

    return {

        "message": "Invitation Accepted Successfully.",

        "role": new_user.role,

        "organization_id": new_user.organization_id,

        "organization_name": organization.organization_name

    }