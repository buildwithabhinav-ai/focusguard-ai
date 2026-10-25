from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models import Notification


class NotificationService:

    @staticmethod
    def notification_exists(
        db: Session,
        user_id: int,
        notification_type: str,
        within_minutes: int = 10
    ):

        cutoff_time = datetime.now() - timedelta(minutes=within_minutes)

        notification = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.notification_type == notification_type,
                Notification.created_at >= cutoff_time,
                Notification.is_read == False
            )
            .first()
        )

        return notification is not None

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str
    ):

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        return notification

    @staticmethod
    def get_notifications(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .all()
        )


    @staticmethod
    def get_unread_count(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .count()
        )

    @staticmethod
    def get_latest_unread_notification(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .order_by(Notification.created_at.desc())
            .first()
        )

    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int,
        user_id: int
    ):

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.user_id == user_id
            )
            .first()
        )

        if not notification:
            return None

        notification.is_read = True

        db.commit()
        db.refresh(notification)

        return notification

    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_id: int
    ):

        notifications = (
            db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .all()
        )

        for notification in notifications:
            notification.is_read = True

        db.commit()

        return {
            "message": "All notifications marked as read."
        }


notification_service = NotificationService()