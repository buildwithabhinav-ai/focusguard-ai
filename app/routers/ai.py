from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Organization
from app.dependencies import get_current_user
from app.schemas import ChatRequest

from app.services.analytics_service import (
    get_dashboard_metrics,
    get_organization_dashboard_metrics,
)

from app.services.llm import llm_service

from app.services.prompts import (
    build_daily_recommendation_prompt,
    build_weekly_recommendation_prompt,
    build_monthly_recommendation_prompt,
    build_chat_prompt,
)

from app.services.rag.rag_service import rag_service


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


# ============================================================
# LLM CALL WITH A CLEAN ERROR
# ============================================================

def _ask_llm_or_503(prompt: str, label: str) -> str:
    """
    Ask the LLM and turn any failure (every provider down, quota
    used up, bad key ...) into a clean HTTP 503 instead of an
    unhandled server error.
    """

    try:
        return llm_service.ask_llm(prompt)

    except Exception as error:
        print(f"{label} failed: {error}")

        raise HTTPException(
            status_code=503,
            detail=(
                "The AI assistant is temporarily "
                "unavailable. Please try again shortly."
            )
        )


# ============================================================
# RAG DATE WINDOW HELPERS
# ============================================================

def _get_rag_date_window(
    period: str,
    today: str,
) -> tuple[str, str]:
    """
    Return the historical date window that RAG is allowed to
    retrieve for the requested period.

    The current analytics period and the historical RAG period
    are intentionally separated.

    Example when today = 2026-09-22:

    today:
        2026-08-23 -> 2026-09-21

    week:
        2026-09-08 -> 2026-09-14

    month:
        2026-07-24 -> 2026-08-22
    """

    today_date = datetime.strptime(
        today,
        "%Y-%m-%d"
    ).date()

    if period == "today":
        end_date = today_date - timedelta(days=1)
        start_date = today_date - timedelta(days=30)

    elif period == "week":
        # Current analytics = rolling last 7 days.
        #
        # Historical RAG = the immediately preceding
        # 7-day period.
        end_date = today_date - timedelta(days=8)
        start_date = today_date - timedelta(days=14)

    else:
        # Current analytics = rolling last 30 days.
        #
        # Historical RAG = the immediately preceding
        # 30-day period.
        end_date = today_date - timedelta(days=31)
        start_date = today_date - timedelta(days=60)

    return (
        start_date.strftime("%Y-%m-%d"),
        end_date.strftime("%Y-%m-%d"),
    )


# ============================================================
# USER AI RECOMMENDATION
# ============================================================

@router.get("/recommendation")
def get_ai_recommendation(
    period: str = Query(
        default="today",
        pattern="^(today|week|month)$"
    ),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user_id = current_user.id

    # --------------------------------------------------------
    # GET REQUESTED PERIOD METRICS
    # --------------------------------------------------------

    metrics = get_dashboard_metrics(
        db=db,
        user_id=user_id,
        period=period
    )

    # --------------------------------------------------------
    # GET TODAY'S METRICS
    #
    # Today's metrics are used to create/update the latest
    # RAG document.
    # --------------------------------------------------------

    today_metrics = get_dashboard_metrics(
        db=db,
        user_id=user_id,
        period="today"
    )

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    # --------------------------------------------------------
    # ZERO-ACTIVITY HANDLING
    #
    # If FocusGuard has no recorded activity for today,
    # do not ask the LLM to interpret zero data.
    #
    # This deterministic response applies ONLY to "today".
    #
    # Week/month continue through the normal analytics + RAG
    # flow because their requested periods can contain
    # historical activity.
    # --------------------------------------------------------

    has_current_activity = any(
        [
            today_metrics["active_time"] > 0,
            today_metrics["idle_time"] > 0,
            today_metrics["browser_time"] > 0,
            today_metrics["productive_time"] > 0,
            today_metrics["non_productive_time"] > 0,
            today_metrics["tab_switches"] > 0,
            bool(today_metrics["top_websites"]),
            bool(today_metrics["top_categories"]),
        ]
    )

    if not has_current_activity:

        period_label = {
            "today": "today",
            "week": "the requested week",
            "month": "the requested month",
        }[period]

        return {
            "period": period,
            "generated_at": datetime.now().isoformat(),

            "active_time_seconds":
                metrics["active_time"],

            "active_time":
                metrics["active_time_text"],

            "idle_time_seconds":
                metrics["idle_time"],

            "idle_time":
                metrics["idle_time_text"],

            "browser_time_seconds":
                metrics["browser_time"],

            "browser_time":
                metrics["browser_time_text"],

            "productive_time_seconds":
                metrics["productive_time"],

            "productive_time":
                metrics["productive_time_text"],

            "non_productive_time_seconds":
                metrics["non_productive_time"],

            "non_productive_time":
                metrics["non_productive_time_text"],

            "focus_score":
                metrics["focus_score"],

            "tab_switches":
                metrics["tab_switches"],

            "top_websites":
                metrics["top_websites"],

            "top_categories":
                metrics["top_categories"],

            "productive_websites":
                metrics["productive_websites"],

            "distracting_websites":
                metrics["distracting_websites"],

            "recommendation": (
                f"FocusGuard has no recorded activity for "
                f"{period_label}, so there is not enough "
                f"recorded data to assess productivity or "
                f"provide data-based recommendations."
            ),
        }

    # --------------------------------------------------------
    # CREATE / UPDATE TODAY'S RAG SUMMARY
    # --------------------------------------------------------

    rag_document = rag_service.create_daily_summary(
        db,
        user_id=user_id,
        organization_id=getattr(
            current_user,
            "organization_id",
            None,
        ),
        date=today,
        metrics=today_metrics,
    )

    print(
        f"User RAG daily summary stored: "
        f"document_id={rag_document.id}"
    )

    # --------------------------------------------------------
    # HISTORICAL RAG DATE WINDOW
    # --------------------------------------------------------

    rag_start_date, rag_end_date = _get_rag_date_window(
        period,
        today,
    )

    # --------------------------------------------------------
    # RETRIEVE HISTORICAL USER CONTEXT
    #
    # IMPORTANT:
    #
    # Current analytics are calculated directly by the
    # analytics service.
    #
    # RAG is restricted to a historical date window.
    #
    # This prevents unrelated older documents from July/August
    # from being retrieved for a September monthly request.
    # --------------------------------------------------------

    rag_query = (
        f"Historical personal productivity patterns relevant "
        f"to a {period} productivity recommendation, "
        f"including focus score, active time, idle time, "
        f"productive time, non-productive time, "
        f"websites, categories, and tab switching."
    )

    rag_context = rag_service.retrieve_context(
        db,
        query=rag_query,
        user_id=user_id,
        document_type="daily_summary",
        exclude_date=today,
        start_date=rag_start_date,
        end_date=rag_end_date,
        limit=5,
        min_similarity=0.25,
    )

    # --------------------------------------------------------
    # BUILD EXISTING PROMPT
    # --------------------------------------------------------

    if period == "today":

        prompt = build_daily_recommendation_prompt(
            metrics["active_time_text"],
            metrics["idle_time_text"],
            metrics["browser_time_text"],
            metrics["focus_score"],
            metrics["top_websites"],
            metrics["top_categories"],
            metrics["tab_switches"],
            metrics["productive_websites"],
            metrics["distracting_websites"],
        )

    elif period == "week":

        prompt = build_weekly_recommendation_prompt(
            metrics["active_time_text"],
            metrics["idle_time_text"],
            metrics["browser_time_text"],
            metrics["focus_score"],
            metrics["top_websites"],
            metrics["top_categories"],
            metrics["tab_switches"],
            metrics["productive_websites"],
            metrics["distracting_websites"],
        )

    else:

        prompt = build_monthly_recommendation_prompt(
            metrics["active_time_text"],
            metrics["idle_time_text"],
            metrics["browser_time_text"],
            metrics["focus_score"],
            metrics["top_websites"],
            metrics["top_categories"],
            metrics["tab_switches"],
            metrics["productive_websites"],
            metrics["distracting_websites"],
        )

    # --------------------------------------------------------
    # ADD RAG CONTEXT
    # --------------------------------------------------------

    if rag_context:

        prompt = f"""
{prompt}

==================================================
HISTORICAL FOCUSGUARD CONTEXT
==================================================

{rag_context}

IMPORTANT ABOUT HISTORICAL CONTEXT:

- The historical information above comes from previous
  FocusGuard records within the explicitly selected
  historical date window.
- It is supporting context only.
- Current analytics supplied above are authoritative
  for the requested period.
- Preserve historical dates exactly as provided.
- Do not treat historical information as current-period data.
- Do not use historical values as if they belong to the
  current requested period.
- Do not invent statistics, dates, trends, or behavior.
"""

    # --------------------------------------------------------
    # DEBUG
    # --------------------------------------------------------

    print("\n========== USER RAG DATE WINDOW ==========")

    print(
        f"Period: {period}"
    )

    print(
        f"Historical start date: {rag_start_date}"
    )

    print(
        f"Historical end date: {rag_end_date}"
    )

    print(
        "\n========== USER RAG CONTEXT =========="
    )

    print(
        rag_context
        if rag_context
        else "No relevant historical user context found."
    )

    print(
        "======================================\n"
    )

    # --------------------------------------------------------
    # CALL LLM
    # --------------------------------------------------------

    recommendation = _ask_llm_or_503(
        prompt,
        "AI recommendation"
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "period": period,
        "generated_at": datetime.now().isoformat(),

        "active_time_seconds":
            metrics["active_time"],

        "active_time":
            metrics["active_time_text"],

        "idle_time_seconds":
            metrics["idle_time"],

        "idle_time":
            metrics["idle_time_text"],

        "browser_time_seconds":
            metrics["browser_time"],

        "browser_time":
            metrics["browser_time_text"],

        "productive_time_seconds":
            metrics["productive_time"],

        "productive_time":
            metrics["productive_time_text"],

        "non_productive_time_seconds":
            metrics["non_productive_time"],

        "non_productive_time":
            metrics["non_productive_time_text"],

        "focus_score":
            metrics["focus_score"],

        "tab_switches":
            metrics["tab_switches"],

        "top_websites":
            metrics["top_websites"],

        "top_categories":
            metrics["top_categories"],

        "productive_websites":
            metrics["productive_websites"],

        "distracting_websites":
            metrics["distracting_websites"],

        "recommendation":
            recommendation
    }


# ============================================================
# ORGANIZATION AI RECOMMENDATION
# ============================================================

@router.get("/organization-recommendation")
def get_organization_recommendation(
    organization_id: int,

    period: str = Query(
        default="today",
        pattern="^(today|week|month)$"
    ),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)
):

    # --------------------------------------------------------
    # SUPER ADMIN ONLY
    # --------------------------------------------------------

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(
            status_code=403,
            detail=(
                "Only Super Admin can access "
                "organization AI insights."
            )
        )

    # --------------------------------------------------------
    # VERIFY ORGANIZATION
    # --------------------------------------------------------

    organization = (
        db.query(Organization)
        .filter(
            Organization.id == organization_id,
            Organization.is_active == True
        )
        .first()
    )

    if organization is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Organization not found or inactive."
            )
        )

    # --------------------------------------------------------
    # CURRENT ORGANIZATION METRICS
    # --------------------------------------------------------

    metrics = get_organization_dashboard_metrics(
        db=db,
        organization_id=organization_id,
        period=period
    )

    # --------------------------------------------------------
    # TODAY'S ORGANIZATION METRICS
    #
    # Used to create/update today's historical RAG document.
    # --------------------------------------------------------

    today_metrics = get_organization_dashboard_metrics(
        db=db,
        organization_id=organization_id,
        period="today"
    )

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    # --------------------------------------------------------
    # CREATE / UPDATE TODAY'S ORGANIZATION RAG SUMMARY
    # --------------------------------------------------------

    rag_document = (
        rag_service.create_organization_daily_summary(
            db,
            organization_id=organization_id,
            date=today,
            metrics=today_metrics,
        )
    )

    print(
        f"Organization RAG daily summary stored: "
        f"document_id={rag_document.id}"
    )

    # --------------------------------------------------------
    # ORGANIZATION RAG DATE WINDOW
    # --------------------------------------------------------

    rag_start_date, rag_end_date = _get_rag_date_window(
        period,
        today,
    )

    # --------------------------------------------------------
    # RETRIEVE HISTORICAL ORGANIZATION CONTEXT
    #
    # IMPORTANT:
    #
    # This is scoped directly to organization_id.
    #
    # Individual user documents are never retrieved here.
    # --------------------------------------------------------

    rag_query = (
        f"Historical organization productivity patterns "
        f"relevant to a {period} organization productivity "
        f"recommendation, including focus score, active time, "
        f"idle time, productive time, non-productive time, "
        f"websites, categories, and tab switching."
    )

    rag_context = rag_service.retrieve_context(
        db,
        query=rag_query,
        organization_id=organization_id,
        document_type="organization_daily_summary",
        exclude_date=today,
        start_date=rag_start_date,
        end_date=rag_end_date,
        limit=5,
        min_similarity=0.25,
    )

    # ========================================================
    # ORGANIZATION PROMPT
    # ========================================================

    prompt = f"""
You are FocusGuard AI.

You are analyzing aggregated productivity data for an
organization managed by a Super Admin.

Your response must be based only on the organization-level
data provided below.

==================================================
CURRENT ORGANIZATION METRICS
==================================================

Organization:
{organization.organization_name}

Period:
{period}

Active Time:
{metrics["active_time_text"]}

Idle Time:
{metrics["idle_time_text"]}

Browser Time:
{metrics["browser_time_text"]}

Productive Time:
{metrics["productive_time_text"]}

Non-Productive Time:
{metrics["non_productive_time_text"]}

Focus Score:
{metrics["focus_score"]}%

Tab Switches:
{metrics["tab_switches"]}

Top Websites:
{", ".join(metrics["top_websites"]) or "None"}

Top Categories:
{", ".join(metrics["top_categories"]) or "None"}

Productive Websites:
{", ".join(metrics["productive_websites"]) or "None"}

Distracting Websites:
{", ".join(metrics["distracting_websites"]) or "None"}


==================================================
HISTORICAL ORGANIZATION CONTEXT
==================================================

{rag_context if rag_context else "No relevant historical organization context is available."}


==================================================
IMPORTANT INTERPRETATION RULES
==================================================

1. CURRENT METRICS ARE AUTHORITATIVE

The current organization metrics above are the primary
source for the requested period.

Historical RAG information is supporting context only.

Do not replace current metrics with historical information.


2. PRODUCTIVE TIME VS PRODUCTIVE WEBSITES

"Productive Time" is an aggregated time metric.

"Productive Websites" is a list of websites that have been
classified as productive.

Do NOT assume that all browsing was productive merely because
the productive websites list contains one or more websites.

Do NOT say:

"All browsing was productive."

unless the supplied data explicitly proves that statement.


3. DISTRACTING WEBSITES

A website appearing in the "Distracting Websites" list means
that website has been classified as distracting.

An empty distracting-websites list does NOT automatically prove
that there were no distractions of any kind.

Use the wording carefully.


4. ACTIVE TIME AND IDLE TIME

Use Active Time and Idle Time as supplied.

Do not invent explanations for why users were idle.

Do not assume that idle time means users were unproductive,
away from work, or intentionally inactive unless the data
supports that conclusion.


5. FOCUS SCORE

Use the supplied Focus Score.

Do not recalculate it.

Do not invent another focus-score formula.


6. HISTORICAL CONTEXT

Historical RAG records contain previous organization-level
metrics.

Preserve historical dates exactly as provided.

Do not present historical information as today's information.

If only one or two historical dates are available, describe
them as historical observations.

Do NOT claim a long-term trend unless multiple historical
records actually support that trend.


7. NO INDIVIDUAL USER INFORMATION

Do not identify individual users.

Do not expose individual user activity.

Do not infer individual employee behavior.

Only discuss organization-level aggregated information.


8. DO NOT INVENT FEATURES

Do not recommend features that FocusGuard already has as if
they need to be built.

FocusGuard already includes:

- ACTIVE / IDLE status tracking
- automatic activity tracking
- browser activity tracking
- tab-switch tracking
- website categorization
- focus planner
- focus monitoring
- AI recommendations
- notifications/reminders

Therefore, do not recommend building automatic idle detection,
basic activity tracking, tab tracking, website categorization,
or similar functionality as a new feature.


9. RECOMMENDATIONS MUST BE GROUNDED

Recommendations should be practical actions that can be taken
using the information and capabilities already available.

Examples include:

- reviewing periods of high idle time
- encouraging structured focus sessions
- using the Focus Planner
- reducing unnecessary tab switching
- reviewing frequently used website categories
- identifying patterns that may require workflow changes

Only mention an action when it is relevant to the supplied
organization metrics.

Do not invent policies, thresholds, features, or statistics.


10. DO NOT OVERINTERPRET

Do not claim that a metric proves a specific cause.

For example, high idle time may indicate periods of inactivity,
but do not claim why that inactivity occurred unless the data
supports it.


==================================================
YOUR TASK
==================================================

Generate a concise organization-level productivity insight.

Include exactly these sections:

1. Overall Productivity Observation
2. Positive Productivity Behavior
3. Main Productivity Concern
4. Historical Context
5. Practical Recommendation


SECTION 1:

Describe the organization's current productivity using the
provided metrics.


SECTION 2:

Identify one positive behavior supported by the data.

Do not assume that productive websites represent all browsing.


SECTION 3:

Identify the most relevant concern supported by the metrics.

Do not invent a cause.


SECTION 4:

Mention historical context only when it is relevant.

If historical records do not support a clear pattern, say that
there is limited historical evidence rather than inventing a
trend.


SECTION 5:

Give one practical recommendation based directly on the
available metrics and existing FocusGuard capabilities.

Do not recommend building functionality that already exists.

Do not invent a new feature.


==================================================
FINAL RESPONSE REQUIREMENTS
==================================================

- Keep the response concise and professional.
- Use organization-level information only.
- Do not expose individual users.
- Do not invent statistics.
- Do not invent dates.
- Do not invent percentages.
- Do not invent time values.
- Do not invent trends.
- Do not invent causes.
- Do not recalculate metrics.
- Preserve historical dates exactly.
- Clearly distinguish current metrics from historical context.
- End with a complete sentence.
"""

    # --------------------------------------------------------
    # DEBUG
    # --------------------------------------------------------

    print(
        "\n========== ORGANIZATION RAG DATE WINDOW =========="
    )

    print(
        f"Period: {period}"
    )

    print(
        f"Historical start date: {rag_start_date}"
    )

    print(
        f"Historical end date: {rag_end_date}"
    )

    print(
        "\n========== ORGANIZATION RAG CONTEXT =========="
    )

    print(
        rag_context
        if rag_context
        else (
            "No relevant historical organization "
            "context found."
        )
    )

    print(
        "==============================================\n"
    )

    # --------------------------------------------------------
    # CALL LLM
    # --------------------------------------------------------

    recommendation = _ask_llm_or_503(
        prompt,
        "Organization AI recommendation"
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "organization_id":
            organization_id,

        "organization_name":
            organization.organization_name,

        "period":
            period,

        "generated_at":
            datetime.now().isoformat(),

        "active_time_seconds":
            metrics["active_time"],

        "active_time":
            metrics["active_time_text"],

        "idle_time_seconds":
            metrics["idle_time"],

        "idle_time":
            metrics["idle_time_text"],

        "browser_time_seconds":
            metrics["browser_time"],

        "browser_time":
            metrics["browser_time_text"],

        "productive_time_seconds":
            metrics["productive_time"],

        "productive_time":
            metrics["productive_time_text"],

        "non_productive_time_seconds":
            metrics["non_productive_time"],

        "non_productive_time":
            metrics["non_productive_time_text"],

        "focus_score":
            metrics["focus_score"],

        "tab_switches":
            metrics["tab_switches"],

        "top_websites":
            metrics["top_websites"],

        "top_categories":
            metrics["top_categories"],

        "productive_websites":
            metrics["productive_websites"],

        "distracting_websites":
            metrics["distracting_websites"],

        "recommendation":
            recommendation
    }


# ============================================================
# AI CHAT
# ============================================================

MAX_CHAT_HISTORY_MESSAGES = 6


@router.post("/chat")
def ai_chat(
    request: Optional[ChatRequest] = Body(None),
    message: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # --------------------------------------------------------
    # BASIC VALIDATION
    #
    # The frontend sends the message in the JSON body.
    # The query parameter is still accepted for older clients.
    # --------------------------------------------------------

    if request is not None:
        message = request.message

    if not message or not message.strip():

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    user_message = message.strip()

    # Topic restrictions are enforced by the chat prompt.
    # A keyword pre-check used to reject valid questions such
    # as "How can I improve?" and anything not in English.

    # --------------------------------------------------------
    # CURRENT USER METRICS
    # --------------------------------------------------------

    metrics = get_dashboard_metrics(
        db=db,
        user_id=current_user.id,
        period="today"
    )

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    # --------------------------------------------------------
    # CHAT HISTORICAL RAG DATE WINDOW
    #
    # Chat can ask about historical patterns, so we allow
    # the previous 30 days while excluding today.
    # --------------------------------------------------------

    rag_start_date, rag_end_date = _get_rag_date_window(
        "today",
        today,
    )

    # --------------------------------------------------------
    # HISTORICAL RAG CONTEXT
    # --------------------------------------------------------

    rag_query = (
        f"Historical FocusGuard productivity information "
        f"relevant to this user question: "
        f"{user_message}"
    )

    rag_context = rag_service.retrieve_context(
        db,
        query=rag_query,
        user_id=current_user.id,
        document_type="daily_summary",
        exclude_date=today,
        start_date=rag_start_date,
        end_date=rag_end_date,
        limit=5,
        min_similarity=0.25,
    )

    # --------------------------------------------------------
    # EXISTING CHAT PROMPT
    # --------------------------------------------------------

    prompt = build_chat_prompt(
        user_message,
        metrics
    )

    # --------------------------------------------------------
    # ADD RAG CONTEXT
    # --------------------------------------------------------

    if rag_context:

        prompt = f"""
{prompt}

==================================================
HISTORICAL FOCUSGUARD CONTEXT
==================================================

{rag_context}

IMPORTANT:

- Historical context is supporting information only.
- Today's metrics are authoritative for current activity.
- Preserve historical dates exactly.
- Do not treat historical information as today's data.
- Do not treat historical information as current-period data.
- Do not invent statistics, dates, trends, or behavior.
"""

    # --------------------------------------------------------
    # RECENT CONVERSATION
    #
    # Lets the assistant understand follow-up questions.
    # --------------------------------------------------------

    history = (
        request.history[-MAX_CHAT_HISTORY_MESSAGES:]
        if request is not None
        else []
    )

    if history:
        conversation = "\n".join(
            f"{'User' if item.sender == 'user' else 'Assistant'}: "
            f"{item.text}"
            for item in history
        )

        prompt = f"""
{prompt}

==================================================
RECENT CONVERSATION (oldest first)
==================================================

{conversation}

Use the recent conversation only to understand follow-up
questions. Answer the USER QUESTION above.
"""

    # The frontend translates the reply into the user's
    # selected language, so the reply must be in English.
    prompt += """

LANGUAGE:
The user may write in any language. Always reply in English.
"""

    # --------------------------------------------------------
    # DEBUG
    # --------------------------------------------------------

    print(
        "\n========== CHAT RAG DATE WINDOW =========="
    )

    print(
        f"Historical start date: {rag_start_date}"
    )

    print(
        f"Historical end date: {rag_end_date}"
    )

    print(
        "\n========== CHAT RAG CONTEXT =========="
    )

    print(
        rag_context
        if rag_context
        else "No relevant historical context found."
    )

    print(
        "======================================\n"
    )

    # --------------------------------------------------------
    # LLM
    # --------------------------------------------------------

    response = _ask_llm_or_503(
        prompt,
        "AI chat"
    )

    return {
        "response": response
    }