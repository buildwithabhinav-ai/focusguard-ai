from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_current_user
from app.schemas import NotificationResponse
from app.services.notification_service import notification_service
from app.services.translation_service import TranslationService

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ---------------------------------------
# Database Dependency
# ---------------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ---------------------------------------
# Get All Notifications
# ---------------------------------------

@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def get_notifications(

    language: str = "en",

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    notifications = notification_service.get_notifications(

        db=db,

        user_id=current_user.id

    )

    translated_notifications = []

    for notification in notifications:

        translated_notifications.append({

            "id": notification.id,

            "title": TranslationService.translate_dynamic_message(

                db=db,

                message=notification.title,

                language=language

            ),

            "message": TranslationService.translate_dynamic_message(

                db=db,

                message=notification.message,

                language=language

            ),

            "notification_type": notification.notification_type,

            "is_read": notification.is_read,

            "created_at": notification.created_at

        })

    return translated_notifications


# ---------------------------------------
# Get Unread Notification Count
# ---------------------------------------

@router.get("/unread-count")
def get_unread_notification_count(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    count = notification_service.get_unread_count(

        db=db,

        user_id=current_user.id

    )

    return {
        "unread_count": count
    }


# ---------------------------------------
# Get Latest Unread Notification
# ---------------------------------------

@router.get("/latest")
def get_latest_notification(

    language: str = "en",

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    notification = notification_service.get_latest_unread_notification(

        db=db,

        user_id=current_user.id

    )

    if notification is None:

        return {

            "notification": None,

            "message": TranslationService.get_translation(

                db,

                "NO_NOTIFICATION",

                language

            )

        }

    return {

        "id": notification.id,

        "title": TranslationService.translate_dynamic_message(

            db=db,

            message=notification.title,

            language=language

        ),

        "message": TranslationService.translate_dynamic_message(

            db=db,

            message=notification.message,

            language=language

        ),

        "notification_type": notification.notification_type,

        "is_read": notification.is_read,

        "created_at": notification.created_at

    }


# ---------------------------------------
# Mark Notification As Read
# ---------------------------------------

@router.patch("/{notification_id}/read")
def mark_notification_as_read(

    notification_id: int,

    language: str = "en",

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    notification = notification_service.mark_as_read(

        db=db,

        notification_id=notification_id,

        user_id=current_user.id

    )

    if notification is None:

        raise HTTPException(

            status_code=404,

            detail=TranslationService.get_translation(

                db,

                "NOTIFICATION_NOT_FOUND",

                language

            )

        )

    return {

        "message": TranslationService.get_translation(

            db,

            "NOTIFICATION_MARKED_READ",

            language

        )

    }


# ---------------------------------------
# Mark All Notifications As Read
# ---------------------------------------

@router.patch("/read-all")
def mark_all_notifications_as_read(

    language: str = "en",

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    notification_service.mark_all_as_read(

        db=db,

        user_id=current_user.id

    )

    return {

        "message": TranslationService.get_translation(

            db,

            "ALL_NOTIFICATIONS_MARKED_READ",

            language

        )

    }