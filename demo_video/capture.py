"""Captures crisp (2x) screenshots of the real app for the demo video."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173/#"
OUT = Path(__file__).parent / "shots"
PW = "Demo@12345"

JOBS = [  # (name, role email or None, path, width, height, theme, settle_ms)
    ("login",          None, "/login", 1440, 900, "light", 1500),
    ("landing",        None, "/", 1440, 900, "light", 3000),
    ("emp_dashboard",  "demo.employee@example.com", "/user/dashboard", 1440, 1500, "light", 4000),
    ("emp_planner",    "demo.employee@example.com", "/user/planner", 1440, 1400, "light", 4000),
    ("emp_analytics",  "demo.employee@example.com", "/user/analytics", 1440, 2100, "light", 4500),
    ("emp_reports",    "demo.employee@example.com", "/user/reports", 1440, 1600, "light", 4000),
    ("emp_ai",         "demo.employee@example.com", "/user/ai", 1440, 1400, "light", 9000),
    ("emp_dashboard_dark", "demo.employee@example.com", "/user/dashboard", 1440, 1500, "dark", 4000),
    ("sa_dashboard",   "demo.superadmin@example.com", "/superadmin/dashboard", 1440, 1600, "light", 4500),
    ("sa_org",         "demo.superadmin@example.com", "/superadmin/organization", 1440, 2300, "light", 4000),
    ("sa_requests",    "demo.superadmin@example.com", "/superadmin/organization/requests", 1440, 2300, "light", 4000),
    ("sa_users",       "demo.superadmin@example.com", "/superadmin/users", 1440, 1100, "light", 4000),
    ("sa_analytics",   "demo.superadmin@example.com", "/superadmin/analytics", 1440, 2200, "light", 4500),
    ("sub_dashboard",  "demo.subadmin@example.com", "/subadmin/dashboard", 1440, 1500, "light", 4500),
    ("sub_analytics",  "demo.subadmin@example.com", "/subadmin/analytics", 1440, 2200, "light", 4500),
    ("sub_users",      "demo.subadmin@example.com", "/subadmin/users", 1440, 900, "light", 4000),
    ("sub_activity",   "demo.subadmin@example.com", "/subadmin/users/10/activity", 1440, 3700, "light", 5000),
    ("sub_activity_dark", "demo.subadmin@example.com", "/subadmin/users/10/activity", 1440, 3700, "dark", 5000),
    ("sub_org",        "demo.subadmin@example.com", "/subadmin/organization", 1440, 1100, "light", 4000),
]

BOXES = {}

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    for name, email, path, w, h, theme, settle in JOBS:
        ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=theme)
        page = ctx.new_page()
        page.goto(f"{BASE}/login")
        page.evaluate(f"localStorage.setItem('theme','{theme}')")
        if email:
            page.reload()
            page.wait_for_selector("input[type=password]")
            page.fill("input[type=email]", email)
            page.fill("input[type=password]", PW)
            page.click("button[type=submit]")
            page.wait_for_timeout(2500)
        page.goto(f"{BASE}{path}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(settle)
        page.screenshot(path=str(OUT / f"{name}.png"))
        boxes = page.evaluate("""() => [...document.querySelectorAll('h1,h2,h3,button,a,th,[role=button]')].map(e => {
            const r = e.getBoundingClientRect(); return {tag: e.tagName, text: (e.innerText||'').trim().slice(0,50), x: Math.round(r.x), y: Math.round(r.y+window.scrollY), w: Math.round(r.width), h: Math.round(r.height)}; }).filter(b => b.w > 0 && b.h > 0 && b.text)""")
        BOXES[name] = boxes
        print("captured", name)
        ctx.close()

    # phone view of the employee dashboard
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, color_scheme="light", is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto(f"{BASE}/login"); page.evaluate("localStorage.setItem('theme','light')"); page.reload()
    page.wait_for_selector("input[type=password]")
    page.fill("input[type=email]", "demo.employee@example.com"); page.fill("input[type=password]", PW); page.click("button[type=submit]")
    page.wait_for_timeout(2500)
    page.goto(f"{BASE}/user/dashboard"); page.wait_for_load_state("networkidle"); page.wait_for_timeout(4000)
    page.screenshot(path=str(OUT / "phone_dashboard.png"))
    print("captured phone")
    ctx.close()

    # Chrome extension popup
    ctx = b.new_context(viewport={"width": 420, "height": 560}, device_scale_factor=3)
    page = ctx.new_page()
    popup = Path(__file__).resolve().parent.parent / "chrome_extension" / "popup.html"
    page.goto(popup.as_uri())
    page.fill("#email", "priya.sharma@example.com")
    page.fill("#password", "password123")
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "ext_popup.png"))
    print("captured popup")
    b.close()

(OUT.parent / "boxes.json").write_text(json.dumps(BOXES, indent=1))
