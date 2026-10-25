from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from sqlalchemy import func

from datetime import datetime, time, timedelta

from zoneinfo import ZoneInfo

from app.database import SessionLocal

from app.dependencies import get_current_user

from app.services.analytics_service import (

    get_dashboard_metrics,

    get_category_time_summary

)

from app.services.prompts import build_focus_planner_prompt

from app.services.llm import llm_service

from app.services.translation_service import TranslationService

from app.models import (

    FocusPlan,

    FocusPlanItem,

    WebsiteCategory,

    ActivityLog,

    Notification

)

from app.schemas import (

    FocusPlanCreate,

    FocusPlanUpdate,

    FocusPlanResponse

)

IST = ZoneInfo("Asia/Kolkata")


def normalize_plan_date(value: datetime) -> datetime:
    """Normalize a requested plan date to midnight in the India-local calendar."""
    if value.tzinfo is not None:
        value = value.astimezone(IST)
    return datetime.combine(value.date(), time.min)


def get_plan_for_date(db: Session, user_id: int, target_date):
    """
    Find a plan for an India-local calendar date.

    The date() match supports plans stored at local midnight. The UTC-naive
    range also supports older rows saved as UTC timestamps in a timezone-naive
    PostgreSQL DateTime column.
    """
    start_utc_naive = (
        datetime.combine(target_date, time.min, tzinfo=IST)
        .astimezone(ZoneInfo("UTC"))
        .replace(tzinfo=None)
    )
    end_utc_naive = (
        datetime.combine(target_date + timedelta(days=1), time.min, tzinfo=IST)
        .astimezone(ZoneInfo("UTC"))
        .replace(tzinfo=None)
    )

    return (
        db.query(FocusPlan)
        .filter(
            FocusPlan.user_id == user_id,
            (
                (func.date(FocusPlan.plan_date) == target_date)
                | (
                    (FocusPlan.plan_date >= start_utc_naive)
                    & (FocusPlan.plan_date < end_utc_naive)
                )
            ),
        )
        .order_by(FocusPlan.id.desc())
        .first()
    )


def get_plan_for_ist_today(db: Session, user_id: int):
    now_ist = datetime.now(IST)
    today = now_ist.date()
    plan = get_plan_for_date(db, user_id, today)
    return today, now_ist, plan


router = APIRouter(

    prefix="/planner",

    tags=["Focus Planner"]

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

# Create Focus Plan

# -----------------------------------------------------

@router.post("")

def create_focus_plan(

    request: FocusPlanCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    normalized_plan_date = normalize_plan_date(request.plan_date)
    existing_plan = get_plan_for_date(
        db, current_user.id, normalized_plan_date.date()
    )

    if existing_plan:

        raise HTTPException(

            status_code=400,

            detail="Focus plan already exists for this date."

        )

    plan = FocusPlan(

        user_id=current_user.id,

        plan_date=normalized_plan_date,

        total_goal_minutes=request.total_goal_minutes

    )

    db.add(plan)

    db.commit()

    db.refresh(plan)

    for item in request.plans:

        db.add(

            FocusPlanItem(

                plan_id=plan.id,

                category=item.category,

                planned_minutes=item.planned_minutes,

                start_time=item.start_time,

                end_time=item.end_time

            )

        )

    db.commit()

    return {

        "message": "Focus plan created successfully.",

        "plan_id": plan.id

    }

# -----------------------------------------------------

# Update Focus Plan

# -----------------------------------------------------

@router.put("/{plan_id}")

def update_focus_plan(

    plan_id: int,

    request: FocusPlanUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    plan = (

        db.query(FocusPlan)

        .filter(

            FocusPlan.id == plan_id,

            FocusPlan.user_id == current_user.id

        )

        .first()

    )

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="Focus plan not found."

        )

    # Update main plan

    plan.total_goal_minutes = request.total_goal_minutes

    # Delete old plan items

    db.query(FocusPlanItem).filter(

        FocusPlanItem.plan_id == plan.id

    ).delete()

    db.flush()

    # Add updated plan items

    for item in request.plans:

        db.add(

            FocusPlanItem(

                plan_id=plan.id,

                category=item.category,

                planned_minutes=item.planned_minutes,

                start_time=item.start_time,

                end_time=item.end_time

            )

        )

    db.commit()

    return {

        "message": "Focus plan updated successfully.",

        "plan_id": plan.id

    }

# -----------------------------------------------------

# Get Today's Plan

# -----------------------------------------------------

@router.get("/today")

def get_today_plan(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="No focus plan found for today."

        )

    plan_items = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    return {

        "plan_id": plan.id,

        "date": plan.plan_date.date(),

        "total_goal_minutes": plan.total_goal_minutes,

        "plans": [

            {

                "category": item.category,

                "planned_minutes": item.planned_minutes,

                "start_time": item.start_time,

                "end_time": item.end_time

            }

            for item in plan_items

        ]

    }

# -----------------------------------------------------

# Available Planner Categories

# -----------------------------------------------------

@router.get("/categories")

def get_planner_categories(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    categories = (

        db.query(

            WebsiteCategory.category

        )

        .distinct()

        .order_by(

            WebsiteCategory.category.asc()

        )

        .all()

    )

    return {

        "categories": [

            category

            for (category,) in categories

            if category

        ]

    }

# -----------------------------------------------------

# Planner Progress

# -----------------------------------------------------

@router.get("/progress")

def get_focus_plan_progress(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="No focus plan found for today."

        )

    plan_items = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    metrics = get_dashboard_metrics(

        db=db,

        user_id=current_user.id,

        period="today"

    )

    actual_categories = get_category_time_summary(

        db=db,

        user_id=current_user.id,

        period="today"

    )

    actual_lookup = {

        item["category"].lower(): item

        for item in actual_categories

    }

    planner = []

    completed_minutes = 0

    for item in plan_items:

        actual = actual_lookup.get(

            item.category.lower(),

            {

                "minutes": 0,

                "seconds": 0

            }

        )

        actual_minutes = actual["minutes"]

        difference = round(

            actual_minutes - item.planned_minutes,

            2

        )

        completion = round(

            min(actual_minutes, item.planned_minutes)

            / item.planned_minutes * 100,

            2

        ) if item.planned_minutes else 0

        completed_minutes += min(

            actual_minutes,

            item.planned_minutes

        )

        if actual_minutes == item.planned_minutes:

            status = "On Track"

        elif actual_minutes > item.planned_minutes:

            status = "Exceeded"

        else:

            status = "Behind"

        planner.append({

            "category": item.category,

            "planned_minutes": item.planned_minutes,

            "start_time": item.start_time,

            "end_time": item.end_time,

            "actual_minutes": actual_minutes,

            "difference_minutes": difference,

            "completion_percentage": completion,

        "status": status

    })

    goal_completion = round(

        completed_minutes / plan.total_goal_minutes * 100,

        2

    ) if plan.total_goal_minutes else 0

    return {

        "date": today,

        "goal_minutes": plan.total_goal_minutes,

        "completed_minutes": round(completed_minutes, 2),

        "goal_completion_percentage": goal_completion,

        "focus_score": metrics["focus_score"],

        "planner": planner

    }

# -----------------------------------------------------

# AI Planner Recommendation

# -----------------------------------------------------

@router.get("/recommendation")

def get_planner_recommendation(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="No focus plan found for today."

        )

    plan_items = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    metrics = get_dashboard_metrics(

        db=db,

        user_id=current_user.id,

        period="today"

    )

    actual_categories = get_category_time_summary(

        db=db,

        user_id=current_user.id,

        period="today"

    )

    actual_lookup = {

        item["category"].lower(): item

        for item in actual_categories

    }

    planner = []

    completed_minutes = 0

    for item in plan_items:

        actual = actual_lookup.get(

            item.category.lower(),

            {

                "minutes": 0

            }

        )

        actual_minutes = actual["minutes"]

        completed_minutes += min(

            actual_minutes,

            item.planned_minutes

        )

        if actual_minutes == item.planned_minutes:

            status = "On Track"

        elif actual_minutes > item.planned_minutes:

            status = "Exceeded"

        else:

            status = "Behind"

        planner.append({

            "category": item.category,

            "planned_minutes": item.planned_minutes,

            "start_time": item.start_time,

            "end_time": item.end_time,

            "actual_minutes": actual_minutes,

            "status": status

        })

    prompt = build_focus_planner_prompt(

        goal_minutes=plan.total_goal_minutes,

        completed_minutes=round(completed_minutes, 2),

        focus_score=metrics["focus_score"],

        planner=planner

    )

    recommendation = llm_service.ask_llm(prompt)

    return {

        "date": today,

        "goal_minutes": plan.total_goal_minutes,

        "completed_minutes": round(completed_minutes, 2),

        "focus_score": metrics["focus_score"],

        "planner": planner,

        "recommendation": recommendation

    }

# -----------------------------------------------------

# Current Focus Session

# -----------------------------------------------------

@router.get("/current-session")

def get_current_session(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)
    current_time = now_ist.time()

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="No focus plan found for today."

        )

    session = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    current_item = None

    for item in session:

        if (

            item.start_time is not None

            and item.end_time is not None

            and item.start_time <= current_time <= item.end_time

        ):

            current_item = item

            break

    if current_item is None:

        return {

            "message": "No active focus session right now."

        }

    remaining_seconds = (

        datetime.combine(today, current_item.end_time)

        -

        datetime.combine(today, current_time)

    ).seconds

    remaining_minutes = round(

        remaining_seconds / 60,

        2

    )

    return {

        "category": current_item.category,

        "planned_minutes": current_item.planned_minutes,

        "start_time": current_item.start_time,

        "end_time": current_item.end_time,

        "remaining_minutes": remaining_minutes

    }

# -----------------------------------------------------

# Live Planner Status

# -----------------------------------------------------

@router.get("/live-status")

def get_live_status(

    language: str = "en",

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)
    current_time = now_ist.time()

    if not plan:

        raise HTTPException(

            status_code=404,

            detail="No focus plan found for today."

        )

    current_session = None

    sessions = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    for item in sessions:

        if (

            item.start_time

            and item.end_time

            and item.start_time <= current_time <= item.end_time

        ):

            current_session = item

            break

    if current_session is None:

        return {

            "status": "NO_SESSION",

            "message": TranslationService.get_translation(

                    db,

                    "NO_ACTIVE_SESSION",

                    language

                )

        }

    latest_activity = (

        db.query(ActivityLog)

        .filter(

            ActivityLog.user_id == current_user.id

        )

        .order_by(

            ActivityLog.start_time.desc()

        )

        .first()

    )

    if latest_activity is None:

        return {

            "status": "NO_ACTIVITY",

            "planned_category": current_session.category,

            "message": TranslationService.get_translation(

                    db,

                    "NO_ACTIVITY",

                    language

                )

        }

    if (

        latest_activity.category.lower()

        ==

        current_session.category.lower()

    ):

        status = "ON_TRACK"

        message = TranslationService.get_translation(

                db,

                "ON_TRACK",

                language

            )

    else:

        status = "OFF_TRACK"

        english_message = (

            f"You planned {current_session.category} "

            f"but currently using {latest_activity.category}."

        )

        message = TranslationService.translate_dynamic_message(

            db=db,

            message=english_message,

            language=language,

        )

    return {

        "status": status,

        "planned_category": current_session.category,

        "current_category": latest_activity.category,

        "website": latest_activity.website_name,

        "url": latest_activity.url,

        "message": message

    }

# -----------------------------------------------------

# Focus Check

# -----------------------------------------------------

@router.post("/check-focus")

def check_focus(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    today, now_ist, plan = get_plan_for_ist_today(db, current_user.id)
    current_time = now_ist.replace(tzinfo=None)

    if not plan:

        return {

            "status": "NO_PLAN",

            "message": "No planner available."

        }

    current_session = None

    sessions = (

        db.query(FocusPlanItem)

        .filter(

            FocusPlanItem.plan_id == plan.id

        )

        .all()

    )

    for item in sessions:

        if (

            item.start_time

            and item.end_time

            and item.start_time <= current_time.time() <= item.end_time

        ):

            current_session = item

            break

    if current_session is None:

        return {

            "status": "NO_SESSION",

            "message": "No active planner session."

        }

    latest = (

        db.query(ActivityLog)

        .filter(

            ActivityLog.user_id == current_user.id

        )

        .order_by(

            ActivityLog.start_time.desc()

        )

        .first()

    )

    if latest is None:

        return {

            "status": "NO_ACTIVITY",

            "message": "No activity found."

        }

    current_category = latest.category or ""

    if current_category.lower() == current_session.category.lower():

        return {

            "status": "ON_TRACK",

            "planned_category": current_session.category,

            "current_category": current_category,

            "message": "Great! You are following your planner."

        }

    # -----------------------------------------------------

    # Check if recent notification already exists

    # -----------------------------------------------------

    recent_notification = (

        db.query(Notification)

        .filter(

            Notification.user_id == current_user.id,

            Notification.notification_type == "FOCUS",

            Notification.is_read == False,

            Notification.created_at >= current_time - timedelta(seconds=20)

        )

        .order_by(

            Notification.created_at.desc()

        )

        .first()

    )

    if recent_notification:

        return {

            "status": "OFF_TRACK",

            "planned_category": current_session.category,

            "current_category": current_category,

            "notification": recent_notification.message,

            "already_notified": True

        }

    # -----------------------------------------------------

    # Generate AI Reminder

    # -----------------------------------------------------

    prompt = f"""

You are FocusGuard AI.

The user planned to work on:

{current_session.category}

Current activity:

Website:

{latest.website_name}

Category:

{current_category}

Generate one short motivational reminder.

Rules:

- Maximum 40 words.

- Encourage the user to return to the planned task.

- Friendly and supportive.

- No markdown.

"""

    ai_message = llm_service.ask_llm(prompt)

    # -----------------------------------------------------

    # Save Notification

    # -----------------------------------------------------

    notification = Notification(

        user_id=current_user.id,

        title="Focus Reminder",

        message=ai_message,

        notification_type="FOCUS"

    )

    db.add(notification)

    db.commit()

    return {

        "status": "OFF_TRACK",

        "planned_category": current_session.category,

        "current_category": current_category,

        "website": latest.website_name,

        "url": latest.url,

        "notification": ai_message,

        "already_notified": False

    }