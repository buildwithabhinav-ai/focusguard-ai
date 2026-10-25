from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta

from app.models import (
    ActivityLog,
    UserStatusLog,
    TabSwitchLog,
    User
)


# ---------------------------------------------
# Format Seconds
# ---------------------------------------------

def format_duration(seconds: int) -> str:

    seconds = int(seconds)

    hours = seconds // 3600

    minutes = (seconds % 3600) // 60

    if hours == 0:

        return f"{minutes}m"

    return f"{hours}h {minutes}m"


def get_dashboard_metrics(
    db: Session,
    user_id: int,
    period: str = "today"
):

    # -----------------------------
    # Date Range
    # -----------------------------

    now = datetime.now()

    if period == "today":

        start_date = datetime(
            now.year,
            now.month,
            now.day
        )

    elif period == "week":

        start_date = now - timedelta(days=7)

    elif period == "month":

        start_date = now - timedelta(days=30)

    else:

        start_date = datetime.min

    # -----------------------------
    # Browser Time
    # -----------------------------

    browser_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.start_time >= start_date
    ).scalar() or 0

    # -----------------------------
    # Active Time
    # -----------------------------

    active_time = db.query(
        func.sum(UserStatusLog.duration)
    ).filter(
        UserStatusLog.user_id == user_id,
        UserStatusLog.status == "ACTIVE",
        UserStatusLog.start_time >= start_date
    ).scalar() or 0

    # -----------------------------
    # Idle Time
    # -----------------------------

    idle_time = db.query(
        func.sum(UserStatusLog.duration)
    ).filter(
        UserStatusLog.user_id == user_id,
        UserStatusLog.status == "IDLE",
        UserStatusLog.start_time >= start_date
    ).scalar() or 0

    # -----------------------------
    # Productive Time
    # -----------------------------

    productive_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.productivity == "Productive",
        ActivityLog.start_time >= start_date
    ).scalar() or 0

    # -----------------------------
    # Non Productive Time
    # -----------------------------

    non_productive_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.productivity == "Non Productive",
        ActivityLog.start_time >= start_date
    ).scalar() or 0

    # -----------------------------
    # Focus Score
    # -----------------------------
    #
    # Focus score measures the proportion of
    # ACTIVE status time within total recorded
    # status time (ACTIVE + IDLE).
    #
    # Browser time is a separate activity metric
    # and must not be used as the denominator.
    # -----------------------------

    total_status_time = active_time + idle_time

    if total_status_time > 0:

        focus_score = round(
            (active_time / total_status_time) * 100,
            2
        )

    else:

        focus_score = 0

    # -----------------------------
    # Top Websites
    # -----------------------------

    websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_websites = [
        website
        for website, _ in websites
        if website
    ]

    # -----------------------------
    # Categories
    # -----------------------------

    categories = (
        db.query(
            ActivityLog.category,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.category
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_categories = [
        category
        for category, _ in categories
        if category
    ]

    # -----------------------------
    # Total Tab Switches
    # -----------------------------

    total_tab_switches = db.query(
        TabSwitchLog
    ).filter(
        TabSwitchLog.user_id == user_id,
        TabSwitchLog.switch_time >= start_date
    ).count()

    # -----------------------------
    # Productive Websites
    # -----------------------------

    productive_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.productivity == "Productive",
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    productive_websites = [
        site
        for site, _ in productive_websites
        if site
    ]

    # -----------------------------
    # Distracting Websites
    # -----------------------------

    distracting_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.productivity == "Non Productive",
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    distracting_websites = [
        site
        for site, _ in distracting_websites
        if site
    ]

    return {

        # Raw values

        "browser_time": browser_time,

        "active_time": active_time,

        "idle_time": idle_time,

        "productive_time": productive_time,

        "non_productive_time": non_productive_time,

        "focus_score": focus_score,

        "tab_switches": total_tab_switches,

        # Formatted values

        "browser_time_text": format_duration(browser_time),

        "active_time_text": format_duration(active_time),

        "idle_time_text": format_duration(idle_time),

        "productive_time_text": format_duration(productive_time),

        "non_productive_time_text": format_duration(non_productive_time),

        # Lists

        "top_websites": top_websites,

        "top_categories": top_categories,

        "productive_websites": productive_websites,

        "distracting_websites": distracting_websites

    }


# ---------------------------------------------
# Historical Daily Dashboard Metrics
# Used for RAG historical summaries
# ---------------------------------------------

def get_dashboard_metrics_for_date(
    db: Session,
    user_id: int,
    target_date
):
    """
    Calculate FocusGuard analytics for exactly one calendar day.

    This function reads real data from:
    - ActivityLog
    - UserStatusLog
    - TabSwitchLog

    It does not create or hardcode any productivity data.
    """

    # -----------------------------
    # Date Range
    # -----------------------------

    start_date = datetime(
        target_date.year,
        target_date.month,
        target_date.day
    )

    end_date = start_date + timedelta(days=1)

    # -----------------------------
    # Browser Time
    # -----------------------------

    browser_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.start_time >= start_date,
        ActivityLog.start_time < end_date
    ).scalar() or 0

    # -----------------------------
    # Active Time
    # -----------------------------

    active_time = db.query(
        func.sum(UserStatusLog.duration)
    ).filter(
        UserStatusLog.user_id == user_id,
        UserStatusLog.status == "ACTIVE",
        UserStatusLog.start_time >= start_date,
        UserStatusLog.start_time < end_date
    ).scalar() or 0

    # -----------------------------
    # Idle Time
    # -----------------------------

    idle_time = db.query(
        func.sum(UserStatusLog.duration)
    ).filter(
        UserStatusLog.user_id == user_id,
        UserStatusLog.status == "IDLE",
        UserStatusLog.start_time >= start_date,
        UserStatusLog.start_time < end_date
    ).scalar() or 0

    # -----------------------------
    # Productive Time
    # -----------------------------

    productive_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.productivity == "Productive",
        ActivityLog.start_time >= start_date,
        ActivityLog.start_time < end_date
    ).scalar() or 0

    # -----------------------------
    # Non Productive Time
    # -----------------------------

    non_productive_time = db.query(
        func.sum(ActivityLog.duration)
    ).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.productivity == "Non Productive",
        ActivityLog.start_time >= start_date,
        ActivityLog.start_time < end_date
    ).scalar() or 0

    
    # -----------------------------
    # Focus Score
    # -----------------------------
    #
    # Focus score measures ACTIVE time as a
    # proportion of total recorded status time.
    #
    # This is intentionally based on:
    #
    #     ACTIVE / (ACTIVE + IDLE)
    #
    # rather than ACTIVE / Browser Time.
    #
    # Browser activity and user status are
    # separate measurements.
    # -----------------------------

    total_status_time = active_time + idle_time

    if total_status_time > 0:

        focus_score = round(
            (active_time / total_status_time) * 100,
            2
        )

    else:

        focus_score = 0

    # -----------------------------
    # Top Websites
    # -----------------------------

    websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.start_time >= start_date,
            ActivityLog.start_time < end_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_websites = [
        website
        for website, _ in websites
        if website
    ]

    # -----------------------------
    # Categories
    # -----------------------------

    categories = (
        db.query(
            ActivityLog.category,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.start_time >= start_date,
            ActivityLog.start_time < end_date
        )
        .group_by(
            ActivityLog.category
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_categories = [
        category
        for category, _ in categories
        if category
    ]

    # -----------------------------
    # Total Tab Switches
    # -----------------------------

    total_tab_switches = db.query(
        TabSwitchLog
    ).filter(
        TabSwitchLog.user_id == user_id,
        TabSwitchLog.switch_time >= start_date,
        TabSwitchLog.switch_time < end_date
    ).count()

    # -----------------------------
    # Productive Websites
    # -----------------------------

    productive_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.productivity == "Productive",
            ActivityLog.start_time >= start_date,
            ActivityLog.start_time < end_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    productive_websites = [
        site
        for site, _ in productive_websites
        if site
    ]

    # -----------------------------
    # Distracting Websites
    # -----------------------------

    distracting_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id == user_id,
            ActivityLog.productivity == "Non Productive",
            ActivityLog.start_time >= start_date,
            ActivityLog.start_time < end_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    distracting_websites = [
        site
        for site, _ in distracting_websites
        if site
    ]

    # -----------------------------
    # Return
    # -----------------------------

    return {
        # Raw values

        "browser_time": browser_time,

        "active_time": active_time,

        "idle_time": idle_time,

        "productive_time": productive_time,

        "non_productive_time": non_productive_time,

        "focus_score": focus_score,

        "tab_switches": total_tab_switches,

        # Formatted values

        "browser_time_text": format_duration(browser_time),

        "active_time_text": format_duration(active_time),

        "idle_time_text": format_duration(idle_time),

        "productive_time_text": format_duration(productive_time),

        "non_productive_time_text": format_duration(
            non_productive_time
        ),

        # Lists

        "top_websites": top_websites,

        "top_categories": top_categories,

        "productive_websites": productive_websites,

        "distracting_websites": distracting_websites
    }




# ---------------------------------------------
# Organization Dashboard Metrics
# Used by Super Admin AI
# ---------------------------------------------

def get_organization_dashboard_metrics(
    db: Session,
    organization_id: int,
    period: str = "today"
):
    # -----------------------------
    # Date Range
    # -----------------------------

    now = datetime.now()

    if period == "today":

        start_date = datetime(
            now.year,
            now.month,
            now.day
        )

    elif period == "week":

        start_date = now - timedelta(days=7)

    elif period == "month":

        start_date = now - timedelta(days=30)

    else:

        start_date = datetime.min


    # -----------------------------
    # Organization Users
    # -----------------------------

    user_ids = (
        db.query(User.id)
        .filter(
            User.role == "USER",
            User.organization_id == organization_id
        )
        .all()
    )

    user_ids = [
        user_id
        for user_id, in user_ids
    ]


    # No users
    if not user_ids:

        return {
            "browser_time": 0,
            "active_time": 0,
            "idle_time": 0,
            "productive_time": 0,
            "non_productive_time": 0,
            "focus_score": 0,
            "tab_switches": 0,

            "browser_time_text": "0m",
            "active_time_text": "0m",
            "idle_time_text": "0m",
            "productive_time_text": "0m",
            "non_productive_time_text": "0m",

            "top_websites": [],
            "top_categories": [],
            "productive_websites": [],
            "distracting_websites": []
        }


    # -----------------------------
    # Browser Time
    # -----------------------------

    browser_time = (
        db.query(
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.start_time >= start_date
        )
        .scalar()
        or 0
    )


    # -----------------------------
    # Active Time
    # -----------------------------

    active_time = (
        db.query(
            func.sum(UserStatusLog.duration)
        )
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.status == "ACTIVE",
            UserStatusLog.start_time >= start_date
        )
        .scalar()
        or 0
    )


    # -----------------------------
    # Idle Time
    # -----------------------------

    idle_time = (
        db.query(
            func.sum(UserStatusLog.duration)
        )
        .filter(
            UserStatusLog.user_id.in_(user_ids),
            UserStatusLog.status == "IDLE",
            UserStatusLog.start_time >= start_date
        )
        .scalar()
        or 0
    )


    # -----------------------------
    # Productive Time
    # -----------------------------

    productive_time = (
        db.query(
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.productivity == "Productive",
            ActivityLog.start_time >= start_date
        )
        .scalar()
        or 0
    )


    # -----------------------------
    # Non Productive Time
    # -----------------------------

    non_productive_time = (
        db.query(
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.productivity == "Non Productive",
            ActivityLog.start_time >= start_date
        )
        .scalar()
        or 0
    )


    # -----------------------------
    # Focus Score
    # -----------------------------
    #
    # Organization focus is calculated from
    # aggregated ACTIVE and IDLE status time.
    #
    # Focus Score =
    # ACTIVE / (ACTIVE + IDLE) × 100
    #
    # Browser time is not used as the denominator.
    # -----------------------------

    total_status_time = active_time + idle_time

    if total_status_time > 0:

        focus_score = round(
            (active_time / total_status_time) * 100,
            2
        )

    else:

        focus_score = 0


    # -----------------------------
    # Top Websites
    # -----------------------------

    websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_websites = [
        website
        for website, _ in websites
        if website
    ]


    # -----------------------------
    # Top Categories
    # -----------------------------

    categories = (
        db.query(
            ActivityLog.category,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.category
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(5)
        .all()
    )

    top_categories = [
        category
        for category, _ in categories
        if category
    ]


    # -----------------------------
    # Tab Switches
    # -----------------------------

    total_tab_switches = (
        db.query(TabSwitchLog)
        .filter(
            TabSwitchLog.user_id.in_(user_ids),
            TabSwitchLog.switch_time >= start_date
        )
        .count()
    )


    # -----------------------------
    # Productive Websites
    # -----------------------------

    productive_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.productivity == "Productive",
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    productive_websites = [
        site
        for site, _ in productive_websites
        if site
    ]


    # -----------------------------
    # Distracting Websites
    # -----------------------------

    distracting_websites = (
        db.query(
            ActivityLog.website_name,
            func.sum(ActivityLog.duration)
        )
        .filter(
            ActivityLog.user_id.in_(user_ids),
            ActivityLog.productivity == "Non Productive",
            ActivityLog.start_time >= start_date
        )
        .group_by(
            ActivityLog.website_name
        )
        .order_by(
            func.sum(ActivityLog.duration).desc()
        )
        .limit(3)
        .all()
    )

    distracting_websites = [
        site
        for site, _ in distracting_websites
        if site
    ]


    # -----------------------------
    # Return
    # -----------------------------

    return {

        "browser_time": browser_time,

        "active_time": active_time,

        "idle_time": idle_time,

        "productive_time": productive_time,

        "non_productive_time": non_productive_time,

        "focus_score": focus_score,

        "tab_switches": total_tab_switches,


        "browser_time_text":
            format_duration(browser_time),

        "active_time_text":
            format_duration(active_time),

        "idle_time_text":
            format_duration(idle_time),

        "productive_time_text":
            format_duration(productive_time),

        "non_productive_time_text":
            format_duration(non_productive_time),


        "top_websites":
            top_websites,

        "top_categories":
            top_categories,

        "productive_websites":
            productive_websites,

        "distracting_websites":
            distracting_websites

    }


def get_organization_dashboard_metrics_for_date(
    db: Session,
    *,
    organization_id: int,
    target_date: date,
):
    """
    Calculate organization-level dashboard metrics
    for one exact historical date.

    This function intentionally uses the same organization-level
    metric logic as the existing dashboard function, but restricts
    the underlying activity data to target_date.
    """

    start_datetime = datetime.combine(
        target_date,
        datetime.min.time()
    )

    end_datetime = start_datetime + timedelta(days=1)

    # -------------------------------------------------
    # Organization users
    # -------------------------------------------------

    organization_user_ids = [
        user.id
        for user in db.query(User.id)
        .filter(
            User.organization_id == organization_id,
            User.role == "USER"
        )
        .all()
    ]

    if not organization_user_ids:
        return {
            "active_time": 0,
            "active_time_text": "0m",
            "idle_time": 0,
            "idle_time_text": "0m",
            "browser_time": 0,
            "browser_time_text": "0m",
            "productive_time": 0,
            "productive_time_text": "0m",
            "non_productive_time": 0,
            "non_productive_time_text": "0m",
            "focus_score": 0,
            "tab_switches": 0,
            "top_websites": [],
            "top_categories": [],
            "productive_websites": [],
            "distracting_websites": [],
        }

    # -------------------------------------------------
    # IMPORTANT
    # -------------------------------------------------
    # Use the existing exact-date USER analytics function
    # for each organization user.
    #
    # This keeps all existing productivity calculations
    # consistent with the user-level dashboard.
    # -------------------------------------------------

    user_metrics = []

    for user_id in organization_user_ids:

        metrics = get_dashboard_metrics_for_date(
            db=db,
            user_id=user_id,
            target_date=target_date
        )

        user_metrics.append(metrics)

    # -------------------------------------------------
    # Aggregate metrics
    # -------------------------------------------------

    active_time = sum(
        metric.get("active_time", 0)
        for metric in user_metrics
    )

    idle_time = sum(
        metric.get("idle_time", 0)
        for metric in user_metrics
    )

    browser_time = sum(
        metric.get("browser_time", 0)
        for metric in user_metrics
    )

    productive_time = sum(
        metric.get("productive_time", 0)
        for metric in user_metrics
    )

    non_productive_time = sum(
        metric.get("non_productive_time", 0)
        for metric in user_metrics
    )

    tab_switches = sum(
        metric.get("tab_switches", 0)
        for metric in user_metrics
    )

    # -------------------------------------------------
    # Focus score
    # -------------------------------------------------
    # Calculate organization focus from total ACTIVE
    # time versus total ACTIVE + IDLE time.
    #
    # This keeps the score between 0 and 100 and avoids
    # comparing status time against browser activity time.

    total_status_time = active_time + idle_time

    if total_status_time > 0:

        focus_score = round(
            (active_time / total_status_time) * 100,
            2
        )

    else:

        focus_score = 0

    # -------------------------------------------------
    # Website aggregation
    # -------------------------------------------------

    website_counts = {}

    for metric in user_metrics:

        for website in metric.get(
            "top_websites",
            []
        ):

            website_counts[website] = (
                website_counts.get(website, 0) + 1
            )

    top_websites = [
        website
        for website, _ in sorted(
            website_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]
    ]

    # -------------------------------------------------
    # Category aggregation
    # -------------------------------------------------

    category_counts = {}

    for metric in user_metrics:

        for category in metric.get(
            "top_categories",
            []
        ):

            category_counts[category] = (
                category_counts.get(category, 0) + 1
            )

    top_categories = [
        category
        for category, _ in sorted(
            category_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]
    ]

    # -------------------------------------------------
    # Productive websites
    # -------------------------------------------------

    productive_website_counts = {}

    for metric in user_metrics:

        for website in metric.get(
            "productive_websites",
            []
        ):

            productive_website_counts[website] = (
                productive_website_counts.get(website, 0) + 1
            )

    productive_websites = [
        website
        for website, _ in sorted(
            productive_website_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]
    ]

    # -------------------------------------------------
    # Distracting websites
    # -------------------------------------------------

    distracting_website_counts = {}

    for metric in user_metrics:

        for website in metric.get(
            "distracting_websites",
            []
        ):

            distracting_website_counts[website] = (
                distracting_website_counts.get(website, 0) + 1
            )

    distracting_websites = [
        website
        for website, _ in sorted(
            distracting_website_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]
    ]

    # -------------------------------------------------
    # Format duration
    # -------------------------------------------------

    def format_duration(seconds):

        seconds = int(seconds or 0)

        hours = seconds // 3600

        minutes = (
            seconds % 3600
        ) // 60

        if hours > 0 and minutes > 0:

            return f"{hours}h {minutes}m"

        if hours > 0:

            return f"{hours}h"

        return f"{minutes}m"

    # -------------------------------------------------
    # Final organization metrics
    # -------------------------------------------------

    return {

        "active_time": active_time,

        "active_time_text":
            format_duration(active_time),

        "idle_time": idle_time,

        "idle_time_text":
            format_duration(idle_time),

        "browser_time": browser_time,

        "browser_time_text":
            format_duration(browser_time),

        "productive_time": productive_time,

        "productive_time_text":
            format_duration(productive_time),

        "non_productive_time":
            non_productive_time,

        "non_productive_time_text":
            format_duration(non_productive_time),

        "focus_score": focus_score,

        "tab_switches": tab_switches,

        "top_websites":
            top_websites,

        "top_categories":
            top_categories,

        "productive_websites":
            productive_websites,

        "distracting_websites":
            distracting_websites,
    }

# ---------------------------------------------
# Category Time Summary
# ---------------------------------------------

def get_category_time_summary(
    db: Session,
    user_id: int,
    period: str = "today"
):

    now = datetime.now()

    if period == "today":

        start_date = datetime(
            now.year,
            now.month,
            now.day
        )

    elif period == "week":

        start_date = now - timedelta(days=7)

    elif period == "month":

        start_date = now - timedelta(days=30)

    else:

        start_date = datetime.min

    categories = (

        db.query(

            ActivityLog.category,

            func.sum(ActivityLog.duration)

        )

        .filter(

            ActivityLog.user_id == user_id,

            ActivityLog.start_time >= start_date,

            ActivityLog.category.isnot(None)

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

            "category": category,

            "minutes": round((duration or 0) / 60, 2),

            "seconds": duration or 0

        }

        for category, duration in categories

    ]