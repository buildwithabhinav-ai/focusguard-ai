import os

from dotenv import load_dotenv


load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)


ALGORITHM = os.getenv(
    "ALGORITHM"
)


ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES"
    )
)


DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


EMAIL_ADDRESS = os.getenv(
    "EMAIL_ADDRESS"
)


EMAIL_PASSWORD = os.getenv(
    "EMAIL_PASSWORD"
)


# SMTP server used for invitation / notification e-mails.
# SMTP_SECURITY: "starttls" (port 587, Gmail default), "ssl" (port 465) or "none" (local test server).
SMTP_HOST = os.getenv(
    "SMTP_HOST",
    "smtp.gmail.com"
)

SMTP_PORT = int(
    os.getenv(
        "SMTP_PORT",
        "587"
    )
)

SMTP_SECURITY = os.getenv(
    "SMTP_SECURITY",
    "starttls"
).strip().lower()


# Where users are sent for help (shown in e-mails and error messages).
SUPPORT_EMAIL = os.getenv(
    "SUPPORT_EMAIL",
    "support.focusguardai@gmail.com"
).strip()


# Base address of the web app, used to build links inside e-mails.
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
).strip().rstrip("/")


REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv(
        "REFRESH_TOKEN_EXPIRE_DAYS"
    )
)


GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)


GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)


OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY"
)


DEFAULT_LLM = os.getenv(
    "DEFAULT_LLM",
    "groq"
)


SARVAM_API_KEY = os.getenv(
    "SARVAM_API_KEY"
)