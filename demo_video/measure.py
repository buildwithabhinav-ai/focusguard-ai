"""Measures card rectangles on the real pages so spotlight effects land exactly (css px, page coordinates)."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE = "http://localhost:5173/#"; PW = "Demo@12345"
JOBS = {
  "emp_dashboard": ("demo.employee@example.com", "/user/dashboard", 1500, ["Focus Score","Today's Planner","Current Session","Live Focus Status","AI Recommendation"]),
  "emp_analytics": ("demo.employee@example.com", "/user/analytics", 2100, ["Activity Summary","Website Analytics","Category Analytics","Category Distribution","Website Usage"]),
  "emp_ai": ("demo.employee@example.com", "/user/ai", 1400, ["Today's Productivity Summary","AI Recommendation"]),
  "sa_dashboard": ("demo.superadmin@example.com", "/superadmin/dashboard", 1600, ["Overall Weekly Activity","Overall Monthly Activity"]),
  "sa_org": ("demo.superadmin@example.com", "/superadmin/organization", 2300, ["Invite Sub Admin","Demo Corp Alpha"]),
  "sa_requests": ("demo.superadmin@example.com", "/superadmin/organization/requests", 2300, ["Organization #3"]),
  "sub_users": ("demo.subadmin@example.com", "/subadmin/users", 900, ["Organization Users"]),
  "sub_activity": ("demo.subadmin@example.com", "/subadmin/users/10/activity", 3700, ["Weekly Activity","Monthly Activity","Website Usage","Category Usage","Activity History","Tab Switching"]),
}
JS = """(label) => {
  const els=[...document.querySelectorAll('h1,h2,h3,p,span,div')].filter(e=>e.children.length===0&&e.textContent.trim()===label);
  if(!els.length) return null; let e=els[0];
  while(e && e.parentElement){const r=e.getBoundingClientRect();const cs=getComputedStyle(e);
    if(r.width>240 && r.height>70 && parseFloat(cs.borderTopLeftRadius)>=14) return {x:Math.round(r.x),y:Math.round(r.y+window.scrollY),w:Math.round(r.width),h:Math.round(r.height)};
    e=e.parentElement;}
  return null; }"""
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    for name,(email,path,h,labels) in JOBS.items():
        ctx = b.new_context(viewport={"width":1440,"height":h}); page = ctx.new_page()
        page.goto(f"{BASE}/login"); page.evaluate("localStorage.setItem('theme','light')"); page.reload()
        page.wait_for_selector("input[type=password]"); page.fill("input[type=email]", email); page.fill("input[type=password]", PW); page.click("button[type=submit]")
        page.wait_for_timeout(2500); page.goto(f"{BASE}{path}"); page.wait_for_load_state("networkidle"); page.wait_for_timeout(4500)
        out[name] = {l: page.evaluate(JS, l) for l in labels}
        # stat card row for dashboards
        if name == "emp_dashboard":
            out[name]["stats_row"] = page.evaluate("""()=>{const hs=[...document.querySelectorAll('h2')].filter(e=>/^(70%|7140 min)$/.test(e.textContent.trim()));if(!hs.length)return null;
              const a=hs[0].closest('div[class*=rounded]').getBoundingClientRect();const c=[...document.querySelectorAll('h2')].filter(e=>e.textContent.trim()==='5')[0].closest('div[class*=rounded]').getBoundingClientRect();
              return {x:Math.round(a.x),y:Math.round(a.y+scrollY),w:Math.round(c.right-a.x),h:Math.round(a.height)}}""")
        ctx.close(); print(name, out[name])
    b.close()
Path("spots.json").write_text(json.dumps(out, indent=1))
