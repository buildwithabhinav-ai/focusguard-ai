"""Renders video.html frame by frame (deterministic) with several browser processes."""
import json, os, subprocess, sys, time
from multiprocessing import Pool
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
FRAMES = HERE / "frames"
PORT = 8765

def work(args):
    lo, hi, fps = args
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        page = b.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(f"http://127.0.0.1:{PORT}/video.html")
        page.evaluate("window.__ready")
        for i in range(lo, hi):
            page.evaluate(f"render({i / fps})")
            page.screenshot(path=str(FRAMES / f"f{i:05d}.jpg"), type="jpeg", quality=94)
        b.close()
    return hi - lo

if __name__ == "__main__":
    tl = json.load(open(HERE / "timeline.json"))
    fps, total = tl["fps"], tl["total"]
    n = int(total * fps)
    lo0, hi0 = (int(x) for x in os.environ['RANGE'].split(':')) if os.environ.get('RANGE') else (0, n)   # optional: RANGE=lo:hi re-renders only those frames
    only = sys.argv[1:]            # optional: specific times (seconds) for a quick preview
    FRAMES.mkdir(exist_ok=True)
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=str(HERE), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.0)
    try:
        if only:
            with sync_playwright() as p:
                b = p.chromium.launch(channel="chrome", headless=True)
                page = b.new_page(viewport={"width": 1920, "height": 1080})
                page.goto(f"http://127.0.0.1:{PORT}/video.html")
                page.evaluate("window.__ready")
                errs = []
                page.on("pageerror", lambda e: errs.append(str(e)))
                for s in only:
                    page.evaluate(f"render({float(s)})")
                    page.screenshot(path=str(HERE / f"preview_{float(s):05.1f}.jpg"), type="jpeg", quality=90)
                print("errors:", errs)
                b.close()
        else:
            workers = 4
            step = (hi0 - lo0 + workers - 1) // workers
            jobs = [(lo0 + i * step, min(hi0, lo0 + (i + 1) * step), fps) for i in range(workers)]
            t0 = time.time()
            with Pool(workers) as pool:
                print(sum(pool.map(work, jobs)), "frames in", round(time.time() - t0), "s")
    finally:
        srv.terminate()
