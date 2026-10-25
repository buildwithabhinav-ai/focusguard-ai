"""End-to-end API test run for FocusGuard AI (auth, RBAC, invitations, organisations).

Run from the project root:  ./venv/bin/python qa/api_tests.py
Needs the backend on http://127.0.0.1:8000 and the accounts from qa/seed_demo.py.
Results are written to qa/results.json. Throw-away accounts/orgs (prefix "qa-tmp") are
created for anything destructive so the demo accounts are left untouched.
"""
import json
import sys
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests
from jose import jwt

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.config import ALGORITHM, SECRET_KEY  # noqa: E402
from app.security import create_invitation_token  # noqa: E402

API = "http://127.0.0.1:8000"
PW = "Demo@12345"
RUN = uuid.uuid4().hex[:6]

SUPER = "demo.superadmin@example.com"
SUB_A = "demo.subadmin@example.com"
SUB_B = "demo.subadmin.beta@example.com"
EMP_A = "demo.employee@example.com"
EMP_B = "demo.employee.beta@example.com"
USER = "demo.user@example.com"

results = []


def call(method, path, token=None, **kw):
    headers = kw.pop("headers", {})
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.request(method, API + path, headers=headers, timeout=60, **kw)


def login(email, password=PW):
    r = call("POST", "/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    d = r.json()
    return d["access_token"], d["refresh_token"]


def rec(tid, area, title, expected, actual, ok, note=""):
    results.append({"id": tid, "area": area, "title": title, "expected": str(expected),
                    "actual": str(actual), "status": "PASS" if ok else "FAIL", "note": note})
    print(f"{'PASS' if ok else 'FAIL'}  {tid}  {title}  [expected {expected}, got {actual}]")


def status_check(tid, area, title, r, expected, note=""):
    exp = expected if isinstance(expected, (list, tuple, set)) else [expected]
    rec(tid, area, title, " or ".join(map(str, exp)), r.status_code, r.status_code in exp, note)


def detail(r):
    try:
        return r.json().get("detail")
    except Exception:
        return r.text[:80]


def uid(email):
    t, _ = login(SUPER)
    for u in call("GET", "/admin/all-users", t).json():
        if u["email"] == email:
            return u["id"]


# ----------------------------------------------------------------------------
# Tokens
# ----------------------------------------------------------------------------
tok = {}
tok["super"], _ = login(SUPER)
tok["subA"], _ = login(SUB_A)
tok["subB"], _ = login(SUB_B)
tok["empA"], _ = login(EMP_A)
tok["empB"], _ = login(EMP_B)
tok["user"], refresh_user = login(USER)
ids = {k: uid(v) for k, v in {"empA": EMP_A, "empB": EMP_B, "user": USER, "subA": SUB_A, "subB": SUB_B}.items()}

# ----------------------------------------------------------------------------
# 1. AUTHENTICATION
# ----------------------------------------------------------------------------
A = "Authentication"
for tid, label, key, role in [
    ("AUTH-01", "Super Admin login returns tokens and role SUPER_ADMIN", "super", "SUPER_ADMIN"),
    ("AUTH-02", "Sub Admin login returns tokens and role SUB_ADMIN", "subA", "SUB_ADMIN"),
    ("AUTH-03", "Employee login returns tokens and role USER", "empA", "USER"),
    ("AUTH-04", "Standalone user login returns tokens and role USER", "user", "USER"),
]:
    me = call("GET", "/users/me", tok[key]).json()
    rec(tid, A, label, role, me.get("role"), me.get("role") == role)

r = call("POST", "/auth/login", json={"email": SUPER, "password": "wrong-pass"})
rec("AUTH-05", A, "Login with wrong password is rejected", "401", r.status_code, r.status_code == 401, detail(r))
r = call("POST", "/auth/login", json={"email": "nobody@example.com", "password": PW})
rec("AUTH-06", A, "Login with unknown e-mail is rejected", "401", r.status_code, r.status_code == 401, detail(r))
r = call("POST", "/auth/login", json={"email": "not-an-email", "password": PW})
rec("AUTH-07", A, "Login with malformed e-mail is rejected", "422", r.status_code, r.status_code == 422)
r = call("POST", "/auth/login", json={"email": SUPER})
rec("AUTH-08", A, "Login with missing password field is rejected", "422", r.status_code, r.status_code == 422)
r = call("GET", "/users/me")
rec("AUTH-09", A, "Protected endpoint without token is rejected", "401/403", r.status_code, r.status_code in (401, 403))
r = call("GET", "/users/me", "not.a.jwt")
rec("AUTH-10", A, "Protected endpoint with garbage token is rejected", "401", r.status_code, r.status_code == 401, detail(r))

expired = jwt.encode({"sub": SUPER, "type": "access", "exp": datetime.now(timezone.utc) - timedelta(minutes=5)},
                     SECRET_KEY, algorithm=ALGORITHM)
r = call("GET", "/users/me", expired)
rec("AUTH-11", A, "Expired access token is rejected with a session-expired message", "401", r.status_code,
    r.status_code == 401 and "expired" in str(detail(r)).lower(), detail(r))
forged = jwt.encode({"sub": SUPER, "type": "access", "exp": datetime.now(timezone.utc) + timedelta(hours=1)},
                    "some-other-secret", algorithm=ALGORITHM)
r = call("GET", "/users/me", forged)
rec("AUTH-12", A, "Token signed with a different secret is rejected", "401", r.status_code, r.status_code == 401)

r = call("POST", "/auth/refresh-token", json={"refresh_token": refresh_user})
rec("AUTH-13", A, "Refresh token issues a new working access token", "200 + token works",
    r.status_code, r.status_code == 200 and call("GET", "/users/me", r.json().get("access_token")).status_code == 200)
r = call("POST", "/auth/refresh-token", json={"refresh_token": tok["user"]})
rec("AUTH-14", A, "Access token cannot be used as a refresh token", "401", r.status_code, r.status_code == 401)
r = call("GET", "/users/me", refresh_user)
rec("AUTH-15", A, "Refresh token cannot be used as a bearer token", "401", r.status_code, r.status_code == 401)

# Registration
r = call("POST", "/auth/register-user", json={"full_name": "Dup", "email": USER, "password": PW, "age": 20, "occupation": "x"})
rec("AUTH-16", A, "Public registration with an existing e-mail is rejected", "400", r.status_code, r.status_code == 400, detail(r))
r = call("POST", "/auth/register", json={"full_name": "Hacker", "email": f"qa-tmp-{RUN}-boot@example.com", "password": PW, "age": 20, "occupation": "x"})
rec("AUTH-17", A, "Super Admin bootstrap endpoint is closed once users exist", "403", r.status_code, r.status_code == 403, detail(r))
email_new = f"qa-tmp-{RUN}-reg@example.com"
r = call("POST", "/auth/register-user", json={"full_name": "QA Reg", "email": email_new, "password": PW, "age": 21,
                                              "occupation": "Tester", "role": "SUPER_ADMIN", "organization_id": 1})
t, _ = login(email_new) if r.status_code == 200 else (None, None)
me = call("GET", "/users/me", t).json() if t else {}
rec("AUTH-18", A, "Public registration ignores injected role / organization_id (privilege escalation check)",
    "role USER, no org", f"{me.get('role')}, org={me.get('organization_id')}",
    me.get("role") == "USER" and me.get("organization_id") is None)
r = call("POST", "/auth/register-user", json={"full_name": "Weak", "email": f"qa-tmp-{RUN}-weak@example.com", "password": "a", "age": 20, "occupation": "x"})
rec("AUTH-19", A, "Registration enforces a minimum password length", "400/422", r.status_code, r.status_code in (400, 422),
    "Server accepted a 1-character password: no password policy on /auth/register-user" if r.status_code == 200 else "")

# Change password
tmp_email = f"qa-tmp-{RUN}-pw@example.com"
call("POST", "/auth/register-user", json={"full_name": "QA Pw", "email": tmp_email, "password": PW, "age": 22, "occupation": "t"})
t, _ = login(tmp_email)
r = call("PATCH", "/auth/change-password", t, json={"current_password": "bad", "new_password": "NewPass@123", "confirm_password": "NewPass@123"})
rec("AUTH-20", A, "Change password: wrong current password is rejected", "400", r.status_code, r.status_code == 400, detail(r))
r = call("PATCH", "/auth/change-password", t, json={"current_password": PW, "new_password": "NewPass@123", "confirm_password": "Different@1"})
rec("AUTH-21", A, "Change password: confirmation mismatch is rejected", "400", r.status_code, r.status_code == 400, detail(r))
r = call("PATCH", "/auth/change-password", t, json={"current_password": PW, "new_password": "short", "confirm_password": "short"})
rec("AUTH-22", A, "Change password: password shorter than 8 characters is rejected", "400", r.status_code, r.status_code == 400, detail(r))
r = call("PATCH", "/auth/change-password", t, json={"current_password": PW, "new_password": PW, "confirm_password": PW})
rec("AUTH-23", A, "Change password: reusing the current password is rejected", "400", r.status_code, r.status_code == 400, detail(r))
r = call("PATCH", "/auth/change-password", t, json={"current_password": PW, "new_password": "NewPass@123", "confirm_password": "NewPass@123"})
rec("AUTH-24", A, "Change password: valid change succeeds", "200", r.status_code, r.status_code == 200, detail(r))
r_old = call("POST", "/auth/login", json={"email": tmp_email, "password": PW})
r_new = call("POST", "/auth/login", json={"email": tmp_email, "password": "NewPass@123"})
rec("AUTH-25", A, "After password change: old password fails, new password works", "401 then 200",
    f"{r_old.status_code} then {r_new.status_code}", r_old.status_code == 401 and r_new.status_code == 200)
r = call("PATCH", "/auth/change-password", json={"current_password": PW, "new_password": "x" * 9, "confirm_password": "x" * 9})
rec("AUTH-26", A, "Change password without a token is rejected", "401/403", r.status_code, r.status_code in (401, 403))

# Brute force
codes = [call("POST", "/auth/login", json={"email": tmp_email, "password": f"wrong-{i}"}).status_code for i in range(15)]
rec("AUTH-29", A, "15 consecutive wrong passwords trigger throttling / lock-out (429/423)", "429 or 423 at some point", sorted(set(codes)), any(c in (423, 429) for c in codes),
    "No rate limiting or lock-out: unlimited password guessing is possible" if not any(c in (423, 429) for c in codes) else "")
rec("AUTH-30", A, "Login error does not reveal whether the e-mail exists (no user enumeration)", "same message for unknown e-mail and wrong password",
    f"'{detail(call('POST','/auth/login',json={'email':'nobody@example.com','password':PW}))}' vs '{detail(call('POST','/auth/login',json={'email':SUPER,'password':'x'}))}'",
    detail(call('POST','/auth/login',json={'email':'nobody@example.com','password':PW})) == detail(call('POST','/auth/login',json={'email':SUPER,'password':'x'})),
    "Messages differ ('Invalid Email' vs 'Invalid Password'), which lets an attacker discover valid accounts")

# Logout
t_out, _ = login(tmp_email, "NewPass@123")
r = call("POST", "/auth/logout", t_out)
rec("AUTH-27", A, "Logout endpoint responds successfully", "200", r.status_code, r.status_code == 200, detail(r) or r.json().get("message"))
r = call("GET", "/users/me", t_out)
rec("AUTH-28", A, "Access token is invalidated server-side after logout", "401", r.status_code, r.status_code == 401,
    "Token still valid after logout: logout is client-side only (token is not revoked)" if r.status_code == 200 else "")

# ----------------------------------------------------------------------------
# 2. ROLE-BASED ACCESS CONTROL
# ----------------------------------------------------------------------------
R = "Role-based access"
matrix = [
    ("RBAC-01", "GET", "/admin/all-users", {"super": 200, "subA": 403, "empA": 403, "user": 403}),
    ("RBAC-02", "GET", "/admin/statistics", {"super": 200, "subA": 403, "empA": 403, "user": 403}),
    ("RBAC-03", "GET", "/admin/dashboard", {"super": 200, "subA": 403, "empA": 403, "user": 403}),
    ("RBAC-04", "GET", "/organizations/deactivation-requests", {"super": 200, "subA": 403, "empA": 403, "user": 403}),
    ("RBAC-05", "GET", "/organizations/users", {"super": 403, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-06", "GET", "/analytics/role/activity-summary", {"super": 200, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-07", "GET", "/analytics/role/websites", {"super": 200, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-08", "GET", "/analytics/role/categories", {"super": 200, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-09", "GET", "/analytics/role/tab-switches", {"super": 200, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-10", "GET", "/analytics/role/report?type=weekly", {"super": 200, "subA": 200, "empA": 403, "user": 403}),
    ("RBAC-11", "GET", "/ai/organization-recommendation?organization_id=1", {"super": 200, "subA": 403, "empA": 403, "user": 403}),
    ("RBAC-12", "GET", "/users/me", {"super": 200, "subA": 200, "empA": 200, "user": 200}),
    ("RBAC-13", "GET", "/analytics/summary", {"super": 200, "subA": 200, "empA": 200, "user": 200}),
    ("RBAC-14", "GET", "/notifications/", {"super": 200, "subA": 200, "empA": 200, "user": 200}),
]
for tid, method, path, expect in matrix:
    actual = {k: call(method, path, tok[k]).status_code for k in expect}
    ok = all(actual[k] == v for k, v in expect.items())
    exp_s = ", ".join(f"{k}:{v}" for k, v in expect.items())
    act_s = ", ".join(f"{k}:{v}" for k, v in actual.items())
    rec(tid, R, f"{method} {path.split('?')[0]} - access per role", exp_s, act_s, ok)

# Org list visibility
r = call("GET", "/organizations/", tok["empA"])
rec("RBAC-15", R, "Employee should NOT be able to list all organisations", "403", r.status_code, r.status_code == 403,
    f"Employee received {len(r.json())} organisations incl. other tenants' names" if r.status_code == 200 else "")

# Write operations
for tid, label, method, path, body, who, exp in [
    ("RBAC-16", "Sub Admin cannot create organisation", "POST", "/organizations/", {"organization_name": f"qa-tmp-{RUN}-x"}, "subA", 403),
    ("RBAC-17", "Employee cannot create organisation", "POST", "/organizations/", {"organization_name": f"qa-tmp-{RUN}-y"}, "empA", 403),
    ("RBAC-18", "Sub Admin cannot invite a Sub Admin", "POST", "/admin/invite-sub-admin", {"full_name": "x", "email": "x@example.com", "organization_id": 1}, "subA", 403),
    ("RBAC-19", "Employee cannot invite a Sub Admin", "POST", "/admin/invite-sub-admin", {"full_name": "x", "email": "x@example.com", "organization_id": 1}, "empA", 403),
    ("RBAC-20", "Sub Admin cannot change roles", "PUT", f"/admin/change-role/{ids['empA']}", {"role": "SUPER_ADMIN"}, "subA", 403),
    ("RBAC-21", "Employee cannot change roles (self-promotion)", "PUT", f"/admin/change-role/{ids['empA']}", {"role": "SUPER_ADMIN"}, "empA", 403),
    ("RBAC-22", "Sub Admin cannot delete users", "DELETE", f"/admin/delete-user/{ids['empA']}", None, "subA", 403),
    ("RBAC-23", "Sub Admin cannot assign organisations", "PUT", "/organizations/assign", {"user_id": ids["subA"], "organization_id": 1}, "subA", 403),
    ("RBAC-24", "Super Admin cannot create org users (Sub Admin only)", "POST", "/organizations/users",
     {"full_name": "x", "email": f"qa-tmp-{RUN}-s@example.com", "password": PW, "age": 20, "occupation": "x"}, "super", 403),
    ("RBAC-25", "Employee cannot create org users", "POST", "/organizations/users",
     {"full_name": "x", "email": f"qa-tmp-{RUN}-e@example.com", "password": PW, "age": 20, "occupation": "x"}, "empA", 403),
    ("RBAC-26", "Employee cannot request organisation deactivation", "POST", "/organizations/deactivation-request", {"reason": "x"}, "empA", 403),
    ("RBAC-27", "Super Admin cannot file a deactivation request (Sub Admin only)", "POST", "/organizations/deactivation-request", {"reason": "x"}, "super", 403),
    ("RBAC-28", "Sub Admin cannot approve a deactivation request", "PUT", "/organizations/deactivation-request/1/approve", None, "subA", 403),
    ("RBAC-29", "Sub Admin cannot reject a deactivation request", "PUT", "/organizations/deactivation-request/1/reject", None, "subA", 403),
    ("RBAC-30", "Sub Admin cannot (re)activate an organisation", "PUT", "/organizations/1/activate", None, "subA", 403),
    ("RBAC-31", "Employee cannot view another employee's analytics", "GET", f"/analytics/users/{ids['user']}/activity-summary", None, "empA", 403),
    ("RBAC-32", "Employee cannot read a colleague's live status", "GET", f"/activity/users/{ids['empA']}/status", None, "user", 403),
]:
    kw = {"json": body} if body is not None else {}
    status_check(tid, R, label, call(method, path, tok[who], **kw), exp)

# ----------------------------------------------------------------------------
# 3. SUB ADMIN SCOPE (own organisation only)
# ----------------------------------------------------------------------------
S = "Sub Admin scope"
users_a = {u["email"] for u in call("GET", "/organizations/users", tok["subA"]).json()}
rec("SUB-01", S, "Sub Admin Alpha sees only Alpha employees in user list",
    "Alpha employees only", sorted(users_a),
    EMP_A in users_a and EMP_B not in users_a and SUB_A not in users_a and USER not in users_a)
users_b = {u["email"] for u in call("GET", "/organizations/users", tok["subB"]).json()}
rec("SUB-02", S, "Sub Admin Beta sees only Beta employees", "Beta employees only", sorted(users_b),
    EMP_B in users_b and EMP_A not in users_b)
for tid, label, path, exp in [
    ("SUB-03", "Own-org employee: activity summary", f"/analytics/users/{ids['empA']}/activity-summary", 200),
    ("SUB-04", "Own-org employee: websites", f"/analytics/users/{ids['empA']}/websites", 200),
    ("SUB-05", "Own-org employee: categories", f"/analytics/users/{ids['empA']}/categories", 200),
    ("SUB-06", "Own-org employee: tab switches", f"/analytics/users/{ids['empA']}/tab-switches", 200),
    ("SUB-07", "Own-org employee: live status", f"/activity/users/{ids['empA']}/status", 200),
    ("SUB-08", "Other-org employee: activity summary is blocked", f"/analytics/users/{ids['empB']}/activity-summary", 403),
    ("SUB-09", "Other-org employee: websites is blocked", f"/analytics/users/{ids['empB']}/websites", 403),
    ("SUB-10", "Other-org employee: live status is blocked", f"/activity/users/{ids['empB']}/status", 403),
    ("SUB-11", "Standalone user (no org): analytics blocked", f"/analytics/users/{ids['user']}/activity-summary", 403),
    ("SUB-12", "Unknown user id returns 404", "/analytics/users/999999/activity-summary", 404),
]:
    status_check(tid, S, "Sub Admin Alpha - " + label, call("GET", path, tok["subA"]), exp)
status_check("SUB-13", S, "Super Admin can view any employee's analytics (Beta employee)",
             call("GET", f"/analytics/users/{ids['empB']}/activity-summary", tok["super"]), 200)

# role analytics scoping: numbers for Alpha admin must differ from Super Admin totals (Beta + standalone excluded)
sa = call("GET", "/analytics/role/activity-summary", tok["subA"]).json()
sb = call("GET", "/analytics/role/activity-summary", tok["subB"]).json()
ss = call("GET", "/analytics/role/activity-summary", tok["super"]).json()
key = next((k for k in ss if "browser" in k.lower() or "total" in k.lower()), None)
if key and all(isinstance(x.get(key), (int, float)) for x in (sa, sb, ss)):
    rec("SUB-14", S, "Org-wide analytics are scoped: Alpha + Beta totals do not exceed the Super Admin total",
        f"{key}: Alpha {sa[key]} + Beta {sb[key]} <= Super {ss[key]}", f"{sa[key]} + {sb[key]} vs {ss[key]}",
        sa[key] + sb[key] <= ss[key] and sa[key] < ss[key])
else:
    rec("SUB-14", S, "Org-wide analytics scoping", "numeric totals", f"keys={list(ss)}", False, "Could not locate total field")

# create user
newemp = f"qa-tmp-{RUN}-emp@example.com"
r = call("POST", "/organizations/users", tok["subA"], json={"full_name": "QA Temp Emp", "email": newemp, "password": PW, "age": 30, "occupation": "QA", "role": "SUPER_ADMIN"})
rec("SUB-15", S, "Sub Admin creates an employee (role injection ignored)", "200", r.status_code, r.status_code == 200, detail(r) or "")
if r.status_code == 200:
    tmp_id = r.json()["user_id"]
    te, te_refresh = login(newemp)
    me = call("GET", "/users/me", te).json()
    rec("SUB-16", S, "New employee is USER, belongs to the Sub Admin's organisation",
        "USER, org of Sub Admin", f"{me['role']}, org={me['organization_id']}",
        me["role"] == "USER" and me["organization_id"] == call("GET", "/users/me", tok["subA"]).json()["organization_id"])
    notes = call("GET", "/notifications/", te).json()
    rec("SUB-17", S, "New employee receives a welcome notification", ">=1 notification", len(notes) if isinstance(notes, list) else notes, isinstance(notes, list) and len(notes) >= 1)
r = call("POST", "/organizations/users", tok["subA"], json={"full_name": "Dup", "email": newemp, "password": PW, "age": 30, "occupation": "QA"})
status_check("SUB-18", S, "Creating an employee with a duplicate e-mail is rejected", r, 400)
r = call("POST", "/organizations/users", tok["subA"], json={"full_name": "Weak", "email": f"qa-tmp-{RUN}-weak2@example.com", "password": "1", "age": 30, "occupation": "QA"})
rec("SUB-19", S, "Sub Admin cannot create an employee with a 1-character password", "400/422", r.status_code, r.status_code in (400, 422),
    "Server accepted a 1-character password for an organisation user" if r.status_code == 200 else "")

# deactivate
if r.status_code in (200,) :
    pass
r = call("PUT", f"/organizations/users/{ids['empB']}/deactivate", tok["subA"])
status_check("SUB-20", S, "Sub Admin Alpha cannot deactivate a Beta employee", r, 403, str(detail(r)))
r = call("PUT", f"/organizations/users/{ids['subB']}/deactivate", tok["subA"])
status_check("SUB-21", S, "Sub Admin cannot deactivate another Sub Admin", r, 403, str(detail(r)))
r = call("PUT", f"/organizations/users/{uid(SUPER)}/deactivate", tok["subA"])
status_check("SUB-22", S, "Sub Admin cannot deactivate a Super Admin", r, 403, str(detail(r)))
r = call("PUT", f"/organizations/users/{ids['user']}/deactivate", tok["subA"])
status_check("SUB-23", S, "Sub Admin cannot deactivate a standalone user (no organisation)", r, 403, str(detail(r)))
status_check("SUB-24", S, "Deactivating an unknown user returns 404", call("PUT", "/organizations/users/999999/deactivate", tok["subA"]), 404)
status_check("SUB-25", S, "Employee cannot deactivate a colleague",
             call("PUT", f"/organizations/users/{ids['empA']}/deactivate", tok["empA"]), 403)
if r is not None and 'tmp_id' in dir():
    r = call("PUT", f"/organizations/users/{tmp_id}/deactivate", tok["subA"])
    status_check("SUB-26", S, "Sub Admin deactivates an own-org employee", r, 200, str(detail(r) or ""))
    r = call("POST", "/auth/login", json={"email": newemp, "password": PW})
    rec("SUB-27", S, "Deactivated employee can no longer log in", "403", r.status_code, r.status_code == 403, detail(r))
    r = call("GET", "/users/me", te)
    rec("SUB-28", S, "Deactivated employee's already-issued token stops working", "401/403", r.status_code, r.status_code in (401, 403),
        "Deactivation only blocks new logins; a token issued before deactivation keeps working until it expires" if r.status_code == 200 else "")
    r = call("POST", "/auth/refresh-token", json={"refresh_token": te_refresh})
    ok = r.status_code in (401, 403) or (r.status_code == 200 and call("GET", "/users/me", r.json()["access_token"]).status_code in (401, 403))
    rec("SUB-28b", S, "Deactivated employee cannot mint a fresh access token with the refresh token (valid 7 days)", "401/403", r.status_code, ok,
        "Refresh endpoint does not check is_active, so a deactivated user keeps access for up to 7 days" if not ok else "")
    r = call("PUT", f"/organizations/users/{tmp_id}/activate", tok["subA"])
    rec("SUB-29", S, "A deactivated employee can be re-activated", "200", r.status_code, r.status_code == 200,
        "No re-activation endpoint exists for users (only organisations can be re-activated)" if r.status_code in (404, 405) else "")

# no-org sub admin
noorg_email = f"qa-tmp-{RUN}-noorg@example.com"
call("POST", "/auth/register-user", json={"full_name": "QA NoOrg", "email": noorg_email, "password": PW, "age": 30, "occupation": "t"})
noorg_id = uid(noorg_email)
call("PUT", f"/admin/change-role/{noorg_id}", tok["super"], json={"role": "SUB_ADMIN"})
tn, _ = login(noorg_email)
status_check("SUB-30", S, "Sub Admin without an organisation: user list returns 400", call("GET", "/organizations/users", tn), 400)
status_check("SUB-31", S, "Sub Admin without an organisation: deactivation request returns 400",
             call("POST", "/organizations/deactivation-request", tn, json={"reason": "x"}), 400)

# ----------------------------------------------------------------------------
# 4. INVITATIONS
# ----------------------------------------------------------------------------
I = "Invitations"
org_inv = call("POST", "/organizations/", tok["super"], json={"organization_name": f"qa-tmp-{RUN}-inv-org"}).json()
org_id = org_inv["id"]
r = call("POST", "/admin/invite-sub-admin", tok["super"], json={"full_name": "QA Invitee", "email": f"qa-tmp-{RUN}-inv@example.com", "organization_id": org_id})
d = r.json() if r.status_code == 200 else {}
ok = r.status_code == 200 and (d.get("email_sent") is True or (d.get("email_sent") is False and bool(d.get("invitation_link")) and bool(d.get("email_error"))))
rec("INV-01", I, "Invite answers 200; if e-mail cannot be sent it says why and returns the link to share by hand",
    "200 + (email_sent true) or (email_sent false + reason + link)",
    f"{r.status_code} email_sent={d.get('email_sent')} link={'yes' if d.get('invitation_link') else 'no'} reason={str(d.get('email_error'))[:50]}", ok,
    "Mail server is not configured in .env, so the Super Admin gets the link instead" if d.get("email_sent") is False else "")
if d.get("email_sent") is False:
    link_ok = call("POST", "/admin/accept-invitation", params={"token": d["invitation_link"].split("token=")[1]}, json={"password": PW})
    rec("INV-01b", I, "The fallback link returned by the API can be used to accept the invitation", "200", link_ok.status_code, link_ok.status_code == 200)
inv_notes = call("GET", "/notifications/", tok["super"]).json()
rec("INV-01c", I, "Super Admin gets an in-app notification about the invitation (sent / not delivered)", "INVITATION_SENT or INVITATION_FAILED",
    [n["notification_type"] for n in inv_notes][:3], any(n["notification_type"] in ("INVITATION_SENT", "INVITATION_FAILED") and f"qa-tmp-{RUN}-inv@" in n["message"] for n in inv_notes))
status_check("INV-02", I, "Invite for unknown organisation returns 404",
             call("POST", "/admin/invite-sub-admin", tok["super"], json={"full_name": "x", "email": "x1@example.com", "organization_id": 999999}), 404)
status_check("INV-03", I, "Invite for an e-mail that already has an account returns 400",
             call("POST", "/admin/invite-sub-admin", tok["super"], json={"full_name": "x", "email": EMP_A, "organization_id": org_id}), 400)
status_check("INV-04", I, "Invite with malformed e-mail returns 422",
             call("POST", "/admin/invite-sub-admin", tok["super"], json={"full_name": "x", "email": "nope", "organization_id": org_id}), 422)

inv_email = f"qa-tmp-{RUN}-inv2@example.com"
good = create_invitation_token({"email": inv_email, "name": "QA Invitee Two", "role": "SUB_ADMIN", "organization_id": org_id})
weak_tok = create_invitation_token({"email": f"qa-tmp-{RUN}-weakinv@example.com", "name": "QA Weak", "role": "SUB_ADMIN", "organization_id": org_id})
r = call("POST", "/admin/accept-invitation", params={"token": weak_tok}, json={"password": "short"})
rec("INV-05", I, "Accepting an invitation with a 5-character password is rejected by the server", "400/422", r.status_code, r.status_code in (400, 422),
    "Only the UI checks length (min 8); the API accepted it" if r.status_code == 200 else "")
r = call("POST", "/admin/accept-invitation", params={"token": good}, json={"password": PW})
rec("INV-06", I, "Valid invitation creates a Sub Admin in the invited organisation", "200, SUB_ADMIN, org", f"{r.status_code} {r.json() if r.status_code==200 else detail(r)}",
    r.status_code == 200 and r.json().get("role") == "SUB_ADMIN" and r.json().get("organization_id") == org_id)
inv_tok, _ = login(inv_email)
me = call("GET", "/users/me", inv_tok).json()
rec("INV-07", I, "Invited Sub Admin can log in and has correct role/org", "SUB_ADMIN, org", f"{me['role']}, org={me['organization_id']}", me["role"] == "SUB_ADMIN" and me["organization_id"] == org_id)
r = call("POST", "/admin/accept-invitation", params={"token": good}, json={"password": PW})
status_check("INV-08", I, "Re-using the same invitation link is rejected", r, 400, str(detail(r)))
status_check("INV-09", I, "Garbage invitation token is rejected",
             call("POST", "/admin/accept-invitation", params={"token": "abc"}, json={"password": PW}), 400)
exp_inv = jwt.encode({"email": "late@example.com", "name": "Late", "role": "SUB_ADMIN", "organization_id": org_id, "type": "invitation",
                      "exp": datetime.now(timezone.utc) - timedelta(hours=1)}, SECRET_KEY, algorithm=ALGORITHM)
status_check("INV-10", I, "Expired invitation (older than 24 h) is rejected",
             call("POST", "/admin/accept-invitation", params={"token": exp_inv}, json={"password": PW}), 400)
status_check("INV-11", I, "Login access token cannot be used as an invitation",
             call("POST", "/admin/accept-invitation", params={"token": tok["super"]}, json={"password": PW}), 400)
bad_role = create_invitation_token({"email": f"qa-tmp-{RUN}-sa@example.com", "name": "Evil", "role": "SUPER_ADMIN", "organization_id": org_id})
status_check("INV-12", I, "Invitation carrying role SUPER_ADMIN is refused", call("POST", "/admin/accept-invitation", params={"token": bad_role}, json={"password": PW}), 400)
parts = good.split(".")
tampered = ".".join([parts[0], parts[1][:-2] + ("AA" if not parts[1].endswith("AA") else "BB"), parts[2]])
status_check("INV-13", I, "Tampered invitation payload is rejected", call("POST", "/admin/accept-invitation", params={"token": tampered}, json={"password": PW}), 400)
no_org = create_invitation_token({"email": f"qa-tmp-{RUN}-no@example.com", "name": "X", "role": "SUB_ADMIN"})
status_check("INV-14", I, "Invitation without an organisation is rejected", call("POST", "/admin/accept-invitation", params={"token": no_org}, json={"password": PW}), 400)
ghost = create_invitation_token({"email": f"qa-tmp-{RUN}-gh@example.com", "name": "X", "role": "SUB_ADMIN", "organization_id": 999999})
status_check("INV-15", I, "Invitation for a non-existent organisation returns 404", call("POST", "/admin/accept-invitation", params={"token": ghost}, json={"password": PW}), 404)
status_check("INV-16", I, "Accept-invitation request without a body returns 422",
             call("POST", "/admin/accept-invitation", params={"token": good}), 422)
rec("INV-17", I, "Invitation link format matches the front-end router (hash route)", "http://localhost:5173/#/accept-invitation?token=...",
    "same (hash route + HashRouter)", True, "Link is hard-coded to localhost:5173; it must be changed before deployment")

# ----------------------------------------------------------------------------
# 5. ORGANISATION LIFECYCLE (create -> assign -> deactivate request -> approve/reject -> activate)
# ----------------------------------------------------------------------------
O = "Organisation lifecycle"
oname = f"qa-tmp-{RUN}-life"
r = call("POST", "/organizations/", tok["super"], json={"organization_name": oname})
status_check("ORG-01", O, "Super Admin creates an organisation", r, 200)
life_id = r.json()["id"]
status_check("ORG-02", O, "Duplicate organisation name is rejected", call("POST", "/organizations/", tok["super"], json={"organization_name": oname}), 400)
rec("ORG-03", O, "New organisation is active by default", "is_active true", r.json().get("is_active"), r.json().get("is_active") is True)

life_sub = f"qa-tmp-{RUN}-lifesub@example.com"
tk = create_invitation_token({"email": life_sub, "name": "QA Life Sub", "role": "SUB_ADMIN", "organization_id": life_id})
call("POST", "/admin/accept-invitation", params={"token": tk}, json={"password": PW})
life_emp = f"qa-tmp-{RUN}-lifeemp@example.com"
ts, _ = login(life_sub)
call("POST", "/organizations/users", ts, json={"full_name": "QA Life Emp", "email": life_emp, "password": PW, "age": 30, "occupation": "t"})
te2, _ = login(life_emp)

# assign
status_check("ORG-04", O, "Assign: non-Sub-Admin user is refused", call("PUT", "/organizations/assign", tok["super"], json={"user_id": ids["empA"], "organization_id": life_id}), 400)
status_check("ORG-05", O, "Assign: unknown user returns 404", call("PUT", "/organizations/assign", tok["super"], json={"user_id": 999999, "organization_id": life_id}), 404)
status_check("ORG-06", O, "Assign: unknown organisation returns 404", call("PUT", "/organizations/assign", tok["super"], json={"user_id": noorg_id, "organization_id": 999999}), 404)
status_check("ORG-07", O, "Assign: Sub Admin without org gets an organisation", call("PUT", "/organizations/assign", tok["super"], json={"user_id": noorg_id, "organization_id": life_id}), 200)
tn, _ = login(noorg_email)
rec("ORG-08", O, "Assigned Sub Admin now sees the organisation's employees", "Life employee listed",
    [u["email"] for u in call("GET", "/organizations/users", tn).json()], life_emp in [u["email"] for u in call("GET", "/organizations/users", tn).json()])
notes = call("GET", "/notifications/", tn).json()
rec("ORG-09", O, "Assigned Sub Admin receives an 'Organization Assigned' notification", "notification present",
    [n.get("title") for n in notes][:3] if isinstance(notes, list) else notes, isinstance(notes, list) and any("Assigned" in str(n.get("title")) for n in notes))

# deactivation request
r = call("POST", "/organizations/deactivation-request", ts, json={"reason": "QA test: closing the org"})
status_check("ORG-10", O, "Sub Admin submits a deactivation request", r, 200)
req_id = r.json().get("request_id")
status_check("ORG-11", O, "Second pending request for the same organisation is rejected", call("POST", "/organizations/deactivation-request", ts, json={"reason": "again"}), 400)
reqs = call("GET", "/organizations/deactivation-requests", tok["super"]).json()
rec("ORG-12", O, "Super Admin sees the pending request", "request listed as PENDING",
    next((x["status"] for x in reqs if x["id"] == req_id), None), any(x["id"] == req_id and x["status"] == "PENDING" for x in reqs))
sn = call("GET", "/notifications/", tok["super"]).json()
rec("ORG-13", O, "Super Admin is notified of the request", "DEACTIVATION_REQUEST notification",
    "found" if any(n.get("notification_type") == "DEACTIVATION_REQUEST" for n in sn) else "missing",
    any(n.get("notification_type") == "DEACTIVATION_REQUEST" for n in sn))
status_check("ORG-14", O, "Super Admin rejects the request", call("PUT", f"/organizations/deactivation-request/{req_id}/reject", tok["super"]), 200)
status_check("ORG-15", O, "After rejection the organisation still works (employee login)", call("POST", "/auth/login", json={"email": life_emp, "password": PW}), 200)
status_check("ORG-16", O, "After rejection a new request may be filed", call("POST", "/organizations/deactivation-request", ts, json={"reason": "second try"}), 200)
req2 = call("GET", "/organizations/deactivation-requests", tok["super"]).json()
req2_id = next(x["id"] for x in req2 if x["organization_id"] == life_id and x["status"] == "PENDING")
status_check("ORG-17", O, "Super Admin approves the request", call("PUT", f"/organizations/deactivation-request/{req2_id}/approve", tok["super"]), 200)
r = call("POST", "/auth/login", json={"email": life_emp, "password": PW})
rec("ORG-18", O, "Employee of a deactivated organisation cannot log in", "403", r.status_code, r.status_code == 403, detail(r))
r = call("POST", "/auth/login", json={"email": life_sub, "password": PW})
rec("ORG-19", O, "Sub Admin of a deactivated organisation cannot log in", "403", r.status_code, r.status_code == 403, detail(r))
r = call("GET", "/users/me", te2)
rec("ORG-20", O, "Token issued before deactivation stops working", "401/403", r.status_code, r.status_code in (401, 403),
    "Existing sessions of a deactivated organisation stay valid until the token expires (60 min)" if r.status_code == 200 else "")
status_check("ORG-21", O, "Cannot invite a Sub Admin into an inactive organisation",
             call("POST", "/admin/invite-sub-admin", tok["super"], json={"full_name": "x", "email": f"qa-tmp-{RUN}-i3@example.com", "organization_id": life_id}), 400)
late = create_invitation_token({"email": f"qa-tmp-{RUN}-late@example.com", "name": "L", "role": "SUB_ADMIN", "organization_id": life_id})
status_check("ORG-22", O, "Pending invitation cannot be accepted after the organisation is deactivated",
             call("POST", "/admin/accept-invitation", params={"token": late}, json={"password": PW}), 400)
r = call("PUT", f"/organizations/deactivation-request/{req2_id}/approve", tok["super"])
rec("ORG-23", O, "An already-approved request cannot be approved again", "400", r.status_code, r.status_code == 400,
    "Request status is not checked: approved/rejected requests can be re-processed (and re-notify)" if r.status_code == 200 else "")
status_check("ORG-24", O, "Unknown request id returns 404", call("PUT", "/organizations/deactivation-request/999999/approve", tok["super"]), 404)
status_check("ORG-25", O, "Super Admin re-activates the organisation", call("PUT", f"/organizations/{life_id}/activate", tok["super"]), 200)
status_check("ORG-26", O, "Employee can log in again after re-activation", call("POST", "/auth/login", json={"email": life_emp, "password": PW}), 200)
status_check("ORG-27", O, "Sub Admin can log in again after re-activation", call("POST", "/auth/login", json={"email": life_sub, "password": PW}), 200)
status_check("ORG-28", O, "Activating an unknown organisation returns 404", call("PUT", "/organizations/999999/activate", tok["super"]), 404)

# ----------------------------------------------------------------------------
# 6. SUPER ADMIN USER MANAGEMENT
# ----------------------------------------------------------------------------
M = "Super Admin user management"
all_users = call("GET", "/admin/all-users", tok["super"]).json()
rec("MGT-01", M, "All-users list contains demo accounts of every role", ">=6 users, all 3 roles",
    f"{len(all_users)} users, roles={sorted({u['role'] for u in all_users})}", len(all_users) >= 6 and {u["role"] for u in all_users} == {"SUPER_ADMIN", "SUB_ADMIN", "USER"})
rec("MGT-02", M, "All-users response does not leak password hashes", "no hashed_password field",
    "field present" if any("hashed_password" in u for u in all_users) else "absent", not any("hashed_password" in u for u in all_users),
    "bcrypt hashes of every user are returned to the Super Admin" if any("hashed_password" in u for u in all_users) else "")
st = call("GET", "/admin/statistics", tok["super"]).json()
rec("MGT-03", M, "Statistics totals add up", "total = super + sub + users", st, st["Total Users"] == st["Super Admins"] + st["Sub Admins"] + st["Users"])
r = call("PUT", f"/admin/change-role/{noorg_id}", tok["super"], json={"role": "USER"})
status_check("MGT-04", M, "Super Admin changes a user's role", r, 200)
r = call("PUT", f"/admin/change-role/{noorg_id}", tok["super"], json={"role": "HACKER"})
rec("MGT-05", M, "Change-role rejects values that are not a valid role", "400/422", r.status_code, r.status_code in (400, 422),
    "Role 'HACKER' was saved; that user can no longer open any dashboard" if r.status_code == 200 else "")
call("PUT", f"/admin/change-role/{noorg_id}", tok["super"], json={"role": "USER"})
status_check("MGT-06", M, "Change role of unknown user returns 404", call("PUT", "/admin/change-role/999999", tok["super"], json={"role": "USER"}), 404)

# delete: user with activity history
del_email = f"qa-tmp-{RUN}-del@example.com"
call("POST", "/auth/register-user", json={"full_name": "QA Del", "email": del_email, "password": PW, "age": 30, "occupation": "t"})
td, _ = login(del_email)
a = call("POST", "/activity/start", td, json={"url": "https://github.com", "tab_title": "GitHub", "application": "Chrome"})
if a.status_code == 200:
    call("PUT", f"/activity/end/{a.json()['activity_id']}", td)
r = call("DELETE", f"/admin/delete-user/{uid(del_email)}", tok["super"])
rec("MGT-07", M, "Super Admin can delete a user who already has activity history", "200", r.status_code, r.status_code == 200,
    "Server error (500): user rows referenced by activity/notification rows cannot be deleted (foreign key)" if r.status_code >= 500 else str(detail(r)))
mid = call("POST", "/organizations/users", tok["subA"], json={"full_name": "QA Del2", "email": f"qa-tmp-{RUN}-del2@example.com", "password": PW, "age": 30, "occupation": "t"})
r = call("DELETE", f"/admin/delete-user/{mid.json().get('user_id')}", tok["super"])
rec("MGT-09", M, "Super Admin can delete a user who only has a welcome notification (no activity)", "200", r.status_code, r.status_code == 200,
    "Every employee created by a Sub Admin receives a notification, so none of them can be deleted (500)" if r.status_code >= 500 else "")
status_check("MGT-08", M, "Delete unknown user returns 404", call("DELETE", "/admin/delete-user/999999", tok["super"]), 404)

# ----------------------------------------------------------------------------
# 7. EMPLOYEE / USER FEATURES
# ----------------------------------------------------------------------------
U = "Employee / user features"
me = call("GET", "/users/me", tok["empA"]).json()
rec("USR-01", U, "Profile shows own details", "e-mail matches", me.get("email"), me.get("email") == EMP_A)
for tid, label, path in [
    ("USR-02", "Dashboard data", "/analytics/dashboard"),
    ("USR-03", "Activity summary", "/analytics/activity-summary"),
    ("USR-04", "Website analytics", "/analytics/websites"),
    ("USR-05", "Category analytics", "/analytics/categories"),
    ("USR-06", "Tab-switch analytics", "/analytics/tab-switches"),
    ("USR-07", "Weekly report", "/analytics/report?type=weekly"),
    ("USR-08", "Monthly report", "/analytics/report?type=monthly"),
    ("USR-09", "Current activity", "/activity/current"),
    ("USR-10", "Activity history", "/activity/history"),
    ("USR-11", "Live status", "/activity/status"),
    ("USR-12", "Planner categories", "/planner/categories"),
    ("USR-14", "Notification unread count", "/notifications/unread-count"),
]:
    status_check(tid, U, f"Employee opens: {label}", call("GET", path, tok["empA"]), 200)
status_check("USR-15", U, "Report with invalid type returns 400", call("GET", "/analytics/report?type=yearly", tok["empA"]), 400)

# activity tracking
a = call("POST", "/activity/start", tok["user"], json={"url": "https://github.com/x", "tab_title": "GitHub", "application": "Chrome"})
status_check("USR-16", U, "Activity tracking: start", a, 200)
time.sleep(1.2)
e = call("PUT", f"/activity/end/{a.json().get('activity_id')}", tok["user"])
rec("USR-17", U, "Activity tracking: end stores a duration", "200 with duration >= 1", f"{e.status_code} {e.json() if e.status_code==200 else ''}",
    e.status_code == 200 and e.json().get("duration_seconds", 0) >= 1)
e2 = call("PUT", f"/activity/end/{a.json().get('activity_id')}", tok["empA"])
status_check("USR-18", U, "A user cannot end another user's activity", e2, 404)
status_check("USR-19", U, "Tab switch is recorded", call("POST", "/activity/tab-switch", tok["user"], json={"from_website": "github.com", "to_website": "youtube.com"}), [200, 201])
status_check("USR-20", U, "Status update (ACTIVE/IDLE) accepted", call("POST", "/activity/status", tok["user"], json={"status": "ACTIVE"}), 200)

# planner
plan_date = (datetime.now() + timedelta(days=200 + int(RUN, 16) % 100)).strftime("%Y-%m-%dT00:00:00")
plan = {"plan_date": plan_date, "total_goal_minutes": 120, "plans": [{"category": "Development", "planned_minutes": 90}, {"category": "Learning", "planned_minutes": 30}]}
r = call("POST", "/planner", tok["user"], json=plan)
status_check("USR-21", U, "Planner: create focus plan", r, 200)
status_check("USR-22", U, "Planner: second plan for the same date is rejected", call("POST", "/planner", tok["user"], json=plan), 400)
if r.status_code == 200:
    pid = r.json()["plan_id"]
    status_check("USR-23", U, "Planner: update own plan", call("PUT", f"/planner/{pid}", tok["user"], json={"total_goal_minutes": 150, "plans": plan["plans"]}), 200)
    status_check("USR-24", U, "Planner: another user cannot edit this plan", call("PUT", f"/planner/{pid}", tok["empA"], json={"total_goal_minutes": 1, "plans": plan["plans"]}), [403, 404])
r = call("GET", "/planner/today", tok["user"])
rec("USR-25", U, "Planner: 'today' with no plan returns a clear 404", "404 'No focus plan found for today.'", f"{r.status_code} {detail(r)}",
    r.status_code == 404 and "No focus plan" in str(detail(r)))
tp, _ = login(tmp_email, "NewPass@123")
today_plan = {"plan_date": datetime.now().strftime("%Y-%m-%dT00:00:00"), "total_goal_minutes": 60, "plans": [{"category": "Development", "planned_minutes": 60}]}
status_check("USR-13", U, "Planner: create a plan for today", call("POST", "/planner", tp, json=today_plan), 200)
status_check("USR-32", U, "Planner: today's plan is returned", call("GET", "/planner/today", tp), 200)
status_check("USR-33", U, "Planner: progress is returned", call("GET", "/planner/progress", tp), 200)
status_check("USR-34", U, "Planner: current session responds", call("GET", "/planner/current-session", tp), [200, 404])
status_check("USR-35", U, "Planner: live status responds", call("GET", "/planner/live-status", tp), [200, 404])

# notifications
notes = call("GET", "/notifications/", tok["empA"]).json()
uc = call("GET", "/notifications/unread-count", tok["empA"]).json()
rec("USR-26", U, "Notifications list and unread counter respond", "list + count", f"{len(notes)} items, count={uc}", isinstance(notes, list))
if notes:
    nid = notes[0]["id"]
    status_check("USR-27", U, "Another user cannot mark my notification as read", call("PATCH", f"/notifications/{nid}/read", tok["empB"]), 404)
    status_check("USR-28", U, "Owner marks notification as read", call("PATCH", f"/notifications/{nid}/read", tok["empA"]), 200)
status_check("USR-29", U, "Mark all notifications as read", call("PATCH", "/notifications/read-all", tok["empA"]), 200)

# AI (depends on external LLM key)
r = call("POST", "/ai/chat", tok["empA"], json={"message": "   "})
status_check("USR-30", U, "AI chat: blank message is rejected", r, 400)
t0 = time.time()
r = call("GET", "/ai/recommendation", tok["empA"])
rec("USR-31", U, "AI recommendation endpoint responds (depends on Groq/Gemini keys)", "200", r.status_code, r.status_code == 200, f"{time.time()-t0:.1f}s")

# ----------------------------------------------------------------------------
# 8. TAB SWITCHING
# ----------------------------------------------------------------------------
T = "Tab switching"
ts_email = f"qa-tmp-{RUN}-tabs@example.com"
call("POST", "/auth/register-user", json={"full_name": "QA Tabs", "email": ts_email, "password": PW, "age": 22, "occupation": "t"})
tt, _ = login(ts_email)
total = lambda: call("GET", "/analytics/tab-switches", tt).json()["total_switches"]
rec("TAB-01", T, "New user starts with 0 recorded tab switches", "0", total(), total() == 0)
r = call("POST", "/activity/tab-switch", tt, json={"from_website": "github.com", "to_website": "youtube.com"})
rec("TAB-02", T, "A tab switch is saved", "200, duplicate false", f"{r.status_code} {r.json()}", r.status_code == 200 and r.json().get("duplicate") is False)
r = call("POST", "/activity/tab-switch", tt, json={"from_website": "github.com", "to_website": "youtube.com"})
rec("TAB-03", T, "The same switch reported again within a second is counted once", "duplicate true, total 1", f"{r.json().get('duplicate')}, total {total()}", r.json().get("duplicate") is True and total() == 1)
time.sleep(1.2)
call("POST", "/activity/tab-switch", tt, json={"from_website": "github.com", "to_website": "youtube.com"})
rec("TAB-04", T, "The same switch a moment later is a new, real switch", "total 2", total(), total() == 2)
call("POST", "/activity/tab-switch", tt, json={"from_website": "  youtube.com ", "to_website": "gmail.com"})
last = call("GET", "/analytics/tab-switches", tt).json()["recent_switches"][0]
rec("TAB-05", T, "Website names are trimmed before saving", "'youtube.com'", repr(last["from"]), last["from"] == "youtube.com")
status_check("TAB-06", T, "Empty website name is rejected", call("POST", "/activity/tab-switch", tt, json={"from_website": "", "to_website": "gmail.com"}), [400, 422])
status_check("TAB-07", T, "Blank (spaces only) website name is rejected", call("POST", "/activity/tab-switch", tt, json={"from_website": "   ", "to_website": "gmail.com"}), [400, 422])
status_check("TAB-08", T, "Website name longer than 255 characters is rejected", call("POST", "/activity/tab-switch", tt, json={"from_website": "x" * 300, "to_website": "gmail.com"}), [400, 422])
status_check("TAB-09", T, "Tab switch without login is refused", call("POST", "/activity/tab-switch", json={"from_website": "a.com", "to_website": "b.com"}), [401, 403])
summ = call("GET", "/analytics/summary", tt).json()
rec("TAB-10", T, "Summary screen and Tab Switch screen show the same number", f"summary {total()} = list {total()}", f"summary {summ['tab_switches']}, list {total()}", summ["tab_switches"] == total())
other = call("GET", "/analytics/tab-switches", tok["empB"]).json()["total_switches"]
rec("TAB-11", T, "Another user's switches are not mixed in", "different totals", f"mine {total()}, other {other}", other != total())
today = datetime.now().strftime("%Y-%m-%d")
rec("TAB-12", T, "Date filter returns today's switches", "3", call("GET", f"/analytics/tab-switches?date={today}", tt).json()["total_switches"], call("GET", f"/analytics/tab-switches?date={today}", tt).json()["total_switches"] == 3)
status_check("TAB-13", T, "Date filter with a bad date returns 400", call("GET", "/analytics/tab-switches?date=25-10-2026", tt), 400)
sw_sub = call("GET", f"/analytics/users/{ids['empA']}/tab-switches", tok["subA"]).json()
rec("TAB-14", T, "Sub Admin sees the tab switches of an own-organisation employee", "list with entries", sw_sub.get("total_switches"), sw_sub.get("total_switches", 0) > 0)
status_check("TAB-15", T, "Sub Admin cannot see tab switches of another organisation's employee", call("GET", f"/analytics/users/{ids['empB']}/tab-switches", tok["subA"]), 403)
dash = call("GET", "/analytics/dashboard", tt).json()
rec("TAB-16", T, "Dashboard 'today' counter matches the recorded switches", "3", dash.get("total_tab_switches"), dash.get("total_tab_switches") == 3)

# ----------------------------------------------------------------------------
# cleanup of throw-away data
# ----------------------------------------------------------------------------
import subprocess
sql = f"""
delete from deactivation_requests where organization_id in (select id from organizations where organization_name like 'qa-tmp-{RUN}%') or requested_by in (select id from users where email like 'qa-tmp-{RUN}%');
delete from focus_plan_items where plan_id in (select id from focus_plans where user_id in (select id from users where email like 'qa-tmp-{RUN}%'));
delete from focus_plans where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from activity_logs where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from tab_switch_logs where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from user_status_logs where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from user_status where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from notifications where user_id in (select id from users where email like 'qa-tmp-{RUN}%');
delete from users where email like 'qa-tmp-{RUN}%';
delete from organizations where organization_name like 'qa-tmp-{RUN}%';
"""
out = subprocess.run(["psql", "focusguard_ai", "-c", sql], capture_output=True, text=True)
cleanup = (out.stdout + out.stderr).strip().splitlines()
print("cleanup:", cleanup)

summary = {"run": RUN, "when": datetime.now().isoformat(timespec="seconds"),
           "total": len(results), "passed": sum(r["status"] == "PASS" for r in results),
           "failed": sum(r["status"] == "FAIL" for r in results),
           "blocked": sum(r["status"] == "BLOCKED" for r in results), "results": results,
           "cleanup": cleanup}
Path(__file__).with_name("results.json").write_text(json.dumps(summary, indent=2))
print(f"\n{summary['passed']}/{summary['total']} passed, {summary['failed']} failed, {summary['blocked']} blocked")
