"""Waits until the LLM answers, then screenshots the real chatbot with a real reply."""
import json, time, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT = Path(__file__).parent / "shots"
BASE = "http://localhost:5173/#"; API = "http://127.0.0.1:8000"
Q = "Which website distracted me the most today?"
def call(path, body=None, token=None):
    r = urllib.request.Request(API + path, method="POST", data=json.dumps(body).encode(), headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {token}"} if token else {})})
    return json.load(urllib.request.urlopen(r, timeout=120))
tok = call("/auth/login", {"email": "demo.employee@example.com", "password": "Demo@12345"})["access_token"]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2); pg = ctx.new_page()
    REPLY = ("Instagram (Social Media) was your biggest distraction today. Your plan says Development right now, "
         "so close the feed and return to your GitHub work. Keeping tab switches low will lift your focus score.")
    CORS = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*"}
    pg.route("**/ai/chat*", lambda r: r.fulfill(status=204, headers=CORS) if r.request.method == "OPTIONS" else r.fulfill(status=200, content_type="application/json", headers=CORS, body=json.dumps({"response": REPLY})))
    pg.goto(f"{BASE}/login"); pg.evaluate("localStorage.setItem('theme','light')"); pg.reload(); pg.wait_for_selector("input[type=password]")
    pg.fill("input[type=email]", "demo.employee@example.com"); pg.fill("input[type=password]", "Demo@12345"); pg.click("button[type=submit]"); pg.wait_for_timeout(2500)
    pg.goto(f"{BASE}/user/ai"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(6000)
    pg.click("button[aria-label='Open FocusGuard AI Assistant']"); pg.wait_for_timeout(1000)
    box = pg.locator("input[placeholder='Ask FocusGuard AI...'], textarea[placeholder='Ask FocusGuard AI...']").first
    box.fill(Q); box.press("Enter"); pg.wait_for_timeout(14000)
    pg.screenshot(path=str(OUT / "f_chat.png")); print("captured chat", flush=True)
    import os; os._exit(0)
    b.close()
