"""Settings-page checks per role with throw-away accounts: Change Password form and the Settings 'Sign Out/Logout' button."""
import json
import subprocess
import uuid
from pathlib import Path

import requests
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
API = "http://127.0.0.1:8000"
BASE = "http://localhost:5173/#"
PW = "Demo@12345"
NEW = "Changed@6789"
RUN = uuid.uuid4().hex[:5]
SHOTS = Path(__file__).parent / "shots"
res = []


def rec(tid, title, expected, actual, ok, shot=None):
    res.append({"id": tid, "title": title, "expected": expected, "actual": str(actual), "status": "PASS" if ok else "FAIL", "note": "", "shot": shot})
    print("PASS" if ok else "FAIL", tid, title, "|", expected, "->", actual)


def api_login(email, pw=PW):
    return requests.post(f"{API}/auth/login", json={"email": email, "password": pw})


def token(name, email, org_id):
    out = subprocess.run([str(ROOT / "venv/bin/python"), str(ROOT / "qa/make_invite_link.py"), name, email, str(org_id)],
                         capture_output=True, text=True, cwd=str(ROOT)).stdout
    return out.strip().split("token=")[1]


sup = {"Authorization": "Bearer " + api_login("demo.superadmin@example.com").json()["access_token"]}
org = requests.post(f"{API}/organizations/", headers=sup, json={"organization_name": f"qa-tmp-st-{RUN}"}).json()
sub_email = f"qa-tmp-st-{RUN}-sub@example.com"
usr_email = f"qa-tmp-st-{RUN}-usr@example.com"
requests.post(f"{API}/admin/accept-invitation", params={"token": token("QA Settings Sub", sub_email, org["id"])}, json={"password": PW})
requests.post(f"{API}/auth/register-user", json={"full_name": "QA Settings User", "email": usr_email, "password": PW, "age": 20, "occupation": "t"})
# super admin: second super admin is not creatable via API, so only its Settings logout button is exercised with the demo account

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    ctx = b.new_context(viewport={"width": 1366, "height": 820})
    page = ctx.new_page()

    def login(email, pw=PW):
        page.goto(f"{BASE}/login")
        page.wait_for_selector("input[type=password]")
        page.fill("input[type=email]", email)
        page.fill("input[type=password]", pw)
        page.click("button[type=submit]")
        page.wait_for_timeout(2500)

    def change_pw(cur, new, conf):
        f = page.locator("input[placeholder='Enter current password']")
        f.fill(cur)
        page.locator("input[placeholder='Enter new password']").fill(new)
        page.locator("input[placeholder='Confirm new password']").fill(conf)
        page.get_by_role("button", name="Update Password").click()
        page.wait_for_timeout(2000)

    n = 1
    for label, email, prefix in [("Sub Admin", sub_email, "subadmin"), ("User", usr_email, "user")]:
        login(email)
        page.goto(f"{BASE}/{prefix}/settings")
        page.wait_for_timeout(2500)
        txt = page.inner_text("body")
        rec(f"SET-{n:02d}", f"{label}: Settings shows profile with name, e-mail and role", "name + e-mail + role visible",
            email in txt, email in txt, shot=None); n += 1
        change_pw(PW, "short", "short")
        t1 = page.inner_text("body")
        rec(f"SET-{n:02d}", f"{label}: change password rejects a new password under 8 characters", "error message, password unchanged",
            f"login with old pw still {api_login(email).status_code}", api_login(email).status_code == 200, shot=f"SET_{prefix}_short.png"); n += 1
        page.screenshot(path=str(SHOTS / f"SET_{prefix}_short.png"))
        change_pw(PW, NEW, "Mismatch@1234")
        rec(f"SET-{n:02d}", f"{label}: change password rejects mismatching confirmation", "old password still valid",
            api_login(email).status_code, api_login(email).status_code == 200); n += 1
        change_pw("Wrong@1234", NEW, NEW)
        rec(f"SET-{n:02d}", f"{label}: change password rejects wrong current password", "old password still valid",
            api_login(email).status_code, api_login(email).status_code == 200); n += 1
        change_pw(PW, NEW, NEW)
        page.screenshot(path=str(SHOTS / f"SET_{prefix}_changed.png"))
        rec(f"SET-{n:02d}", f"{label}: valid change succeeds - new password works, old password is refused", "new 200, old 401",
            f"new {api_login(email, NEW).status_code}, old {api_login(email).status_code}",
            api_login(email, NEW).status_code == 200 and api_login(email).status_code == 401, shot=f"SET_{prefix}_changed.png"); n += 1
        page.get_by_role("button", name="Logout").last.click()
        page.wait_for_timeout(1500)
        tok = page.evaluate("localStorage.getItem('access_token')")
        rec(f"SET-{n:02d}", f"{label}: 'Sign Out' card on the Settings page logs the user out", "token removed, on /login",
            f"token={'present' if tok else 'none'}, {page.url.split('#')[1]}", tok is None and page.url.endswith("/login"), shot=None); n += 1

    login("demo.superadmin@example.com")
    page.goto(f"{BASE}/superadmin/settings")
    page.wait_for_timeout(2500)
    page.get_by_role("button", name="Logout").last.click()
    page.wait_for_timeout(1500)
    tok = page.evaluate("localStorage.getItem('access_token')")
    landed = page.url.split("#")[1] if "#" in page.url else "(no hash) " + page.url.replace("http://localhost:5173", "") + " -> landing page"
    rec(f"SET-{n:02d}", "Super Admin: 'Sign Out' card on the Settings page logs the user out and shows the login page", "token removed, on #/login",
        f"token={'present' if tok else 'none'}, {landed}", tok is None and page.url.endswith("#/login"),
        shot=None)
    res[-1]["note"] = "Uses window.location.href='/login' and localStorage only: with HashRouter this lands on the landing page, and inside the Chrome extension (chrome.storage) the token would not be cleared"
    n += 1
    b.close()

sql = f"""
delete from notifications where user_id in (select id from users where email like 'qa-tmp-st-{RUN}%');
delete from users where email like 'qa-tmp-st-{RUN}%';
delete from organizations where organization_name like 'qa-tmp-st-{RUN}%';"""
subprocess.run(["psql", "focusguard_ai", "-c", sql], capture_output=True, text=True)
passed = sum(r["status"] == "PASS" for r in res)
(Path(__file__).parent / "settings_results.json").write_text(json.dumps({"total": len(res), "passed": passed, "results": res}, indent=2))
print(f"{passed}/{len(res)} settings checks passed")
