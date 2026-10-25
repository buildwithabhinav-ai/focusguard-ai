"""Interactive UI flows with throw-away data (qa-tmp-ui-*): create user, deactivate, org create,
invite form, deactivation request -> approve in UI -> blocked login -> re-activate in UI."""
import json
import subprocess
import sys
import uuid
from pathlib import Path

import requests
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


def create_invitation_token(data):
    out = subprocess.run([str(ROOT / "venv/bin/python"), str(ROOT / "qa/make_invite_link.py"), data["name"], data["email"], str(data["organization_id"])],
                         capture_output=True, text=True, cwd=str(ROOT)).stdout
    return out.strip().split("token=")[1]

API = "http://127.0.0.1:8000"
BASE = "http://localhost:5173/#"
PW = "Demo@12345"
RUN = uuid.uuid4().hex[:5]
SHOTS = Path(__file__).parent / "shots"
res = []


def rec(tid, title, expected, actual, ok, shot=None, note=""):
    res.append({"id": tid, "title": title, "expected": expected, "actual": actual, "status": "PASS" if ok else "FAIL", "note": note, "shot": shot})
    print("PASS" if ok else "FAIL", tid, title, "|", expected, "->", actual)


def api_login(email):
    return requests.post(f"{API}/auth/login", json={"email": email, "password": PW})


def shot(page, name):
    page.wait_for_timeout(1500)
    page.screenshot(path=str(SHOTS / f"{name}.png"))
    return f"{name}.png"


def login(page, email):
    page.goto(f"{BASE}/login")
    page.wait_for_selector("input[type=password]")
    page.fill("input[type=email]", email)
    page.fill("input[type=password]", PW)
    page.click("button[type=submit]")
    page.wait_for_timeout(2500)


def logout(page):
    page.get_by_text("Logout", exact=True).first.click()
    page.wait_for_timeout(1200)


sup = {"Authorization": "Bearer " + api_login("demo.superadmin@example.com").json()["access_token"]}
org = requests.post(f"{API}/organizations/", headers=sup, json={"organization_name": f"qa-tmp-ui-{RUN}"}).json()
sub_email = f"qa-tmp-ui-{RUN}-sub@example.com"
requests.post(f"{API}/admin/accept-invitation", params={"token": create_invitation_token(
    {"email": sub_email, "name": "QA UI Sub", "role": "SUB_ADMIN", "organization_id": org["id"]})}, json={"password": PW})
emp_email = f"qa-tmp-ui-{RUN}-emp@example.com"

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    page = b.new_context(viewport={"width": 1366, "height": 820}, permissions=["clipboard-read", "clipboard-write"]).new_page()
    page.on("dialog", lambda d: d.accept())

    # ---- Sub Admin: create user via modal
    login(page, sub_email)
    page.goto(f"{BASE}/subadmin/users")
    page.wait_for_timeout(2000)
    page.get_by_role("button", name="Create User").first.click()
    page.wait_for_timeout(800)
    page.fill("input[name=full_name]", "QA UI Employee")
    page.fill("input[name=email]", emp_email)
    page.fill("input[name=password]", PW)
    page.fill("input[name=age]", "29")
    page.fill("input[name=occupation]", "Tester")
    s1 = shot(page, "FLOW_create_user_modal")
    page.locator("button[type=button]").filter(has_text="Create").last.click()
    page.wait_for_timeout(2500)
    txt = page.inner_text("body")
    rec("FLOW-01", "Sub Admin creates an employee through the Create User modal", "new row appears in the table", "QA UI Employee" in txt, "QA UI Employee" in txt, shot(page, "FLOW_user_created"))
    rec("FLOW-02", "New employee can log in via the API with the password the Sub Admin set", "200", api_login(emp_email).status_code, api_login(emp_email).status_code == 200)

    # ---- deactivate in UI
    row = page.locator("tr", has_text="QA UI Employee")
    row.get_by_role("button", name="Deactivate").click()
    page.wait_for_timeout(2500)
    txt = page.inner_text("body")
    login_status = api_login(emp_email).status_code
    rec("FLOW-03", "Sub Admin deactivates the employee in the UI; employee login is then blocked", "status Inactive, login 403",
        f"login {login_status}, row: {page.locator('tr', has_text='QA UI Employee').inner_text()[:80].replace(chr(10),' ')}", login_status == 403, shot(page, "FLOW_user_deactivated"))

    # ---- request deactivation of the org
    page.goto(f"{BASE}/subadmin/organization")
    page.wait_for_timeout(2500)
    shot(page, "FLOW_sub_org_page")
    btn = page.get_by_role("button", name="Request Deactivation")
    if btn.count():
        btn.first.click()
        page.wait_for_timeout(800)
        page.fill("textarea", "QA UI test: please deactivate this organization")
        shot(page, "FLOW_request_modal")
        page.locator("button[type=button]").filter(has_text="Send Request").last.click()
        page.wait_for_timeout(2500)
    pending = requests.get(f"{API}/organizations/deactivation-requests", headers=sup).json()
    mine = [r for r in pending if r["organization_id"] == org["id"]]
    rec("FLOW-04", "Sub Admin submits a deactivation request through the modal", "PENDING request exists", mine[0]["status"] if mine else "none",
        bool(mine) and mine[0]["status"] == "PENDING", shot(page, "FLOW_request_submitted"))
    logout(page)

    # ---- Super Admin approves in UI
    login(page, "demo.superadmin@example.com")
    page.goto(f"{BASE}/superadmin/organization/requests")
    page.wait_for_timeout(2500)
    shot(page, "FLOW_sa_requests")
    card = page.locator("div", has_text=f"qa-tmp-ui-{RUN}").last
    approve = page.get_by_role("button", name="Approve")
    if approve.count():
        approve.first.click()
        page.wait_for_timeout(2500)
    sub_login = api_login(sub_email)
    rec("FLOW-05", "Super Admin approves the request in the UI; organisation members are locked out", "login 403", sub_login.status_code,
        sub_login.status_code == 403, shot(page, "FLOW_request_approved"))

    # ---- reactivate in UI
    page.goto(f"{BASE}/superadmin/organization/organizations")
    page.wait_for_timeout(2500)
    shot(page, "FLOW_sa_inactive_org")
    act = page.get_by_role("button", name="Activate Organization")
    if act.count():
        act.first.click()
        page.wait_for_timeout(2500)
    rec("FLOW-06", "Super Admin re-activates the organisation in the UI; Sub Admin can log in again", "login 200", api_login(sub_email).status_code,
        api_login(sub_email).status_code == 200, shot(page, "FLOW_org_reactivated"))

    # ---- create org via modal
    page.goto(f"{BASE}/superadmin/organization/organizations")
    page.wait_for_timeout(2000)
    page.get_by_role("button", name="Create Organization").first.click()
    page.wait_for_timeout(800)
    page.fill("input[type=text]:visible", f"qa-tmp-ui-{RUN}-created")
    shot(page, "FLOW_create_org_modal")
    page.locator("button[type=submit]:visible").first.click()
    page.wait_for_timeout(2500)
    names = [o["organization_name"] for o in requests.get(f"{API}/organizations/", headers=sup).json()]
    rec("FLOW-07", "Super Admin creates an organisation through the modal", "organisation exists", f"qa-tmp-ui-{RUN}-created" in names,
        f"qa-tmp-ui-{RUN}-created" in names, shot(page, "FLOW_org_created"))

    # ---- invite form
    page.goto(f"{BASE}/superadmin/organization")
    page.wait_for_timeout(2500)
    page.fill("input[placeholder*='full name' i]", "QA Invitee")
    page.fill("input[placeholder*='email' i]", f"qa-tmp-ui-{RUN}-invitee@example.com")
    sel = page.locator("select")
    if sel.count():
        sel.last.select_option(label=f"qa-tmp-ui-{RUN}")
    page.get_by_role("button", name="Send Invitation").click()
    page.wait_for_selector("#manual-invitation-link", timeout=20000)
    txt = page.inner_text("body")
    link_value = page.input_value("#manual-invitation-link")
    rec("FLOW-08", "Invite form with no mail server: shows what went wrong and a copyable invitation link", "amber notice + link box",
        f"notice={'could not be sent' in txt}, link={'yes' if link_value.startswith('http://localhost:5173/#/accept-invitation?token=') else 'no'}",
        "could not be sent" in txt and link_value.startswith("http://localhost:5173/#/accept-invitation?token="), shot(page, "FLOW_invite_result"),
        "No SMTP credentials in .env, so the e-mail cannot be delivered; the Super Admin receives the link instead")
    page.get_by_role("button", name="Copy link").click()
    page.wait_for_timeout(500)
    rec("FLOW-14", "Copy link button works", "button changes to 'Copied'", "Copied" in page.inner_text("body"), "Copied" in page.inner_text("body"))
    bell = requests.get(f"{API}/notifications/", headers=sup).json()
    rec("FLOW-15", "Super Admin's bell shows 'Invitation Not Delivered' for that invitation", "INVITATION_FAILED present",
        [n["notification_type"] for n in bell][:3], any(n["notification_type"] == "INVITATION_FAILED" and "invitee" in n["message"] for n in bell))

    # ---- invitation page opened with the link that the invite form produced
    inv_email = f"qa-tmp-ui-{RUN}-invitee@example.com"
    tk = link_value.split("token=")[1]
    logout(page)
    page.goto(f"{BASE}/accept-invitation?token={tk}")
    page.wait_for_timeout(2000)
    pwf = page.locator("input[type=password]")
    pwf.nth(0).fill("short")
    pwf.nth(1).fill("short")
    page.get_by_role("button", name="Accept Invitation").click()
    page.wait_for_timeout(1000)
    rec("FLOW-09", "Invitation page: password shorter than 8 characters is blocked in the form", "error shown, no account", 
        "Password must be at least 8" in page.inner_text("body"), "Password must be at least 8" in page.inner_text("body"), shot(page, "FLOW_invite_short"))
    pwf.nth(0).fill(PW)
    pwf.nth(1).fill("Different@123")
    page.get_by_role("button", name="Accept Invitation").click()
    page.wait_for_timeout(1000)
    rec("FLOW-10", "Invitation page: mismatching confirmation is blocked", "Passwords do not match", "Passwords do not match" in page.inner_text("body"),
        "Passwords do not match" in page.inner_text("body"))
    pwf.nth(1).fill(PW)
    page.get_by_role("button", name="Accept Invitation").click()
    page.wait_for_timeout(2500)
    rec("FLOW-11", "Invitation page: valid password creates the Sub Admin and shows success", "success message + login works",
        f"login {api_login(inv_email).status_code}", api_login(inv_email).status_code == 200 and "joined" in page.inner_text("body"), shot(page, "FLOW_invite_accepted"))
    login(page, inv_email)
    rec("FLOW-12", "Newly invited Sub Admin signs in and lands on the Sub Admin dashboard", "/subadmin/dashboard", page.url.split("#")[1],
        page.url.endswith("/subadmin/dashboard"), shot(page, "FLOW_invited_dashboard"))
    page.goto(f"{BASE}/accept-invitation?token={tk}")
    page.wait_for_timeout(1500)
    pwf = page.locator("input[type=password]")
    pwf.nth(0).fill(PW); pwf.nth(1).fill(PW)
    page.get_by_role("button", name="Accept Invitation").click()
    page.wait_for_timeout(2000)
    rec("FLOW-13", "Re-opening the same invitation link shows an error", "error text", "already exists" in page.inner_text("body").lower() or "invalid" in page.inner_text("body").lower(),
        "already exists" in page.inner_text("body").lower() or "invalid" in page.inner_text("body").lower(), shot(page, "FLOW_invite_reuse"))
    b.close()

sql = f"""
delete from deactivation_requests where organization_id in (select id from organizations where organization_name like 'qa-tmp-ui-{RUN}%');
delete from notifications where user_id in (select id from users where email like 'qa-tmp-ui-{RUN}%');
delete from users where email like 'qa-tmp-ui-{RUN}%';
delete from organizations where organization_name like 'qa-tmp-ui-{RUN}%';"""
print(subprocess.run(["psql", "focusguard_ai", "-c", sql], capture_output=True, text=True).stdout.replace("\n", " "))
passed = sum(r["status"] == "PASS" for r in res)
(Path(__file__).parent / "flow_results.json").write_text(json.dumps({"total": len(res), "passed": passed, "results": res}, indent=2))
print(f"{passed}/{len(res)} flows passed")
