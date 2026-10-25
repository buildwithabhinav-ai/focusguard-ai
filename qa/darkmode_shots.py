"""Screenshots of the Sub Admin's 'View Activity' page in dark mode, scrolled section by section.
Usage: /opt/anaconda3/bin/python3 qa/darkmode_shots.py <label>"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

label = sys.argv[1]
SHOTS = Path(__file__).parent / "shots"
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    page = b.new_context(viewport={"width": 1366, "height": 900}, color_scheme="dark").new_page()
    page.goto("http://localhost:5173/#/login")
    page.evaluate("localStorage.setItem('theme','dark')")
    page.reload()
    page.wait_for_selector("input[type=password]")
    page.fill("input[type=email]", "demo.subadmin@example.com")
    page.fill("input[type=password]", "Demo@12345")
    page.click("button[type=submit]")
    page.wait_for_timeout(2500)
    page.goto("http://localhost:5173/#/subadmin/users/10/activity")
    page.wait_for_selector("text=Weekly Activity")
    page.wait_for_selector("text=Monday")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2500)
    js = """(top) => { const els=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+50});
        const el = els.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0]; if(!el) { window.scrollTo(0,top); return -1; } el.scrollTop = top; return el.scrollHeight; }"""
    for i, top in enumerate([0, 820, 1640, 2460, 3280, 4100]):
        h = page.evaluate(js, top)
        page.wait_for_timeout(800)
        page.screenshot(path=str(SHOTS / f"dark_{label}_{i}.png"))
        print(label, top, "scrollHeight", h)
    b.close()
