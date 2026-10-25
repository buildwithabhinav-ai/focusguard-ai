from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fastapi import HTTPException

from datetime import datetime
from datetime import timedelta

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models import (
    ActivityLog,
    TabSwitchLog,
    User,
    UserStatusLog,
)
from app.dependencies import get_current_user
from app.services.analytics_service import format_duration

from collections import defaultdict


router = APIRouter(

    prefix="/analytics",

    tags=["Analytics"]

)


# --------------------------------------------
# Database Dependency
# --------------------------------------------

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# --------------------------------------------
# Individual User Access Check
#
# Super Admin can view any user.
# Sub Admin can view users in their organization.
# --------------------------------------------

def verify_user_access(
    db: Session,
    current_user,
    user_id: int
):

    if current_user.role not in (
        "SUPER_ADMIN",
        "SUB_ADMIN"
    ):

        raise HTTPException(

            status_code=403,

            detail="Only admins can view other users' analytics."

        )

    target_user = (

        db.query(User)

        .filter(
            User.id == user_id
        )

        .first()

    )

    if target_user is None:

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )

    if (

        current_user.role == "SUB_ADMIN"

        and (
            target_user.organization_id is None
            or target_user.organization_id
            != current_user.organization_id
        )

    ):

        raise HTTPException(

            status_code=403,

            detail="You can only view users from your organization."

        )

    return target_user


# --------------------------------------------
# Dashboard Summary
# --------------------------------------------

@router.get("/summary")
def analytics_summary(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    browser_time = db.query(

        func.sum(ActivityLog.duration)

    ).filter(

        ActivityLog.user_id == current_user.id

    ).scalar()

    if browser_time is None:

        browser_time = 0

    productive_time = db.query(

        func.sum(ActivityLog.duration)

    ).filter(

        ActivityLog.user_id == current_user.id,

        ActivityLog.productivity == "Productive"

    ).scalar()

    if productive_time is None:

        productive_time = 0

    non_productive_time = db.query(

        func.sum(ActivityLog.duration)

    ).filter(

        ActivityLog.user_id == current_user.id,

        ActivityLog.productivity == "Non Productive"

    ).scalar()

    if non_productive_time is None:

        non_productive_time = 0

    # Counted from the recorded tab switches. (This used to count
    # activity rows minus one, which disagreed with every other
    # screen that shows tab switches.)
    tab_switches = db.query(

        TabSwitchLog

    ).filter(

        TabSwitchLog.user_id == current_user.id

    ).count()

    active_session = db.query(

        ActivityLog

    ).filter(

        ActivityLog.user_id == current_user.id,

        ActivityLog.end_time == None

    ).count()

    return {

        "browser_time_seconds": browser_time,

        "productive_time_seconds": productive_time,

        "non_productive_time_seconds": non_productive_time,

        "tab_switches": tab_switches,

        "active_sessions": active_session

    }


# Category Analytics
@router.get("/categories")
def category_analytics(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    categories = (

        db.query(

            ActivityLog.category,

            func.sum(ActivityLog.duration)

        )

        .filter(

            ActivityLog.user_id == current_user.id

        )

        .group_by(

            ActivityLog.category

        )

        .all()

    )

    result = []

    for category, duration in categories:

        result.append(

            {

                "category": category,

                "duration_seconds": duration

            }

        )

    return result


# Website Analytics
@router.get("/websites")
def website_analytics(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    websites = (

        db.query(

            ActivityLog.website_name,

            func.sum(ActivityLog.duration)

        )

        .filter(

            ActivityLog.user_id == current_user.id

        )

        .group_by(

            ActivityLog.website_name

        )

        .order_by(

            func.sum(ActivityLog.duration).desc()

        )

        .all()

    )

    result = []

    for website, duration in websites:

        result.append(

            {

                "website": website,

                "duration_seconds": duration

            }

        )

    return result

# --------------------------------------------
# Tab Switch Analytics
# --------------------------------------------


@router.get("/tab-switches")
def tab_switch_analytics(
    date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(TabSwitchLog).filter(
        TabSwitchLog.user_id == current_user.id
    )

    if date:
        try:
            selected_date = datetime.strptime(
                date, "%Y-%m-%d"
            ).date()
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

        query = query.filter(
            func.date(TabSwitchLog.switch_time) == selected_date
        )

    total_switches = query.count()

    latest_switches = (
        query
        .order_by(TabSwitchLog.switch_time.desc())
        .limit(10)
        .all()
    )

    history = []

    for switch in latest_switches:
        history.append({
            "from": switch.from_website,
            "to": switch.to_website,
            "time": switch.switch_time
        })

    return {
        "total_switches": total_switches,
        "recent_switches": history
    }


# -----------------------------------------------------
# Role-Based Tab Switch Analytics
# -----------------------------------------------------

@router.get("/role/tab-switches")
def role_tab_switch_analytics(
    date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # ---------------------------------------------
    # Get organization USER IDs
    # ---------------------------------------------

    if current_user.role == "SUB_ADMIN":

        if current_user.organization_id is None:
            raise HTTPException(
                status_code=400,
                detail="Sub Admin is not assigned to any organization."
            )

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(
                    User.organization_id == current_user.organization_id,
                    User.role == "USER"
                )
                .all()
            )
        ]

    elif current_user.role == "SUPER_ADMIN":

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(User.role == "USER")
                .all()
            )
        ]

    else:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access role-based tab analytics."
        )

    query = db.query(TabSwitchLog).filter(
        TabSwitchLog.user_id.in_(user_ids)
    )

    if date:
        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

        query = query.filter(
            func.date(TabSwitchLog.switch_time) == selected_date
        )

    total_switches = query.count()

    latest_switches = (
        query
        .order_by(TabSwitchLog.switch_time.desc())
        .limit(10)
        .all()
    )

    history = []

    for switch in latest_switches:
        history.append({
            "from": switch.from_website,
            "to": switch.to_website,
            "time": switch.switch_time
        })

    return {
        "total_switches": total_switches,
        "recent_switches": history
    }


# --------------------------------------------
# Activity Summary
# --------------------------------------------

from app.models import UserStatusLog


@router.get("/activity-summary")
def activity_summary(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    active_time = db.query(

        func.sum(UserStatusLog.duration)

    ).filter(

        UserStatusLog.user_id == current_user.id,

        UserStatusLog.status == "ACTIVE"

    ).scalar()

    idle_time = db.query(

        func.sum(UserStatusLog.duration)

    ).filter(

        UserStatusLog.user_id == current_user.id,

        UserStatusLog.status == "IDLE"

    ).scalar()

    browser_time = db.query(

        func.sum(ActivityLog.duration)

    ).filter(

        ActivityLog.user_id == current_user.id

    ).scalar()

    active_time = active_time or 0
    idle_time = idle_time or 0
    browser_time = browser_time or 0

    focus_score = 0

    if browser_time > 0:

        focus_score = round(

            (active_time / browser_time) * 100,

            2

        )

    return {

        "browser_time_seconds": browser_time,

        "active_time_seconds": active_time,

        "idle_time_seconds": idle_time,

        "focus_score": focus_score

    }

# --------------------------------------------
# Dashboard Analytics (Today's Data)
# --------------------------------------------

@router.get("/dashboard")
def dashboard(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today = datetime.now().date()

    # Today's Activities
    activities = (

        db.query(ActivityLog)

        .filter(

            ActivityLog.user_id == current_user.id,

            func.date(ActivityLog.start_time) == today

        )

        .all()

    )

    browser_time = 0

    productive_time = 0

    non_productive_time = 0

    website_summary = {}

    category_summary = {}

    for activity in activities:

        duration = activity.duration or 0

        browser_time += duration

        if activity.productivity == "Productive":

            productive_time += duration

        elif activity.productivity == "Non Productive":

            non_productive_time += duration

        category = activity.category or "Other"

        category_summary[category] = (

            category_summary.get(category, 0)

            + duration

        )

        website = activity.website_name or "Unknown"

        if website not in website_summary:

            website_summary[website] = {

                "url": activity.url,

                "time_spent": 0,

                "visits": 0

            }

        website_summary[website]["time_spent"] += duration

        website_summary[website]["visits"] += 1

    # Today's Active Time
    active_time = (

        db.query(

            func.sum(UserStatusLog.duration)

        )

        .filter(

            UserStatusLog.user_id == current_user.id,

            UserStatusLog.status == "ACTIVE",

            func.date(UserStatusLog.start_time) == today

        )

        .scalar()

    ) or 0

    # Today's Idle Time
    idle_time = (

        db.query(

            func.sum(UserStatusLog.duration)

        )

        .filter(

            UserStatusLog.user_id == current_user.id,

            UserStatusLog.status == "IDLE",

            func.date(UserStatusLog.start_time) == today

        )

        .scalar()

    ) or 0

    # Today's Tab Switches
    total_tab_switches = (

        db.query(TabSwitchLog)

        .filter(

            TabSwitchLog.user_id == current_user.id,

            func.date(TabSwitchLog.switch_time) == today

        )

        .count()

    )

    # Focus Score
    focus_score = 0

    if browser_time > 0:

        focus_score = round(

            (active_time / browser_time) * 100,

            2

        )

    return {

        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role
        },

        "date": today,

        "productive_time": productive_time,

        "non_productive_time": non_productive_time,

        "browser_time": browser_time,

        "active_time": active_time,

        "idle_time": idle_time,

        "focus_score": focus_score,

        "total_website_visited": len(website_summary),

        "total_tab_switches": total_tab_switches,

        "category_summary": category_summary,

        "website_summary": website_summary

    }


# -----------------------------------------------------
# Weekly / Monthly Activity Report
# -----------------------------------------------------

@router.get("/report")
def activity_report(

    type: str = Query(...),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today = datetime.now()

    if type.lower() == "weekly":

        start_date = today - timedelta(days=7)

    elif type.lower() == "monthly":

        start_date = today - timedelta(days=30)

    else:

        raise HTTPException(

            status_code=400,

            detail="Type must be weekly or monthly."

        )

    logs = db.query(

        UserStatusLog

    ).filter(

        UserStatusLog.user_id == current_user.id,

        UserStatusLog.start_time >= start_date

    ).all()

    active_time = 0
    idle_time = 0

    daily_breakdown = defaultdict(

        lambda: {

            "active_time": 0,

            "idle_time": 0

        }

    )

    weekly_breakdown = defaultdict(

        lambda: {

            "active_time": 0,

            "idle_time": 0

        }

    )

    for log in logs:

        duration = log.duration or 0

        # Total Time
        if log.status == "ACTIVE":

            active_time += duration

        elif log.status == "IDLE":

            idle_time += duration

        # Weekly Report (Day-wise)
        if type.lower() == "weekly":

            day = log.start_time.strftime("%A")

            if log.status == "ACTIVE":

                daily_breakdown[day]["active_time"] += duration

            else:

                daily_breakdown[day]["idle_time"] += duration

        # Monthly Report (Week-wise)
        else:

            week_number = ((log.start_time.day - 1) // 7) + 1

            week = f"Week {week_number}"

            if log.status == "ACTIVE":

                weekly_breakdown[week]["active_time"] += duration

            else:

                weekly_breakdown[week]["idle_time"] += duration

    total_time = active_time + idle_time

    focus_score = 0

    if total_time > 0:

        focus_score = round(

            (active_time / total_time) * 100,

            2

        )

    if type.lower() == "weekly":

        breakdown = []

        for day, value in daily_breakdown.items():

            breakdown.append({

    "day": day,

    "active_time_seconds": value["active_time"],
    "active_time": format_duration(value["active_time"]),

    "idle_time_seconds": value["idle_time"],
    "idle_time": format_duration(value["idle_time"])

})

        return {

    "report_type": "weekly",

    "start_date": start_date,

    "end_date": today,

    "active_time_seconds": active_time,
    "active_time": format_duration(active_time),

    "idle_time_seconds": idle_time,
    "idle_time": format_duration(idle_time),

    "total_time_seconds": total_time,
    "total_time": format_duration(total_time),

    "focus_score": focus_score,

    "daily_breakdown": breakdown

}

    else:

        breakdown = []

        for week, value in weekly_breakdown.items():

            breakdown.append({

    "week": week,

    "active_time_seconds": value["active_time"],
    "active_time": format_duration(value["active_time"]),

    "idle_time_seconds": value["idle_time"],
    "idle_time": format_duration(value["idle_time"])

})

        return {

    "report_type": "monthly",

    "start_date": start_date,

    "end_date": today,

    "active_time_seconds": active_time,
    "active_time": format_duration(active_time),

    "idle_time_seconds": idle_time,
    "idle_time": format_duration(idle_time),

    "total_time_seconds": total_time,
    "total_time": format_duration(total_time),

    "focus_score": focus_score,

    "weekly_breakdown": breakdown

}


# -----------------------------------------------------
# Role-Based Category Analytics
# -----------------------------------------------------

@router.get("/role/categories")
def role_category_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # ---------------------------------------------
    # Sub Admin → Organization users' data
    # ---------------------------------------------

    if current_user.role == "SUB_ADMIN":

        if current_user.organization_id is None:
            raise HTTPException(
                status_code=400,
                detail="Sub Admin is not assigned to any organization."
            )

        categories = (
            db.query(
                ActivityLog.category,
                func.sum(ActivityLog.duration)
            )
            .join(
                User,
                ActivityLog.user_id == User.id
            )
            .filter(
                User.organization_id == current_user.organization_id,
                User.role == "USER"
            )
            .group_by(
                ActivityLog.category
            )
            .all()
        )

    # ---------------------------------------------
    # Super Admin → All organization users' data
    # ---------------------------------------------

    elif current_user.role == "SUPER_ADMIN":

        categories = (
            db.query(
                ActivityLog.category,
                func.sum(ActivityLog.duration)
            )
            .join(
                User,
                ActivityLog.user_id == User.id
            )
            .filter(
                User.role == "USER"
            )
            .group_by(
                ActivityLog.category
            )
            .all()
        )

    else:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access role-based analytics."
        )

    result = []

    for category, duration in categories:

        result.append({
            "category": category or "Other",
            "duration_seconds": duration or 0
        })

    return result


# -----------------------------------------------------
# Role-Based Website Analytics
# -----------------------------------------------------

@router.get("/role/websites")
def role_website_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # ---------------------------------------------
    # Today's date
    # ---------------------------------------------

    today = datetime.now().date()

    # ---------------------------------------------
    # Sub Admin → Organization users' data
    # ---------------------------------------------

    if current_user.role == "SUB_ADMIN":

        if current_user.organization_id is None:
            raise HTTPException(
                status_code=400,
                detail="Sub Admin is not assigned to any organization."
            )

        websites = (
            db.query(
                ActivityLog.website_name,
                func.sum(ActivityLog.duration)
            )
            .join(
                User,
                ActivityLog.user_id == User.id
            )
            .filter(
                User.organization_id == current_user.organization_id,
                User.role == "USER",
                func.date(ActivityLog.start_time) == today
            )
            .group_by(
                ActivityLog.website_name
            )
            .order_by(
                func.sum(ActivityLog.duration).desc()
            )
            .all()
        )

    # ---------------------------------------------
    # Super Admin → All organization users' data
    # ---------------------------------------------

    elif current_user.role == "SUPER_ADMIN":

        websites = (
            db.query(
                ActivityLog.website_name,
                func.sum(ActivityLog.duration)
            )
            .join(
                User,
                ActivityLog.user_id == User.id
            )
            .filter(
                User.role == "USER",
                func.date(ActivityLog.start_time) == today
            )
            .group_by(
                ActivityLog.website_name
            )
            .order_by(
                func.sum(ActivityLog.duration).desc()
            )
            .all()
        )

    else:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access role-based analytics."
        )

    result = []

    for website, duration in websites:

        result.append({
            "website": website or "Unknown",
            "duration_seconds": int(duration or 0)
        })

    return result


@router.get("/role/activity-summary")
def role_activity_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # -------------------------------------------------
    # Get organization USER IDs
    # -------------------------------------------------

    if current_user.role == "SUB_ADMIN":

        if current_user.organization_id is None:
            raise HTTPException(
                status_code=400,
                detail="Sub Admin is not assigned to any organization."
            )

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(
                    User.organization_id == current_user.organization_id,
                    User.role == "USER"
                )
                .all()
            )
        ]

    elif current_user.role == "SUPER_ADMIN":

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(
                    User.role == "USER"
                )
                .all()
            )
        ]

    else:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access role-based analytics."
        )

    # -------------------------------------------------
    # Today's date
    # -------------------------------------------------

    today = datetime.now().date()

    # -------------------------------------------------
    # Browser / Activity Time - TODAY
    # -------------------------------------------------

    browser_result = (
        db.query(
            func.coalesce(
                func.sum(ActivityLog.duration),
                0
            )
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            func.date(ActivityLog.start_time) == today
        )
        .scalar()
    )

    browser_time = int(
        browser_result or 0
    )

    # -------------------------------------------------
    # Completed ACTIVE / IDLE durations - TODAY
    # -------------------------------------------------

    active_result = (
        db.query(
            func.coalesce(
                func.sum(UserStatusLog.duration),
                0
            )
        )
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.status == "ACTIVE",
            func.date(UserStatusLog.start_time) == today
        )
        .scalar()
    )

    idle_result = (
        db.query(
            func.coalesce(
                func.sum(UserStatusLog.duration),
                0
            )
        )
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.status == "IDLE",
            func.date(UserStatusLog.start_time) == today
        )
        .scalar()
    )

    active_time = int(
        active_result or 0
    )

    idle_time = int(
        idle_result or 0
    )

    # -------------------------------------------------
    # Add currently open status logs - TODAY
    # -------------------------------------------------

    open_status_logs = (
        db.query(UserStatusLog)
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.end_time == None,
            func.date(UserStatusLog.start_time) == today
        )
        .all()
    )

    now = datetime.now()

    for status_log in open_status_logs:

        live_duration = int(
            (
                now - status_log.start_time
            ).total_seconds()
        )

        if live_duration < 0:
            live_duration = 0

        if status_log.status == "ACTIVE":

            active_time += live_duration

        elif status_log.status == "IDLE":

            idle_time += live_duration

    # -------------------------------------------------
    # Focus Score
    # -------------------------------------------------

    total_status_time = (
        active_time +
        idle_time
    )

    if total_status_time > 0:

        focus_score = round(
            (
                active_time /
                total_status_time
            ) * 100,
            2
        )

    else:

        focus_score = 0

    # Keep score between 0 and 100
    focus_score = min(
        max(focus_score, 0),
        100
    )

    return {
        "browser_time_seconds": browser_time,
        "active_time_seconds": active_time,
        "idle_time_seconds": idle_time,
        "focus_score": focus_score
    }


@router.get("/role/report")
def role_activity_report(
    type: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # -------------------------------------------------
    # Get organization USER IDs
    # -------------------------------------------------

    if current_user.role == "SUB_ADMIN":

        if current_user.organization_id is None:
            raise HTTPException(
                status_code=400,
                detail="Sub Admin is not assigned to any organization."
            )

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(
                    User.organization_id == current_user.organization_id,
                    User.role == "USER"
                )
                .all()
            )
        ]

    elif current_user.role == "SUPER_ADMIN":

        user_ids = [
            user_id
            for (user_id,) in (
                db.query(User.id)
                .filter(
                    User.role == "USER"
                )
                .all()
            )
        ]

    else:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access role-based reports."
        )

    # -------------------------------------------------
    # Date Range
    # -------------------------------------------------

    today = datetime.now()

    if type.lower() == "weekly":

        start_date = today - timedelta(days=7)

    elif type.lower() == "monthly":

        start_date = today - timedelta(days=30)

    else:

        raise HTTPException(
            status_code=400,
            detail="Type must be weekly or monthly."
        )

    # -------------------------------------------------
    # Get Status Logs
    # -------------------------------------------------

    logs = (
        db.query(UserStatusLog)
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.start_time >= start_date
        )
        .all()
    )

    active_time = 0
    idle_time = 0

    daily_breakdown = defaultdict(
        lambda: {
            "active_time": 0,
            "idle_time": 0
        }
    )

    weekly_breakdown = defaultdict(
        lambda: {
            "active_time": 0,
            "idle_time": 0
        }
    )

    # -------------------------------------------------
    # Process Logs
    # -------------------------------------------------

    now = datetime.now()

    for log in logs:

        # Completed log
        if log.end_time is not None:

            duration = log.duration or 0

        # Currently open log
        else:

            duration = int(
                (
                    now - log.start_time
                ).total_seconds()
            )

            if duration < 0:
                duration = 0

        # -------------------------------------------------
        # Total Active / Idle
        # -------------------------------------------------

        if log.status == "ACTIVE":

            active_time += duration

        elif log.status == "IDLE":

            idle_time += duration

        # -------------------------------------------------
        # Weekly → Day-wise
        # -------------------------------------------------

        if type.lower() == "weekly":

            day = log.start_time.strftime("%A")

            if log.status == "ACTIVE":

                daily_breakdown[day]["active_time"] += duration

            elif log.status == "IDLE":

                daily_breakdown[day]["idle_time"] += duration

        # -------------------------------------------------
        # Monthly → Rolling 7-day buckets
        # -------------------------------------------------

        else:

            days_from_start = (
                log.start_time.date() -
                start_date.date()
            ).days

            week_number = (
                days_from_start // 7
            ) + 1

            # The 30-day window can contain at most
            # five buckets: 0-6, 7-13, 14-20, 21-27, 28-29.
            week_number = min(
                max(week_number, 1),
                5
            )

            week = f"Week {week_number}"

            if log.status == "ACTIVE":

                weekly_breakdown[week]["active_time"] += duration

            elif log.status == "IDLE":

                weekly_breakdown[week]["idle_time"] += duration

    # -------------------------------------------------
    # Total Time
    # -------------------------------------------------

    total_time = (
        active_time +
        idle_time
    )

    # -------------------------------------------------
    # Focus Score
    # -------------------------------------------------

    focus_score = 0

    if total_time > 0:

        focus_score = round(
            (
                active_time /
                total_time
            ) * 100,
            2
        )

    # -------------------------------------------------
    # Weekly Response
    # -------------------------------------------------

    if type.lower() == "weekly":

        breakdown = []

        # Keep all seven days in the chart
        for i in range(7):

            date = (
                start_date +
                timedelta(days=i)
            )

            day = date.strftime("%A")

            value = daily_breakdown[day]

            breakdown.append({
                "day": day,
                "active_time_seconds":
                    value["active_time"],
                "active_time":
                    format_duration(
                        value["active_time"]
                    ),
                "idle_time_seconds":
                    value["idle_time"],
                "idle_time":
                    format_duration(
                        value["idle_time"]
                    )
            })

        return {
            "report_type": "weekly",

            "start_date": start_date,

            "end_date": today,

            "active_time_seconds":
                active_time,

            "active_time":
                format_duration(
                    active_time
                ),

            "idle_time_seconds":
                idle_time,

            "idle_time":
                format_duration(
                    idle_time
                ),

            "total_time_seconds":
                total_time,

            "total_time":
                format_duration(
                    total_time
                ),

            "focus_score":
                focus_score,

            "daily_breakdown":
                breakdown
        }

    # -------------------------------------------------
    # Monthly Response
    # -------------------------------------------------

    breakdown = []

    for week_number in range(1, 6):

        week = f"Week {week_number}"

        value = weekly_breakdown[week]

        breakdown.append({
            "week": week,

            "active_time_seconds":
                value["active_time"],

            "active_time":
                format_duration(
                    value["active_time"]
                ),

            "idle_time_seconds":
                value["idle_time"],

            "idle_time":
                format_duration(
                    value["idle_time"]
                )
        })

    return {
        "report_type": "monthly",

        "start_date": start_date,

        "end_date": today,

        "active_time_seconds":
            active_time,

        "active_time":
            format_duration(
                active_time
            ),

        "idle_time_seconds":
            idle_time,

        "idle_time":
            format_duration(
                idle_time
            ),

        "total_time_seconds":
            total_time,

        "total_time":
            format_duration(
                total_time
            ),

        "focus_score":
            focus_score,

        "weekly_breakdown":
            breakdown
    }


@router.get("/users/{user_id}/activity-summary")
def individual_user_activity_summary(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    target_user = verify_user_access(
        db,
        current_user,
        user_id
    )

    browser_time = (
        db.query(
            func.coalesce(
                func.sum(ActivityLog.duration),
                0
            )
        )
        .filter(
            ActivityLog.user_id == user_id
        )
        .scalar()
    )

    active_time = (
        db.query(
            func.coalesce(
                func.sum(UserStatusLog.duration),
                0
            )
        )
        .filter(
            UserStatusLog.user_id == user_id,
            UserStatusLog.status == "ACTIVE"
        )
        .scalar()
    )

    idle_time = (
        db.query(
            func.coalesce(
                func.sum(UserStatusLog.duration),
                0
            )
        )
        .filter(
            UserStatusLog.user_id == user_id,
            UserStatusLog.status == "IDLE"
        )
        .scalar()
    )

    browser_time = int(browser_time or 0)
    active_time = int(active_time or 0)
    idle_time = int(idle_time or 0)

    # Include currently open status
    open_logs = (
        db.query(UserStatusLog)
        .filter(
            UserStatusLog.user_id == user_id,
            UserStatusLog.end_time == None
        )
        .all()
    )

    now = datetime.now()

    for log in open_logs:

        duration = int(
            (
                now - log.start_time
            ).total_seconds()
        )

        if duration < 0:
            duration = 0

        if log.status == "ACTIVE":
            active_time += duration

        elif log.status == "IDLE":
            idle_time += duration

    focus_score = 0

    if browser_time > 0:
        focus_score = round(
            (active_time / browser_time) * 100,
            2
        )

    focus_score = min(
        max(focus_score, 0),
        100
    )

    return {
        "user": {
            "id": target_user.id,
            "full_name": target_user.full_name,
            "email": target_user.email,
            "role": target_user.role,
            "organization_id": target_user.organization_id
        },
        "browser_time_seconds": browser_time,
        "active_time_seconds": active_time,
        "idle_time_seconds": idle_time,
        "focus_score": focus_score
    }


# =====================================================
# Individual User Detailed Activity History
# =====================================================

@router.get("/users/{user_id}/activity")
def individual_user_activity(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Verify that the logged-in admin
    # is allowed to view this user
    verify_user_access(
        db,
        current_user,
        user_id
    )

    activities = (
        db.query(ActivityLog)
        .filter(
            ActivityLog.user_id == user_id
        )
        .order_by(
            ActivityLog.start_time.desc()
        )
        .limit(100)
        .all()
    )

    result = []

    for activity in activities:

        result.append({
            "id": activity.id,
            "url": activity.url,
            "website_name": activity.website_name,
            "tab_title": activity.tab_title,
            "application": activity.application,
            "category": activity.category,
            "productivity": activity.productivity,
            "start_time": activity.start_time,
            "end_time": activity.end_time,
            "duration_seconds": activity.duration or 0
        })

    return result


# =====================================================
# Individual User Website Analytics
# =====================================================

@router.get("/users/{user_id}/websites")
def individual_user_websites(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    verify_user_access(
        db,
        current_user,
        user_id
    )

    websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .all()
    )

    return [
        {
            "website": website or "Unknown",
            "duration_seconds": int(duration or 0)
        }
        for website, duration in websites
    ]


# =====================================================
# Individual User Category Analytics
# =====================================================

@router.get("/users/{user_id}/categories")
def individual_user_categories(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    verify_user_access(
        db,
        current_user,
        user_id
    )

    categories = (
        db.query(
            ActivityLog.category,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id
        )
        .group_by(
            ActivityLog.category
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .all()
    )

    return [
        {
            "category": category or "Other",
            "duration_seconds": int(duration or 0)
        }
        for category, duration in categories
    ]


# =====================================================
# Individual User Tab Switches
# =====================================================

@router.get("/users/{user_id}/tab-switches")
def individual_user_tab_switches(
    user_id: int,
    date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    verify_user_access(
        db,
        current_user,
        user_id
    )

    query = db.query(TabSwitchLog).filter(
        TabSwitchLog.user_id == user_id
    )

    if date:
        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD."
            )

        query = query.filter(
            func.date(TabSwitchLog.switch_time) == selected_date
        )

    total_switches = query.count()

    latest_switches = (
        query
        .order_by(TabSwitchLog.switch_time.desc())
        .limit(10)
        .all()
    )

    return {
        "total_switches": total_switches,
        "recent_switches": [
            {
                "from": switch.from_website,
                "to": switch.to_website,
                "time": switch.switch_time
            }
            for switch in latest_switches
        ]
    }


# =====================================================
# Individual User Weekly / Monthly Report
# =====================================================

@router.get("/users/{user_id}/report")
def individual_user_report(
    user_id: int,
    type: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    verify_user_access(
        db,
        current_user,
        user_id
    )

    today = datetime.now()

    if type.lower() == "weekly":

        start_date = today - timedelta(days=7)

    elif type.lower() == "monthly":

        start_date = today - timedelta(days=30)

    else:

        raise HTTPException(
            status_code=400,
            detail="Type must be weekly or monthly."
        )

    logs = (
        db.query(UserStatusLog)
        .filter(
            UserStatusLog.user_id == user_id,
            UserStatusLog.start_time >= start_date
        )
        .all()
    )

    active_time = 0
    idle_time = 0

    daily_breakdown = defaultdict(
        lambda: {
            "active_time": 0,
            "idle_time": 0
        }
    )

    weekly_breakdown = defaultdict(
        lambda: {
            "active_time": 0,
            "idle_time": 0
        }
    )

    now = datetime.now()

    for log in logs:

        if log.end_time is not None:

            duration = log.duration or 0

        else:

            duration = int(
                (
                    now - log.start_time
                ).total_seconds()
            )

            if duration < 0:
                duration = 0

        if log.status == "ACTIVE":

            active_time += duration

        elif log.status == "IDLE":

            idle_time += duration

        if type.lower() == "weekly":

            day = log.start_time.strftime("%A")

            if log.status == "ACTIVE":
                daily_breakdown[day]["active_time"] += duration

            elif log.status == "IDLE":
                daily_breakdown[day]["idle_time"] += duration

        else:

            week_number = (
                (log.start_time.day - 1) // 7
            ) + 1

            week = f"Week {week_number}"

            if log.status == "ACTIVE":
                weekly_breakdown[week]["active_time"] += duration

            elif log.status == "IDLE":
                weekly_breakdown[week]["idle_time"] += duration

    total_time = active_time + idle_time

    focus_score = 0

    if total_time > 0:

        focus_score = round(
            (active_time / total_time) * 100,
            2
        )

    if type.lower() == "weekly":

        breakdown = []

        for i in range(7):

            date = (
                start_date +
                timedelta(days=i)
            )

            day = date.strftime("%A")

            value = daily_breakdown[day]

            breakdown.append({
                "day": day,

                "active_time_seconds":
                    value["active_time"],

                "active_time":
                    format_duration(
                        value["active_time"]
                    ),

                "idle_time_seconds":
                    value["idle_time"],

                "idle_time":
                    format_duration(
                        value["idle_time"]
                    )
            })

        return {
            "report_type": "weekly",

            "start_date": start_date,

            "end_date": today,

            "active_time_seconds":
                active_time,

            "active_time":
                format_duration(
                    active_time
                ),

            "idle_time_seconds":
                idle_time,

            "idle_time":
                format_duration(
                    idle_time
                ),

            "total_time_seconds":
                total_time,

            "total_time":
                format_duration(
                    total_time
                ),

            "focus_score":
                focus_score,

            "daily_breakdown":
                breakdown
        }

    breakdown = []

    for week_number in range(1, 6):

        week = f"Week {week_number}"

        value = weekly_breakdown[week]

        breakdown.append({
            "week": week,

            "active_time_seconds":
                value["active_time"],

            "active_time":
                format_duration(
                    value["active_time"]
                ),

            "idle_time_seconds":
                value["idle_time"],

            "idle_time":
                format_duration(
                    value["idle_time"]
                )
        })

    return {
        "report_type": "monthly",

        "start_date": start_date,

        "end_date": today,

        "active_time_seconds":
            active_time,

        "active_time":
            format_duration(
                active_time
            ),

        "idle_time_seconds":
            idle_time,

        "idle_time":
            format_duration(
                idle_time
            ),

        "total_time_seconds":
            total_time,

        "total_time":
            format_duration(
                total_time
            ),

        "focus_score":
            focus_score,

        "weekly_breakdown":
            breakdown
    }