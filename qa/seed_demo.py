"""Create a fresh set of demo accounts for manual QA.

Run from the project root:  ./venv/bin/python qa/seed_demo.py

Needs the backend on http://127.0.0.1:8000. Everything goes through the real API,
except the Super Admin (the API only allows the first user to self-register as one)
and the Sub Admin invitations (the e-mail step is bypassed by signing the token locally).
Re-running is safe: existing demo accounts are skipped.
Add --reset-data to wipe and re-create the sample browsing history / focus plans of the demo accounts.
"""
import sys
from datetime import datetime, timedelta
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal  # noqa: E402
from app.models import (ActivityLog, FocusPlan, FocusPlanItem, Organization, TabSwitchLog, User,  # noqa: E402
                        UserStatus, UserStatusLog)
from app.security import create_invitation_token, hash_password  # noqa: E402

API = "http://127.0.0.1:8000"
PASSWORD = "Demo@12345"

SUPER = ("Demo Super Admin", "demo.superadmin@example.com")
ORGS = {
    "A": "Demo Corp Alpha",
    "B": "Demo Corp Beta",
}
SUBADMINS = {
    "A": ("Demo Sub Admin Alpha", "demo.subadmin@example.com"),
    "B": ("Demo Sub Admin Beta", "demo.subadmin.beta@example.com"),
}
EMPLOYEES = {
    "A": [
        ("Demo Employee Alpha One", "demo.employee@example.com"),
        ("Demo Employee Alpha Two", "demo.employee2@example.com"),
    ],
    "B": [("Demo Employee Beta One", "demo.employee.beta@example.com")],
}
PUBLIC_USER = ("Demo Standalone User", "demo.user@example.com")


def login(email, password=PASSWORD):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    return {"Authorization": "Bearer " + r.json()["access_token"]}


def ensure_super_admin():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == SUPER[1]).first():
            db.add(User(full_name=SUPER[0], email=SUPER[1], hashed_password=hash_password(PASSWORD),
                        age=35, occupation="Platform Owner", role="SUPER_ADMIN", is_active=True))
            db.commit()
            print("created super admin")
    finally:
        db.close()


def ensure_org(headers, name):
    orgs = requests.get(f"{API}/organizations/", headers=headers).json()
    for o in orgs:
        if o["organization_name"] == name:
            return o["id"]
    r = requests.post(f"{API}/organizations/", json={"organization_name": name}, headers=headers)
    r.raise_for_status()
    print("created org", name)
    return r.json()["id"]


def ensure_subadmin(org_id, name, email):
    db = SessionLocal()
    try:
        exists = db.query(User).filter(User.email == email).first()
    finally:
        db.close()
    if exists:
        return
    token = create_invitation_token({"email": email, "name": name, "role": "SUB_ADMIN",
                                     "organization_id": org_id})
    r = requests.post(f"{API}/admin/accept-invitation", params={"token": token},
                      json={"password": PASSWORD})
    r.raise_for_status()
    print("created sub admin", email)


def ensure_employee(sub_headers, name, email):
    r = requests.post(f"{API}/organizations/users", headers=sub_headers,
                      json={"full_name": name, "email": email, "password": PASSWORD,
                            "age": 28, "occupation": "Analyst"})
    if r.status_code == 400 and "already" in r.text:
        return
    r.raise_for_status()
    print("created employee", email)


def ensure_public_user():
    r = requests.post(f"{API}/auth/register-user",
                      json={"full_name": PUBLIC_USER[0], "email": PUBLIC_USER[1], "password": PASSWORD,
                            "age": 24, "occupation": "Student"})
    if r.status_code == 400 and "already" in r.text:
        return
    r.raise_for_status()
    print("created public user", PUBLIC_USER[1])


SITES = [
    ("https://github.com/demo/repo", "GitHub", "github.com", "Development", "Productive", 50 * 60),
    ("https://stackoverflow.com/q/1", "Stack Overflow", "stackoverflow.com", "Development", "Productive", 25 * 60),
    ("https://docs.python.org/3/", "Python Docs", "docs.python.org", "Documentation", "Productive", 20 * 60),
    ("https://mail.google.com/", "Gmail", "gmail.com", "Communication", "Productive", 15 * 60),
    ("https://www.youtube.com/watch?v=x", "YouTube", "youtube.com", "Entertainment", "Non Productive", 30 * 60),
    ("https://www.instagram.com/", "Instagram", "instagram.com", "Social Media", "Non Productive", 12 * 60),
]


def reset_data(email):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            return
        plan_ids = [p.id for p in db.query(FocusPlan).filter(FocusPlan.user_id == user.id)]
        if plan_ids:
            db.query(FocusPlanItem).filter(FocusPlanItem.plan_id.in_(plan_ids)).delete(synchronize_session=False)
        db.query(FocusPlan).filter(FocusPlan.user_id == user.id).delete()
        for model in (ActivityLog, TabSwitchLog, UserStatusLog, UserStatus):
            db.query(model).filter(model.user_id == user.id).delete()
        db.commit()
    finally:
        db.close()


TAB_PAIRS = [("github.com", "stackoverflow.com"), ("stackoverflow.com", "youtube.com"), ("youtube.com", "gmail.com"),
             ("gmail.com", "github.com"), ("github.com", "instagram.com")]


def ensure_activity(email):
    """Give the account a week of browsing history so dashboards and reports show data."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if db.query(ActivityLog).filter(ActivityLog.user_id == user.id).count() > 5:
            return
        for day in range(7):
            base = (datetime.now() - timedelta(days=day)).replace(hour=9, minute=0, second=0, microsecond=0)
            cursor = base
            day_total = 0
            for url, title, _domain, cat, prod, secs in SITES:
                # vary durations per day so the weekly chart is not flat
                secs = int(secs * (0.6 + 0.1 * ((day + len(title)) % 5)))
                end = cursor + timedelta(seconds=secs)
                host = url.split("/")[2].replace("www.", "")
                db.add(ActivityLog(user_id=user.id, url=url, tab_title=title, application="Chrome",
                                   website_name=host.split(".")[0].capitalize(), category=cat,
                                   productivity=prod, start_time=cursor, end_time=end, duration=secs))
                cursor = end + timedelta(minutes=2)
                day_total += secs
            # active / idle periods -> active time, idle time and focus score (the app computes
            # focus score as active time / browser time, so keep active time just below browser time)
            t = base
            active = int(day_total * (0.70 + 0.05 * (day % 4)) / 2)
            for status, secs in (("ACTIVE", active), ("IDLE", 300), ("ACTIVE", active), ("IDLE", 420 + 60 * (day % 2))):
                end = t + timedelta(seconds=secs)
                db.add(UserStatusLog(user_id=user.id, status=status, start_time=t, end_time=end, duration=secs))
                t = end
            for i, (a, b) in enumerate(TAB_PAIRS):
                db.add(TabSwitchLog(user_id=user.id, from_website=a, to_website=b, switch_time=base + timedelta(minutes=17 * (i + 1))))
        db.commit()
        print("added activity history for", email)
    finally:
        db.close()


def main():
    requests.get(API, timeout=5).raise_for_status()
    if "--reset-data" in sys.argv:
        for email in [e for people in EMPLOYEES.values() for _n, e in people] + [PUBLIC_USER[1]]:
            reset_data(email)
    ensure_super_admin()
    sup = login(SUPER[1])
    org_ids = {k: ensure_org(sup, v) for k, v in ORGS.items()}
    for k, (name, email) in SUBADMINS.items():
        ensure_subadmin(org_ids[k], name, email)
    for k, people in EMPLOYEES.items():
        sub = login(SUBADMINS[k][1])
        for name, email in people:
            ensure_employee(sub, name, email)
    ensure_public_user()
    for people in EMPLOYEES.values():
        for _n, email in people:
            ensure_activity(email)
    ensure_activity(PUBLIC_USER[1])
    print("\nDone. All demo accounts use password:", PASSWORD)


if __name__ == "__main__":
    main()
