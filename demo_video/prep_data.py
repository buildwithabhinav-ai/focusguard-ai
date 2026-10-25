"""Prepares real data for the feature shots: today's plan for demo.employee, a live activity state and notifications.

Usage: venv/bin/python demo_video/prep_data.py on|off
  on  -> latest activity matches the planned category (ON TRACK)
  off -> latest activity is Social Media (OFF TRACK)
"""
import sys
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import ActivityLog, FocusPlan, FocusPlanItem, Notification, User
from app.services.notification_rules import NotificationRules

state = sys.argv[1] if len(sys.argv) > 1 else "on"
db = SessionLocal()
user = db.query(User).filter(User.email == "demo.employee@example.com").one()
now = datetime.now(ZoneInfo("Asia/Kolkata")).replace(tzinfo=None)
today = datetime.combine(now.date(), time.min)

db.query(FocusPlan).filter(FocusPlan.user_id == user.id, FocusPlan.plan_date >= today).delete()
db.commit()


def hm(dt):
    return dt.time().replace(second=0, microsecond=0)


start = now - timedelta(minutes=20)
items = [
    ("Development", 90, hm(start), hm(start + timedelta(minutes=90))),
    ("Learning", 45, hm(start + timedelta(minutes=90)), hm(start + timedelta(minutes=135))),
    ("Documentation", 30, hm(start + timedelta(minutes=135)), hm(start + timedelta(minutes=165))),
]
plan = FocusPlan(user_id=user.id, plan_date=today, total_goal_minutes=sum(i[1] for i in items))
db.add(plan)
db.flush()
for cat, mins, s, e in items:
    db.add(FocusPlanItem(plan_id=plan.id, category=cat, planned_minutes=mins, start_time=s, end_time=e))

if state == "on":
    row = dict(url="https://github.com/focusguard/ai", tab_title="focusguard / ai - Pull requests", application="Chrome",
               website_name="GitHub", category="Development", productivity="PRODUCTIVE")
else:
    row = dict(url="https://www.instagram.com/", tab_title="Instagram", application="Chrome",
               website_name="Instagram", category="Social Media", productivity="NON_PRODUCTIVE")
log = ActivityLog(user_id=user.id, start_time=datetime.now(), **row)
cols = {c.name for c in ActivityLog.__table__.columns}
for k in ("duration", "end_time"):
    if k in cols and k == "duration":
        log.duration = 60
db.add(log)
db.commit()
print("plan", plan.id, items[0][2], items[0][3], "state", state)

if "--notify" in sys.argv:
    db.query(Notification).filter(Notification.user_id == user.id, Notification.notification_type != "USER_CREATED").delete()
    db.commit()
    NotificationRules.evaluate(db=db, user_id=user.id)
    for n in db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()):
        print("notif", n.notification_type, "|", n.title, "|", n.message[:70])
