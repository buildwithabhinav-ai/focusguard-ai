import logging
import smtplib
import socket
import ssl
from email.message import EmailMessage

from dotenv import dotenv_values, find_dotenv

from app.config import (
    EMAIL_ADDRESS,
    EMAIL_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURITY,
    SUPPORT_EMAIL,
)


logger = logging.getLogger(__name__)

SMTP_TIMEOUT_SECONDS = 15

# Values copied from .env.example that mean "not configured yet".
PLACEHOLDER_VALUES = {
    "",
    "your-email@example.com",
    "your-email-password",
}


# -------------------------------------------------
# Mail settings
#
# EMAIL_ADDRESS / EMAIL_PASSWORD are read from .env every
# time a mail is sent, so a new login takes effect at once,
# without restarting the backend. A value in .env that is not
# a placeholder wins over the value loaded at start-up; real
# environment variables still work. SMTP_* are read at start-up.
# -------------------------------------------------

def _is_placeholder(value) -> bool:

    return (value or "").strip() in PLACEHOLDER_VALUES


def _setting(name: str, startup_value, live: bool = False):

    # live=True: the value in .env is looked up again now (used for the
    # login, the part people edit while setting things up).
    if live:

        file_value = dotenv_values(find_dotenv(usecwd=True)).get(name)

        if file_value is not None and not _is_placeholder(file_value):

            return file_value.strip()

    return (startup_value or "").strip() if startup_value is not None else ""


def mail_settings() -> dict:

    password = _setting("EMAIL_PASSWORD", EMAIL_PASSWORD, live=True)

    return {

        "address": _setting("EMAIL_ADDRESS", EMAIL_ADDRESS, live=True),

        # Google shows App Passwords as "abcd efgh ijkl mnop"
        "password": password.replace(" ", ""),

        "host": _setting("SMTP_HOST", SMTP_HOST) or "smtp.gmail.com",

        "port": int(_setting("SMTP_PORT", str(SMTP_PORT)) or 587),

        "security": (
            _setting("SMTP_SECURITY", SMTP_SECURITY) or "starttls"
        ).lower(),

    }


# -------------------------------------------------
# Configuration Check
# -------------------------------------------------

def email_is_configured() -> bool:

    settings = mail_settings()

    return (
        not _is_placeholder(settings["address"])
        and not _is_placeholder(settings["password"])
    )


# -------------------------------------------------
# Generic Email Sender
#
# Returns (success, error_message).
# error_message is a short, human-readable reason
# when success is False.
# -------------------------------------------------

def send_email_detailed(

    recipient_email: str,

    subject: str,

    body: str

):

    if not email_is_configured():

        logger.warning(
            "E-mail not sent: EMAIL_ADDRESS / EMAIL_PASSWORD "
            "are not configured in .env."
        )

        return False, (
            "E-mail is not configured on the server. "
            "Run ./venv/bin/python setup_email.py (or set EMAIL_ADDRESS and "
            "EMAIL_PASSWORD in .env; for Gmail use an App Password)."
        )

    settings = mail_settings()

    message = EmailMessage()

    message["From"] = settings["address"]

    message["To"] = recipient_email

    message["Subject"] = subject

    message.set_content(body)

    try:

        if settings["security"] == "ssl":

            smtp = smtplib.SMTP_SSL(
                settings["host"],
                settings["port"],
                timeout=SMTP_TIMEOUT_SECONDS,
                context=ssl.create_default_context()
            )

        else:

            smtp = smtplib.SMTP(
                settings["host"],
                settings["port"],
                timeout=SMTP_TIMEOUT_SECONDS
            )

        with smtp:

            if settings["security"] == "starttls":

                smtp.starttls(
                    context=ssl.create_default_context()
                )

            if settings["security"] != "none":

                smtp.login(
                    settings["address"],
                    settings["password"]
                )

            smtp.send_message(message)

        return True, None

    except smtplib.SMTPAuthenticationError:

        error = (
            "The mail server rejected the e-mail login. "
            "For Gmail, turn on 2-Step Verification and use a "
            "16-character App Password in EMAIL_PASSWORD."
        )

    except smtplib.SMTPRecipientsRefused:

        error = "The mail server refused the recipient address."

    except (socket.timeout, TimeoutError):

        error = (
            f"Timed out while connecting to the mail server "
            f"{settings['host']}:{settings['port']}."
        )

    except (OSError, smtplib.SMTPException) as exc:

        error = f"Could not send the e-mail: {exc}"

    logger.error("E-mail to %s failed: %s", recipient_email, error)

    return False, error


# -------------------------------------------------
# Backwards-compatible boolean wrapper
# -------------------------------------------------

def send_email(

    recipient_email: str,

    subject: str,

    body: str

):

    success, _ = send_email_detailed(

        recipient_email,

        subject,

        body

    )

    return success


# -------------------------------------------------
# Invitation Email
#
# Returns (success, error_message).
# -------------------------------------------------

def send_invitation_email(

    recipient_email: str,

    recipient_name: str,

    invitation_link: str,

    organization_name: str | None = None

):

    subject = "FocusGuard AI - Sub Admin Invitation"

    organization_line = (
        f' for the organization "{organization_name}"'
        if organization_name
        else ""
    )

    body = f"""
Hello {recipient_name},

You have been invited to join FocusGuard AI as a Sub Admin{organization_line}.

Please click the link below to set your password and activate your account:

{invitation_link}

This invitation is valid for 24 hours and can be used once.
If you were not expecting it, you can ignore this e-mail.

Need help or a new link? Write to us at {SUPPORT_EMAIL}

Regards,
FocusGuard AI Team
"""

    return send_email_detailed(

        recipient_email,

        subject,

        body

    )


# -------------------------------------------------
# Welcome Email (sent after an invitation is accepted)
# -------------------------------------------------

def send_welcome_email(

    recipient_email: str,

    recipient_name: str,

    organization_name: str,

    login_url: str

):

    subject = "Welcome to FocusGuard AI"

    body = f"""
Hello {recipient_name},

Your Sub Admin account for "{organization_name}" is now active.

You can sign in here:

{login_url}

Questions? Our support team is at {SUPPORT_EMAIL}

Regards,
FocusGuard AI Team
"""

    return send_email_detailed(

        recipient_email,

        subject,

        body

    )
