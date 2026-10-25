import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers import auth
from app.routers import users
from app.routers import admin
from app.routers import activity
from app.routers import analytics
from app.routers import organization
from app.routers import ai
from app.routers import notifications
from app.routers import planner
from app.routers import translation

from app.email_service import send_email

from app.services.rag.scheduler import (
    start_rag_scheduler,
    stop_rag_scheduler,
)

from app.seed_website_categories import seed_website_categories


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Initialize default website categories.
    seed_website_categories()

    # Start existing RAG scheduler.
    start_rag_scheduler()

    yield

    # Stop existing RAG scheduler.
    stop_rag_scheduler()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="FocusGuard AI",
    version="1.0.0",
    lifespan=lifespan,
)



# ============================================================
# CORS
# ============================================================

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        (
            "http://localhost:5173,"
            "http://127.0.0.1:5173,"
            "https://focus-guard-ai-ten.vercel.app"
        ),
    ).split(",")
    if origin.strip()
]

# Add the Chrome extension origin.
extension_id = os.getenv("CHROME_EXTENSION_ID", "").strip()

if extension_id:
    extension_origin = f"chrome-extension://{extension_id}"
    if extension_origin not in cors_origins:
        cors_origins.append(extension_origin)

# Register CORS middleware only once.
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    auth.router
)

app.include_router(
    users.router
)

app.include_router(
    admin.router
)

app.include_router(
    activity.router
)

app.include_router(
    analytics.router
)

app.include_router(
    organization.router
)

app.include_router(
    ai.router
)

app.include_router(
    notifications.router
)

app.include_router(
    planner.router
)

app.include_router(
    translation.router
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message":
            "Welcome to FocusGuard AI Backend"
    }


# ============================================================
# TEST EMAIL
# ============================================================

@app.get("/send-test-email")
def send_test_email():

    success = send_email(

        recipient_email=
            "kumariaditi0406@gmail.com",

        subject=
            "FocusGuard AI Test",

        body="""
Congratulations!

Your email service is working successfully.

Regards,
FocusGuard AI
"""

    )

    if success:

        return {
            "message":
                "Email Sent Successfully"
        }

    return {
        "message":
            "Email Failed"
    }