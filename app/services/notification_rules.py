from datetime import datetime

from sqlalchemy.orm import Session

from app.models import UserStatusLog
from app.services.analytics_service import get_dashboard_metrics
from app.services.notification_service import notification_service


BREAK_THRESHOLD = 20              # 20 seconds
NON_PRODUCTIVE_THRESHOLD = 20     # 20 seconds
IDLE_THRESHOLD = 20               # 20 seconds

# Reset continuous work after 5 minutes idle
CONTINUOUS_IDLE_RESET = 5


class NotificationRules:

    @staticmethod
    def check_break_reminder(
        db: Session,
        user_id: int
    ):

        today = datetime.now().replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )

        logs = (
            db.query(UserStatusLog)
            .filter(
                UserStatusLog.user_id == user_id,
                UserStatusLog.start_time >= today
            )
            .order_by(UserStatusLog.start_time.asc())
            .all()
        )

        continuous_active = 0

        for log in logs:

            if log.duration is not None:

                duration = log.duration

            elif log.status == "ACTIVE":

                duration = int(
                    (datetime.now() - log.start_time).total_seconds()
                )

            else:

                duration = 0

            if log.status == "ACTIVE":

                continuous_active += duration

            elif log.status == "IDLE":

                if duration >= CONTINUOUS_IDLE_RESET:

                    continuous_active = 0

            if continuous_active >= BREAK_THRESHOLD:

                if not notification_service.notification_exists(

                    db=db,

                    user_id=user_id,

                    notification_type="BREAK_REMINDER"

                ):

                    notification_service.create_notification(

                        db=db,

                        user_id=user_id,

                        title="Time for a Break",

                        message="You've been working continuously for a long time. Take a short break and stretch.",

                        notification_type="BREAK_REMINDER"

                    )

                break

    @staticmethod
    def check_non_productive_activity(
        db: Session,
        user_id: int
    ):

        metrics = get_dashboard_metrics(

            db=db,

            user_id=user_id,

            period="today"

        )

        if metrics["non_productive_time"] >= NON_PRODUCTIVE_THRESHOLD:

            if not notification_service.notification_exists(

                db=db,

                user_id=user_id,

                notification_type="NON_PRODUCTIVE_ACTIVITY"

            ):

                notification_service.create_notification(

                    db=db,

                    user_id=user_id,

                    title="Reduce Distractions",

                    message="You've spent considerable time on non-productive websites or applications. Consider switching back to productive work.",

                    notification_type="NON_PRODUCTIVE_ACTIVITY"

                )

    @staticmethod
    def check_idle_time(
        db: Session,
        user_id: int
    ):

        metrics = get_dashboard_metrics(

            db=db,

            user_id=user_id,

            period="today"

        )

        if metrics["idle_time"] >= IDLE_THRESHOLD:

            if not notification_service.notification_exists(

                db=db,

                user_id=user_id,

                notification_type="IDLE_ALERT"

            ):

                notification_service.create_notification(

                    db=db,

                    user_id=user_id,

                    title="Welcome Back",

                    message="You've been idle for quite some time. Let's continue your work!",

                    notification_type="IDLE_ALERT"

                )

    @staticmethod
    def evaluate(
        db: Session,
        user_id: int
    ):

        NotificationRules.check_break_reminder(

            db=db,

            user_id=user_id

        )

        NotificationRules.check_non_productive_activity(

            db=db,

            user_id=user_id

        )

        NotificationRules.check_idle_time(

            db=db,

            user_id=user_id

        )


notification_rules = NotificationRules()