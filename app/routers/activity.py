from datetime import datetime, timedelta

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import (
    ActivityLog,
    TabSwitchLog,
    UserStatus,
    UserStatusLog,
    User,
)
from app.schemas import (
    ActivityStart,
    ActivityEnd,
    TabSwitch,
    UserStatusUpdate
)
from app.dependencies import get_current_user
from app.analytics_service import get_website_information
from app.services.notification_rules import notification_rules


# Identical tab switches closer together than this are one switch.
DUPLICATE_SWITCH_SECONDS = 1


router = APIRouter(

    prefix="/activity",

    tags=["Activity"]

)


# -----------------------------------------------------
# Database Dependency
# -----------------------------------------------------

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# -----------------------------------------------------
# Start Activity
# -----------------------------------------------------

@router.post("/start")
def start_activity(

    activity: ActivityStart,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    website = get_website_information(

        db,

        activity.url

    )

    new_activity = ActivityLog(

        user_id=current_user.id,

        url=activity.url,

        tab_title=activity.tab_title,

        application=activity.application,

        website_name=website["website_name"],

        category=website["category"],

        productivity=website["productivity"],

        start_time=datetime.now()

    )

    db.add(new_activity)

    db.commit()

    db.refresh(new_activity)

    return {

        "message": "Activity Started",

        "activity_id": new_activity.id

    }


# -----------------------------------------------------
# End Activity
# -----------------------------------------------------

@router.put("/end/{activity_id}")
def end_activity(

    activity_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    current_activity = db.query(ActivityLog).filter(

        ActivityLog.id == activity_id,

        ActivityLog.user_id == current_user.id

    ).first()

    if current_activity is None:

        raise HTTPException(

            status_code=404,

            detail="Activity not found."

        )

    current_activity.end_time = datetime.now()

    duration = (

        current_activity.end_time -

        current_activity.start_time

    ).total_seconds()

    current_activity.duration = int(duration)

    db.commit()

    db.refresh(current_activity)

    notification_rules.evaluate(

        db=db,

        user_id=current_user.id

    )

    return {

        "message": "Activity Updated",

        "duration_seconds": current_activity.duration

    }


# -----------------------------------------------------
# Current Activity
# -----------------------------------------------------

@router.get("/current")
def current_activity(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    activity = db.query(ActivityLog).filter(

        ActivityLog.user_id == current_user.id,

        ActivityLog.end_time == None

    ).first()

    if activity is None:

        return {

            "message": "No Active Session"

        }

    return activity


# -----------------------------------------------------
# Activity History
# -----------------------------------------------------

@router.get("/history")
def activity_history(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    history = db.query(ActivityLog).filter(

        ActivityLog.user_id == current_user.id

    ).order_by(

        ActivityLog.start_time.desc()

    ).all()

    return history


# -----------------------------------------------------
# Save Tab Switch
# -----------------------------------------------------

@router.post("/tab-switch")
def save_tab_switch(

    switch: TabSwitch,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    from_website = switch.from_website.strip()

    to_website = switch.to_website.strip()

    if not from_website or not to_website:

        raise HTTPException(

            status_code=400,

            detail="Both websites are required."

        )

    # The browser often reports the same switch twice within a
    # moment (tab activated + page loaded). Count it once.
    duplicate = db.query(TabSwitchLog).filter(

        TabSwitchLog.user_id == current_user.id,

        TabSwitchLog.from_website == from_website,

        TabSwitchLog.to_website == to_website,

        TabSwitchLog.switch_time >= datetime.now() - timedelta(seconds=DUPLICATE_SWITCH_SECONDS)

    ).first()

    if duplicate:

        return {

            "message": "Tab Switch Already Saved",

            "id": duplicate.id,

            "duplicate": True

        }

    log = TabSwitchLog(

        user_id=current_user.id,

        from_website=from_website,

        to_website=to_website

    )

    db.add(log)

    db.commit()

    db.refresh(log)

    return {

        "message": "Tab Switch Saved",

        "id": log.id,

        "duplicate": False

    }


# -----------------------------------------------------
# Update User Status
# -----------------------------------------------------

@router.post("/status")
def update_user_status(

    status: UserStatusUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    # ----------------------------------------
    # Update Current Status
    # ----------------------------------------

    user_status = db.query(UserStatus).filter(

        UserStatus.user_id == current_user.id

    ).first()

    if user_status is None:

        user_status = UserStatus(

            user_id=current_user.id,

            status=status.status

        )

        db.add(user_status)

    else:

        user_status.status = status.status

    # ----------------------------------------
    # Manage Previous Status Log
    # ----------------------------------------

    previous_log = db.query(UserStatusLog).filter(
        UserStatusLog.user_id == current_user.id,
        UserStatusLog.end_time == None
    ).order_by(
        UserStatusLog.start_time.desc()
    ).first()

    current_time = datetime.now()

    if previous_log:

        # ------------------------------------
        # Same status = heartbeat
        # ------------------------------------

        if previous_log.status == status.status:

            # Keep the same log open.
            # Update its current duration so the
            # session does not depend on a future
            # status change to calculate duration.

            previous_log.duration = int(
                (
                    current_time -
                    previous_log.start_time
                ).total_seconds()
            )

        else:

            # ------------------------------------
            # Status changed
            # ------------------------------------

            previous_log.end_time = current_time

            previous_log.duration = int(
                (
                    current_time -
                    previous_log.start_time
                ).total_seconds()
            )

        

            # Create a new session for the
            # new status.

            new_log = UserStatusLog(
                user_id=current_user.id,
                status=status.status,
                start_time=current_time
            )

            db.add(new_log)

    else:

        # ------------------------------------
        # No previous open log
        # ------------------------------------

        new_log = UserStatusLog(
            user_id=current_user.id,
            status=status.status,
            start_time=current_time
        )

        db.add(new_log)

    db.commit()

    db.refresh(user_status)

    notification_rules.evaluate(

        db=db,

        user_id=current_user.id

    )

    return {

        "message": "Status Updated",

        "status": user_status.status

    }


# -----------------------------------------------------
# Get Current User Status
# -----------------------------------------------------

@router.get("/status")
def get_user_status(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user_status = db.query(UserStatus).filter(
        UserStatus.user_id == current_user.id
    ).first()

    if user_status is None:
        return {
            "status": "IDLE"
        }

    return {
        "status": user_status.status,
        "updated_at": user_status.updated_at
    }

# -----------------------------------------------------
# Get Organization User Status
# -----------------------------------------------------

@router.get("/users/{user_id}/status")
def get_organization_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Only Sub Admin can use this endpoint
    if current_user.role != "SUB_ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only Sub Admin can view organization user status."
        )

    # Find requested user
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Make sure both users belong to the same organization
    if (
        user.organization_id is None
        or user.organization_id != current_user.organization_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only view users from your organization."
        )

    # Get user's current status
    user_status = db.query(UserStatus).filter(
        UserStatus.user_id == user.id
    ).first()

    if user_status is None:
        return {
            "user_id": user.id,
            "full_name": user.full_name,
            "status": "IDLE",
            "updated_at": None
        }

    return {
        "user_id": user.id,
        "full_name": user.full_name,
        "status": user_status.status,
        "updated_at": user_status.updated_at
    }