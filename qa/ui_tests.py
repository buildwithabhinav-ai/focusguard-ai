"""Browser (UI) checks: real login form, role redirects, sidebar pages, logout.

Run:  /opt/anaconda3/bin/python3 qa/ui_tests.py   (needs Playwright + Chrome, frontend on :5173)
Writes qa/ui_results.json and screenshots to qa/shots/.
"""
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173/#"
PW = "Demo@12345"
HERE = Path(__file__).parent
SHOTS = HERE / "shots"
res = []


def rec(tid, title, expected, actual, ok, note="", shot=None):
    res.append({"id": tid, "title": title, "expected": expected, "actual": actual,
                "status": "PASS" if ok else "FAIL", "note": note, "shot": shot})
    print(("PASS" if ok else "FAIL"), tid, title, "|", expected, "->", actual)


def path_of(page):
    return page.url.split("#", 1)[1] if "#" in page.url else page.url


def login(page, email, password=PW):
    page.goto(f"{BASE}/login")
    page.wait_for_selector("input[type=email], input[name=email], input[type=text]", timeout=15000)
    page.fill("input[type=email], input[name=email]", email)
    page.fill("input[type=password]", password)
    page.click("button[type=submit]")


def shot(page, name):
    f = f"{name}.png"
    page.wait_for_timeout(1800)
    page.screenshot(path=str(SHOTS / f), full_page=False)
    return f


def logout(page):
    page.get_by_text("Logout", exact=True).first.click()
    page.wait_for_timeout(1200)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    ctx = browser.new_context(viewport={"width": 1366, "height": 820})
    page = ctx.new_page()

    # public pages
    page.goto(f"{BASE}/")
    page.wait_for_timeout(2000)
    rec("UI-01", "Landing page loads for anonymous visitor", "/ stays on landing", path_of(page), path_of(page) in ("/", ""),
        shot=shot(page, "landing"))
    page.goto(f"{BASE}/login")
    page.wait_for_timeout(1500)
    rec("UI-02", "Login page renders", "login form visible", path_of(page), page.locator("input[type=password]").count() == 1,
        shot=shot(page, "login"))
    page.goto(f"{BASE}/superadmin/dashboard")
    page.wait_for_timeout(1500)
    rec("UI-03", "Anonymous visitor opening a protected URL is sent to /login", "/login", path_of(page), path_of(page) == "/login")
    page.goto(f"{BASE}/register")
    page.wait_for_timeout(1500)
    rec("UI-04", "Register page renders", "register form visible", path_of(page), path_of(page) == "/register", shot=shot(page, "register"))
    page.goto(f"{BASE}/forgot-password")
    page.wait_for_timeout(1500)
    body = page.inner_text("body")[:200].replace("\n", " ")
    rec("UI-05", "'Forgot Password?' link target opens a working page", "forgot-password page", f"{path_of(page)} -> '{body[:60]}'",
        path_of(page) == "/forgot-password" and len(body.strip()) > 20,
        "Link exists on login form but no /forgot-password route is defined and ForgotPasswordPage.tsx is an empty file")
    page.goto(f"{BASE}/accept-invitation")
    page.wait_for_timeout(1500)
    rec("UI-06", "Invitation page without token shows 'Invalid Invitation'", "Invalid Invitation text", page.inner_text("body")[:60].replace("\n", " "),
        "Invalid Invitation" in page.inner_text("body"), shot=shot(page, "invite_invalid"))

    # bad login
    login(page, "demo.user@example.com", "WrongPass1")
    page.wait_for_timeout(1500)
    rec("UI-07", "Wrong password shows an error and stays on login", "/login + error toast", path_of(page), path_of(page) == "/login",
        shot=shot(page, "login_error"))

    roles = [
        ("SA", "demo.superadmin@example.com", "/superadmin", ["dashboard", "planner", "analytics", "ai", "reports", "organization", "users", "settings"]),
        ("SUB", "demo.subadmin@example.com", "/subadmin", ["dashboard", "planner", "analytics", "ai", "reports", "organization", "users", "settings"]),
        ("EMP", "demo.employee@example.com", "/user", ["dashboard", "planner", "analytics", "ai", "reports", "settings"]),
        ("USR", "demo.user@example.com", "/user", ["dashboard", "planner", "analytics", "ai", "reports", "settings"]),
    ]
    n = 8
    for code, email, prefix, pages in roles:
        login(page, email)
        page.wait_for_timeout(2500)
        rec(f"UI-{n}", f"{code}: login redirects to {prefix}/dashboard", f"{prefix}/dashboard", path_of(page),
            path_of(page) == f"{prefix}/dashboard", shot=shot(page, f"{code}_dashboard"))
        n += 1
        # sidebar entries visible
        side = page.inner_text("body")
        has_org = "Organization" in side
        has_users = "Users" in side
        expect_admin = code in ("SA", "SUB")
        rec(f"UI-{n}", f"{code}: sidebar shows Organization/Users only for admins", f"admin links {'shown' if expect_admin else 'hidden'}",
            f"Organization={has_org}, Users={has_users}", (has_org and has_users) == expect_admin)
        n += 1
        for pg in pages[1:]:
            page.goto(f"{BASE}{prefix}/{pg}")
            page.wait_for_timeout(1800)
            errs = page.locator("text=/something went wrong|Application error|Unexpected/i").count()
            ok = path_of(page) == f"{prefix}/{pg}" and errs == 0
            rec(f"UI-{n}", f"{code}: {pg} page opens", f"{prefix}/{pg}, no crash", path_of(page), ok, shot=shot(page, f"{code}_{pg}"))
            n += 1
        # cross-role URL guard
        other = "/superadmin/dashboard" if prefix != "/superadmin" else "/subadmin/dashboard"
        page.goto(f"{BASE}{other}")
        page.wait_for_timeout(1800)
        rec(f"UI-{n}", f"{code}: opening {other} is redirected back to own area", f"{prefix}/dashboard", path_of(page),
            path_of(page) == f"{prefix}/dashboard")
        n += 1
        if prefix != "/user":
            page.goto(f"{BASE}/user/dashboard")
            page.wait_for_timeout(1800)
            rec(f"UI-{n}", f"{code}: opening /user/dashboard is redirected back", f"{prefix}/dashboard", path_of(page), path_of(page) == f"{prefix}/dashboard")
            n += 1
        # logged-in user visiting /login bounces to dashboard
        page.goto(f"{BASE}/login")
        page.wait_for_timeout(1500)
        rec(f"UI-{n}", f"{code}: visiting /login while signed in redirects to dashboard", f"{prefix}/dashboard", path_of(page), path_of(page) == f"{prefix}/dashboard")
        n += 1
        # logout
        page.goto(f"{BASE}{prefix}/dashboard")
        page.wait_for_timeout(1500)
        logout(page)
        tok = page.evaluate("localStorage.getItem('access_token')")
        rec(f"UI-{n}", f"{code}: logout clears the session and returns to login/landing", "no token, public page", f"token={'present' if tok else 'none'}, {path_of(page)}",
            tok is None and path_of(page) in ("/login", "/", ""))
        n += 1
        page.goto(f"{BASE}{prefix}/dashboard")
        page.wait_for_timeout(1500)
        rec(f"UI-{n}", f"{code}: after logout the protected URL is blocked", "/login", path_of(page), path_of(page) == "/login")
        n += 1

    # sub admin specific pages
    login(page, "demo.subadmin@example.com")
    page.wait_for_timeout(2500)
    page.goto(f"{BASE}/subadmin/users")
    page.wait_for_timeout(2500)
    txt = page.inner_text("body")
    rec(f"UI-{n}", "SUB: users page lists Alpha employees only", "Alpha One/Two visible, Beta hidden",
        f"Alpha One={'Demo Employee Alpha One' in txt}, Beta={'Beta' in txt.replace('Demo Corp Beta','')}",
        "Demo Employee Alpha One" in txt and "Demo Employee Beta One" not in txt, shot=shot(page, "SUB_users_detail"))
    n += 1
    page.goto(f"{BASE}/subadmin/users/999999/activity")
    page.wait_for_timeout(2000)
    rec(f"UI-{n}", "SUB: opening activity of a non-existent user does not crash the app", "page still renders", path_of(page), len(page.inner_text("body")) > 20)
    n += 1
    page.goto(f"{BASE}/subadmin/organization")
    page.wait_for_timeout(2500)
    txt = page.inner_text("body")
    rec(f"UI-{n}", "SUB: organisation page shows own organisation", "Demo Corp Alpha", "Demo Corp Alpha" in txt, "Demo Corp Alpha" in txt,
        shot=shot(page, "SUB_organization_detail"))
    n += 1
    logout(page)

    # super admin organisation tabs
    login(page, "demo.superadmin@example.com")
    page.wait_for_timeout(2500)
    for tab in ["organizations", "users", "requests"]:
        page.goto(f"{BASE}/superadmin/organization/{tab}")
        page.wait_for_timeout(2200)
        txt = page.inner_text("body")
        rec(f"UI-{n}", f"SA: organisation tab '{tab}' opens", f"/superadmin/organization/{tab}", path_of(page),
            path_of(page) == f"/superadmin/organization/{tab}", shot=shot(page, f"SA_org_{tab}"))
        n += 1
    page.goto(f"{BASE}/superadmin/organization/organizations")
    page.wait_for_timeout(2200)
    txt = page.inner_text("body")
    rec(f"UI-{n}", "SA: organisation list shows Demo Corp Alpha and Beta", "both visible",
        f"Alpha={'Demo Corp Alpha' in txt}, Beta={'Demo Corp Beta' in txt}", "Demo Corp Alpha" in txt and "Demo Corp Beta" in txt)
    n += 1
    logout(page)

    # token expiry behaviour in UI
    login(page, "demo.user@example.com")
    page.wait_for_timeout(2500)
    page.evaluate("localStorage.setItem('access_token','garbage')")
    page.goto(f"{BASE}/user/dashboard")
    page.reload()
    page.wait_for_timeout(2500)
    rec(f"UI-{n}", "Corrupted/expired token in storage sends user back to login", "/login", path_of(page), path_of(page) == "/login")
    n += 1

    # token expiry in the middle of a session
    login(page, "demo.user@example.com")
    page.wait_for_timeout(2500)
    page.evaluate("localStorage.setItem('access_token','expired-or-invalid')")
    page.get_by_text("Analytics", exact=True).first.click()
    page.wait_for_timeout(3500)
    rec(f"UI-{n}", "Session expires while the user is working: next action sends them to login", "/login", path_of(page), path_of(page) == "/login",
        "Front end has no 401 handler and never calls /auth/refresh-token, so after the 60-minute token expires the pages silently fail instead of asking the user to log in again",
        shot=shot(page, "expired_midsession"))
    n += 1

    # mobile viewport
    ctx2 = browser.new_context(viewport={"width": 390, "height": 800})
    m = ctx2.new_page()
    login(m, "demo.employee@example.com")
    m.wait_for_timeout(2500)
    rec(f"UI-{n}", "Mobile width (390px): login works and dashboard renders", "/user/dashboard", path_of(m), path_of(m) == "/user/dashboard",
        shot=shot(m, "EMP_dashboard_mobile"))
    browser.close()

passed = sum(r["status"] == "PASS" for r in res)
(HERE / "ui_results.json").write_text(json.dumps({"total": len(res), "passed": passed, "failed": len(res) - passed, "results": res}, indent=2))
print(f"\n{passed}/{len(res)} UI checks passed")
