"""Real-app screenshots for the feature scenes (planner on/off track, notifications, chatbot, multilingual)."""
import json, subprocess, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).parent / "shots"
BASE = "http://localhost:5173/#"
API = "http://127.0.0.1:8000"
VPY = str(ROOT / "venv/bin/python")
PW = "Demo@12345"
EMAIL = "demo.employee@example.com"

def prep(state, notify=False):
    subprocess.run([VPY, str(Path(__file__).parent / "prep_data.py"), state] + (["--notify"] if notify else []), check=True, cwd=ROOT)

def api(path, method="GET", body=None, token=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {token}"} if token else {})})
    return json.load(urllib.request.urlopen(req, timeout=120))

token = api("/auth/login", "POST", {"email": EMAIL, "password": PW})["access_token"]

def login(b, w=1440, h=900, theme="light"):
    ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=theme)
    pg = ctx.new_page()
    pg.goto(f"{BASE}/login"); pg.evaluate(f"localStorage.setItem('theme','{theme}')"); pg.reload()
    pg.wait_for_selector("input[type=password]")
    pg.fill("input[type=email]", EMAIL); pg.fill("input[type=password]", PW); pg.click("button[type=submit]")
    pg.wait_for_timeout(2500)
    return ctx, pg

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)

    # OFF TRACK + notifications (incl. the AI focus reminder)
    prep("off", notify=True)
    print("check-focus:", api("/planner/check-focus", "POST", token=token).get("status"))
    ctx, pg = login(b, 1440, 1000)
    pg.goto(f"{BASE}/user/planner"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(5000)
    pg.screenshot(path=str(OUT / "f_planner_off.png"))
    pg.goto(f"{BASE}/user/dashboard"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(3500)
    pg.click("button[aria-label=Notifications]"); pg.wait_for_timeout(1800)
    pg.screenshot(path=str(OUT / "f_notif.png"))
    ctx.close()

    # ON TRACK
    prep("on")
    ctx, pg = login(b, 1440, 1000)
    pg.goto(f"{BASE}/user/planner"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(5000)
    pg.screenshot(path=str(OUT / "f_planner_on.png"))
    ctx.close()

    # Chatbot
    ctx, pg = login(b, 1440, 900)
    pg.goto(f"{BASE}/user/ai"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(5000)
    pg.click("button[aria-label='Open FocusGuard AI Assistant']"); pg.wait_for_timeout(1200)
    box = pg.locator("input[placeholder='Ask FocusGuard AI...'], textarea[placeholder='Ask FocusGuard AI...']").first
    box.fill("Which website distracted me the most today?"); box.press("Enter")
    pg.wait_for_timeout(15000)
    pg.screenshot(path=str(OUT / "f_chat.png"))
    ctx.close()

    # Multilingual (Hindi + Tamil)
    for code, name in (("hi", "hindi"), ("ta", "tamil")):
        ctx, pg = login(b, 1440, 900)
        pg.goto(f"{BASE}/user/dashboard"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(3000)
        pg.select_option("select", code); pg.wait_for_timeout(16000)
        pg.screenshot(path=str(OUT / f"f_{name}.png"))
        ctx.close()
    b.close()
