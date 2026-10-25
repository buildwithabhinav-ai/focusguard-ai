"""Tall planner screenshots in both live states (ON TRACK / OFF TRACK)."""
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).parent / "shots"
BASE = "http://localhost:5173/#"
def prep(s): subprocess.run([str(ROOT/"venv/bin/python"), str(Path(__file__).parent/"prep_data.py"), s], check=True, cwd=ROOT)
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    for state in ("on", "off"):
        prep(state)
        ctx = b.new_context(viewport={"width": 1440, "height": 1450}, device_scale_factor=2)
        pg = ctx.new_page()
        pg.goto(f"{BASE}/login"); pg.evaluate("localStorage.setItem('theme','light')"); pg.reload(); pg.wait_for_selector("input[type=password]")
        pg.fill("input[type=email]", "demo.employee@example.com"); pg.fill("input[type=password]", "Demo@12345"); pg.click("button[type=submit]"); pg.wait_for_timeout(2500)
        pg.evaluate("localStorage.setItem('language','en')"); pg.goto(f"{BASE}/user/planner"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(6000)
        pg.screenshot(path=str(OUT / f"f_planner_{state}.png"))
        ctx.close()
    b.close()
