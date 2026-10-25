"""Builds FocusGuard_AI_QA_Test_Report.pdf from the JSON results and screenshots in qa/."""
import json
import html
from collections import OrderedDict
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Frame, Image, KeepTogether, NextPageTemplate, PageBreak,
                                PageTemplate, Paragraph, Preformatted, Spacer, Table, TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents

HERE = Path(__file__).parent
OUT = HERE.parent / "FocusGuard_AI_QA_Test_Report.pdf"
SHOTS = HERE / "shots"

F = "/System/Library/Fonts/Supplemental/"
pdfmetrics.registerFont(TTFont("Body", F + "Arial.ttf"))
pdfmetrics.registerFont(TTFont("Body-B", F + "Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Body-I", F + "Arial Italic.ttf"))
pdfmetrics.registerFont(TTFont("Body-BI", F + "Arial Bold Italic.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-B", italic="Body-I", boldItalic="Body-BI")

INDIGO = colors.HexColor("#4338CA")
INDIGO_L = colors.HexColor("#EEF2FF")
INK = colors.HexColor("#0F172A")
MUTED = colors.HexColor("#64748B")
LINE = colors.HexColor("#CBD5E1")
ZEBRA = colors.HexColor("#F8FAFC")
GREEN = colors.HexColor("#15803D")
GREEN_L = colors.HexColor("#DCFCE7")
RED = colors.HexColor("#B91C1C")
RED_L = colors.HexColor("#FEE2E2")
AMBER = colors.HexColor("#B45309")
AMBER_L = colors.HexColor("#FEF3C7")
BLUE_L = colors.HexColor("#DBEAFE")

S = {}
S["body"] = ParagraphStyle("body", fontName="Body", fontSize=9.5, leading=13.5, textColor=INK, spaceAfter=5)
S["small"] = ParagraphStyle("small", parent=S["body"], fontSize=8, leading=10.5, spaceAfter=0)
S["cell"] = ParagraphStyle("cell", parent=S["body"], fontSize=8, leading=10.2, spaceAfter=0)
S["cellb"] = ParagraphStyle("cellb", parent=S["cell"], fontName="Body-B")
S["cellh"] = ParagraphStyle("cellh", parent=S["cell"], fontName="Body-B", textColor=colors.white)
S["tiny"] = ParagraphStyle("tiny", parent=S["cell"], fontSize=7.2, leading=9)
S["h1"] = ParagraphStyle("h1", fontName="Body-B", fontSize=19, leading=23, textColor=INDIGO, spaceBefore=4, spaceAfter=9)
S["h2"] = ParagraphStyle("h2", fontName="Body-B", fontSize=13, leading=17, textColor=INK, spaceBefore=11, spaceAfter=5)
S["h3"] = ParagraphStyle("h3", fontName="Body-B", fontSize=10.5, leading=14, textColor=INDIGO, spaceBefore=8, spaceAfter=3)
S["bullet"] = ParagraphStyle("bullet", parent=S["body"], leftIndent=13, bulletIndent=2, spaceAfter=2.5)
S["note"] = ParagraphStyle("note", parent=S["body"], fontSize=8.8, leading=12.5, textColor=colors.HexColor("#334155"))
S["cover_t"] = ParagraphStyle("cover_t", fontName="Body-B", fontSize=31, leading=37, textColor=colors.white)
S["cover_s"] = ParagraphStyle("cover_s", fontName="Body", fontSize=13.5, leading=19, textColor=colors.HexColor("#E0E7FF"))
S["code"] = ParagraphStyle("code", fontName="Courier", fontSize=8, leading=10.5, textColor=INK)
S["h1x"] = ParagraphStyle("h1x", fontName="Body-B", fontSize=19, leading=23, textColor=INDIGO, spaceBefore=4, spaceAfter=9)
S["toc1"] = ParagraphStyle("toc1", fontName="Body", fontSize=10.5, leading=17, leftIndent=0, textColor=INK)

api = json.load(open(HERE / "results.json"))
mail = json.load(open(HERE / "email_results.json"))
ext = json.load(open(HERE / "extension_results.json"))
popup = json.load(open(HERE / "extension_popup_results.json"))
ui = json.load(open(HERE / "ui_results.json"))
flow = json.load(open(HERE / "flow_results.json"))
sett = json.load(open(HERE / "settings_results.json"))


def esc(x):
    return html.escape(str(x), quote=False)


def P(t, s="body"):
    return Paragraph(t, S[s])


def bullets(items, style="bullet"):
    return [Paragraph(i, S[style], bulletText="•") for i in items]


def code(text):
    t = Table([[Preformatted(text, S["code"])]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")), ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                           ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return [t, Spacer(1, 6)]


def callout(text, kind="info"):
    bg, bd = {"info": (INDIGO_L, INDIGO), "warn": (AMBER_L, AMBER), "bad": (RED_L, RED), "ok": (GREEN_L, GREEN)}[kind]
    t = Table([[Paragraph(text, S["note"])]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("LINEBEFORE", (0, 0), (0, -1), 3, bd),
                           ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return [t, Spacer(1, 7)]


W = A4[0] - 36 * mm


def table(rows, widths, head=True, zebra=True, status_col=None, pad=3.2, font="cell"):
    data = []
    for ri, r in enumerate(rows):
        row = []
        for ci, c in enumerate(r):
            if isinstance(c, str):
                st = "cellh" if (head and ri == 0) else font
                row.append(Paragraph(c, S[st]))
            else:
                row.append(c)
        data.append(row)
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    style = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 4.5), ("RIGHTPADDING", (0, 0), (-1, -1), 4.5),
             ("TOPPADDING", (0, 0), (-1, -1), pad), ("BOTTOMPADDING", (0, 0), (-1, -1), pad),
             ("LINEBELOW", (0, 0), (-1, -1), 0.35, LINE)]
    if head:
        style += [("BACKGROUND", (0, 0), (-1, 0), INDIGO)]
    if zebra:
        for i in range(1 if head else 0, len(data)):
            if i % 2 == 0:
                style.append(("BACKGROUND", (0, i), (-1, i), ZEBRA))
    if status_col is not None:
        for i, r in enumerate(rows):
            if i == 0 and head:
                continue
            raw = r[status_col] if isinstance(r[status_col], str) else ""
            key = raw.replace("<b>", "").replace("</b>", "").strip().upper()
            bg = {"PASS": GREEN_L, "FAIL": RED_L, "BLOCKED": AMBER_L}.get(key)
            if bg:
                style.append(("BACKGROUND", (status_col, i), (status_col, i), bg))
    t.setStyle(TableStyle(style))
    return t


def stat_box(label, value, bg, fg):
    t = Table([[Paragraph(f'<font size="20"><b>{value}</b></font>', ParagraphStyle("x", fontName="Body-B", alignment=TA_CENTER, textColor=fg, leading=24))],
               [Paragraph(label, ParagraphStyle("y", fontName="Body", fontSize=8, alignment=TA_CENTER, textColor=fg, leading=10))]],
              colWidths=[(W - 18) / 4])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return t


class Doc(BaseDocTemplate):
    def afterFlowable(self, fl):
        if isinstance(fl, Paragraph) and fl.style.name == "h1":
            self.notify("TOCEntry", (0, fl.getPlainText(), self.page))


def cover_bg(c, d):
    c.saveState()
    c.setFillColor(INDIGO)
    c.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#3730A3"))
    c.circle(A4[0] - 30 * mm, A4[1] - 40 * mm, 95 * mm, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#312E81"))
    c.circle(10 * mm, 20 * mm, 70 * mm, fill=1, stroke=0)
    c.restoreState()


def body_bg(c, d):
    c.saveState()
    c.setFont("Body", 7.8)
    c.setFillColor(MUTED)
    c.drawString(18 * mm, A4[1] - 11 * mm, "FocusGuard AI  |  End-to-end QA test guide & report")
    c.drawRightString(A4[0] - 18 * mm, A4[1] - 11 * mm, "Local test environment  |  " + date.today().strftime("%d %b %Y"))
    c.setStrokeColor(LINE)
    c.line(18 * mm, A4[1] - 13 * mm, A4[0] - 18 * mm, A4[1] - 13 * mm)
    c.drawCentredString(A4[0] / 2, 9 * mm, f"Page {d.page}")
    c.restoreState()


doc = Doc(str(OUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=20 * mm, bottomMargin=17 * mm,
          title="FocusGuard AI - End-to-end QA test guide and report", author="QA")
doc.addPageTemplates([
    PageTemplate("cover", [Frame(0, 0, A4[0], A4[1], leftPadding=22 * mm, rightPadding=22 * mm, topPadding=0, bottomPadding=0)], onPage=cover_bg),
    PageTemplate("body", [Frame(18 * mm, 17 * mm, W, A4[1] - 37 * mm, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=body_bg),
])

# ----------------------------------------------------------------------------
# numbers
# ----------------------------------------------------------------------------
suites = OrderedDict([
    ("API (backend) tests", api["results"]),
    ("Browser UI tests", ui["results"]),
    ("Interactive UI flows", flow["results"]),
    ("Settings-page tests", sett["results"]),
    ("E-mail flow tests", mail["results"]),
    ("Extension tab-tracking tests", ext["results"]),
    ("Extension login-popup tests", popup["results"]),
])
tot = sum(len(v) for v in suites.values())
npass = sum(r["status"] == "PASS" for v in suites.values() for r in v)
nfail = sum(r["status"] == "FAIL" for v in suites.values() for r in v)
nblock = sum(r["status"] == "BLOCKED" for v in suites.values() for r in v)

DEFECTS = [
    ("D-01", "High", "Deactivation does not end existing sessions",
     "SUB-28, SUB-28b, ORG-20",
     "<b>dependencies.py</b> (<font name='Courier'>get_current_user</font>) never checks <font name='Courier'>is_active</font> or the organisation status, and <font name='Courier'>/auth/refresh-token</font> issues a new token without any database check. "
     "Login is blocked, but a deactivated employee (or every member of a deactivated organisation) keeps full API access with the token they already hold - 60 minutes - and can renew it with the refresh token for 7 days.",
     "Login as an employee, keep the token, have the Sub Admin deactivate that employee, call <font name='Courier'>GET /users/me</font> with the old token: still 200.",
     "Check <font name='Courier'>user.is_active</font> and <font name='Courier'>organization.is_active</font> inside get_current_user and in the refresh endpoint."),
    ("D-02", "High", "Invitation e-mail cannot be sent; invitation link is lost and hard-coded to localhost",
     "INV-01, INV-17, FLOW-08",
     "<font name='Courier'>.env</font> still holds placeholder <font name='Courier'>EMAIL_ADDRESS / EMAIL_PASSWORD</font>, so <font name='Courier'>POST /admin/invite-sub-admin</font> answers 500 \"Unable to send invitation email.\" "
     "The signed link is only ever e-mailed - the Super Admin cannot copy it as a fallback. The link base <font name='Courier'>http://localhost:5173</font> is hard-coded in admin.py, so even with working SMTP it breaks on any deployed host.",
     "Super Admin &gt; Organization &gt; Invite Sub Admin &gt; Send Invitation: red banner \"Unable to send invitation email.\"",
     "Run setup_email.py with a real Gmail App Password; (done) read the front-end base URL from FRONTEND_URL and return the link to the Super Admin."),
    ("D-18", "Medium", "Tab switches are lost, duplicated or invented (Chrome extension + summary count)",
     "TAB-01..16, EXT-01..12",
     "Chrome stops the extension's background worker after about 30 seconds of inactivity and the extension kept the 'previous website' only in memory, so the first switch after every wake-up was lost. "
     "Tab, page-load and window events were handled in parallel (double or missing records), pages were compared by <i>title</i> (\"(3) Inbox\" vs \"Inbox\" counted as a switch, and normal navigation inside one site too), window changes were ignored, "
     "the API accepted empty names and double reports, and the Summary screen counted activity rows minus one instead of tab switches, so two screens disagreed.",
     "Run the extension test against the original background.js: 4 of 12 checks fail (qa/extension_tabswitch_test.mjs).",
     "See Section 2."),
    ("D-19", "Medium", "Sub Admin 'View Activity' page unreadable in dark mode",
     "screenshots before / after (Section 2)",
     "The page was written with light-mode colours only. In dark mode its cards stayed white while the text inherited the light page colour, so headings, day / week names, website and category names and table text were white on white.",
     "Switch to dark mode (moon icon) &gt; Sub Admin &gt; Users &gt; View Activity.",
     "Add dark variants to every card, label, bar track and table row of that page."),
    ("D-20", "Medium", "Chrome extension could only talk to the deployed (Render) backend",
     "code review, EXT-01..12",
     "<font name='Courier'>chrome_extension/config.js</font> and the manifest permissions pointed only at <font name='Courier'>focusguard-ai-backend.onrender.com</font>. On a local set-up the extension logged in against, and sent every activity / tab switch to, the production server, so nothing appeared in the local app.",
     "Install the extension locally, browse, open the local Analytics page: no new data.",
     "Add a USE_LOCAL_BACKEND switch (now true) and the local addresses to the manifest."),
    ("D-21", "Medium", "Extension login says \"tracking could not start\" when no website tab is open",
     "POPUP-01..07",
     "After a successful login the popup asks the background worker to start tracking the current tab. If that tab is not a website (Chrome's New Tab page, chrome:// pages, a window with no tab) the worker answered \"failed\", "
     "and the popup showed the red message \"Login succeeded, but tracking could not start. Check the extension's service worker console.\" - although nothing was wrong. Real failures (server not running, rejected token) produced the same unhelpful text.",
     "Open a New Tab page, click the extension icon and sign in.",
     "Treat a non-website tab as success and say that tracking starts with the first website; show the real reason for real failures."),
    ("D-03", "High", "Public, unauthenticated <font name='Courier'>GET /send-test-email</font> endpoint",
     "code review (not executed)",
     "main.py exposes an open endpoint that sends an e-mail to a hard-coded personal address every time it is called. Anyone who can reach the server can trigger it repeatedly (spam / quota exhaustion / mailbox flooding). I did not call it, to avoid sending mail.",
     "Open <font name='Courier'>http://127.0.0.1:8000/docs</font> and look for \"/send-test-email\" (no lock icon).",
     "Delete the endpoint before release."),
    ("D-04", "Medium", "Password hashes are returned by <font name='Courier'>GET /admin/all-users</font>",
     "MGT-02",
     "The endpoint returns the raw User rows, including <font name='Courier'>hashed_password</font> for every account. Only the Super Admin can call it, but hashes should never leave the server.",
     "Super Admin token &gt; GET /admin/all-users &gt; each object contains hashed_password.",
     "Return a response model (id, name, e-mail, role, organisation, status) instead of the ORM object."),
    ("D-05", "Medium", "No server-side password policy",
     "AUTH-19, SUB-19, INV-05",
     "Public registration, Sub-Admin-created employees and invitation acceptance all accept a 1-character password. The 8-character rule exists only in the browser forms and in change-password.",
     "POST /auth/register-user with password \"a\" returns 200.",
     "Validate length/complexity in the Pydantic schemas used by all three endpoints."),
    ("D-06", "Medium", "No brute-force protection and user enumeration on login",
     "AUTH-29, AUTH-30",
     "15 wrong passwords in a row are all answered 401 - there is no throttling or lock-out. In addition the API says \"Invalid Email\" for an unknown address and \"Invalid Password\" for a wrong password, which tells an attacker which e-mails are registered.",
     "Call POST /auth/login repeatedly with a wrong password; compare the two error messages.",
     "Return one generic message, add rate limiting (e.g. per IP + e-mail) and temporary lock-out."),
    ("D-07", "Medium", "Deleting a user fails with HTTP 500 for almost every user",
     "MGT-07, MGT-09",
     "<font name='Courier'>DELETE /admin/delete-user/{id}</font> hits a foreign-key violation as soon as the user has notifications or activity rows. Every employee created by a Sub Admin gets a welcome notification, so none of them can be deleted. There is also no delete button in the UI.",
     "Create an employee as Sub Admin, then delete it as Super Admin: 500 Internal Server Error.",
     "Cascade (or explicitly delete) dependent rows, or switch to soft-delete; return a clean error."),
    ("D-08", "Medium", "Role change accepts any value and can lock the Super Admin out",
     "MGT-05",
     "<font name='Courier'>PUT /admin/change-role</font> stores whatever string is sent (\"HACKER\" was accepted - that user then cannot open any dashboard). It also allows a Super Admin to demote themselves and to create a Sub Admin with no organisation. There is no UI for it.",
     "PUT /admin/change-role/{id} with {\"role\":\"HACKER\"} returns 200.",
     "Use an enum (SUPER_ADMIN / SUB_ADMIN / USER), block self-demotion, require an organisation for SUB_ADMIN."),
    ("D-09", "Medium", "Any logged-in user can list every organisation",
     "RBAC-15",
     "<font name='Courier'>GET /organizations/</font> has no role check, so an ordinary employee receives the names and ids of all tenants.",
     "Log in as demo.employee@example.com and call GET /organizations/ - 200 with all organisations.",
     "Restrict to Super Admin, or return only the caller's own organisation."),
    ("D-10", "Medium", "\"Forgot Password?\" leads nowhere",
     "UI-05",
     "The login form links to <font name='Courier'>#/forgot-password</font>, but no such route exists and ForgotPasswordPage.tsx is an empty file; the backend has no reset endpoint either. A user who forgets a password cannot recover the account, and there is no admin-initiated reset.",
     "Login page &gt; Forgot Password? - blank page.",
     "Implement a reset flow (token e-mail) or remove the link and add an admin reset action."),
    ("D-11", "Medium", "Expired session is not handled by the front end",
     "UI-66",
     "axios has only a request interceptor; there is no 401 handler and <font name='Courier'>/auth/refresh-token</font> is never called. When the 60-minute access token expires the user is not sent back to login - pages just stop loading data.",
     "Log in, replace access_token in localStorage with garbage, click any sidebar item: stays on the page.",
     "Add a response interceptor: on 401 try refresh-token once, otherwise clear storage and redirect to /login."),
    ("D-12", "Medium", "A deactivated employee can never be re-activated",
     "SUB-29",
     "There is a deactivate endpoint/button but no counterpart for users (only organisations can be re-activated). A mistaken click is permanent without direct database access.",
     "Sub Admin &gt; Users &gt; Deactivate - no Activate button appears afterwards.",
     "Add a re-activate endpoint and button."),
    ("D-13", "Low", "Logout is client-side only",
     "AUTH-28",
     "<font name='Courier'>POST /auth/logout</font> just returns a message; the JWT stays valid until it expires. Acceptable for stateless JWT, but it makes D-01 worse and should be known.",
     "Copy token, log out, call GET /users/me with the copied token: 200.",
     "Short access-token life + server-side revocation list for refresh tokens."),
    ("D-14", "Low", "Deactivation requests can be processed more than once",
     "ORG-23",
     "approve/reject do not check that the request is still PENDING; an approved request can be approved (or rejected) again, re-sending notifications and changing history.",
     "PUT /organizations/deactivation-request/{id}/approve twice - both 200.",
     "Return 400 unless status == PENDING."),
    ("D-15", "Low", "Super Admin 'Sign Out' button on the Settings page logs out incorrectly",
     "SET-13",
     "That button uses <font name='Courier'>window.location.href = '/login'</font> and removes only localStorage keys. With the hash router the user lands on the landing page instead of the login page, the 'user' key is left behind, and inside the Chrome extension (which stores tokens in chrome.storage) the token would not be cleared at all. Sub Admin / User pages use the shared logout() correctly.",
     "Super Admin &gt; Settings &gt; Logout.",
     "Call useAuth().logout() and navigate('/login') like the sidebar does."),
    ("D-16", "Info", "The first Super Admin cannot be created from the UI",
     "AUTH-17",
     "The bootstrap endpoint <font name='Courier'>POST /auth/register</font> only works while the user table is empty, but the Register page always calls <font name='Courier'>/auth/register-user</font> (role USER). On a fresh install the first Super Admin has to be created by API call or database insert. The demo Super Admin here was inserted directly for the same reason.",
     "-", "Document the bootstrap step or add a one-time setup screen."),
    ("D-17", "Info", "Secrets and plain-text passwords sit in the project folder",
     "code review",
     "<font name='Courier'>.env</font> contains live-looking API keys and the database URL, and <font name='Courier'>TEST_ACCOUNTS.md</font> lists passwords in clear text (it says \"delete before sharing\"). Do not zip/commit/share the folder as-is. No secret values are reproduced in this report.",
     "-", "Rotate keys if the folder has been shared; add .env to .gitignore (already listed) and delete TEST_ACCOUNTS.md."),
]

DEFECTS.sort(key=lambda d: int(d[0][2:]))

STATUS = {"D-02": "PARTLY FIXED", "D-18": "FIXED", "D-19": "FIXED", "D-20": "FIXED", "D-21": "FIXED"}
CHANGES = {
    "D-21": "The extension now answers the popup with a structured result. A New Tab / chrome:// page (or no tab) counts as success (\"Login successful. FocusGuard will start tracking as soon as you open a website.\"); "
            "real failures show the reason (server not reachable at the configured address, server's HTTP error, not signed in).",
    "D-02": "E-mail errors are now explained (not configured / login rejected / unreachable). The invite call returns the link when the e-mail fails, and the form shows it with a Copy button. "
            "In-app notifications: Invitation Sent, Invitation Not Delivered, Invitation Accepted (Super Admin) and a welcome notice + e-mail for the new Sub Admin. Link base comes from FRONTEND_URL. "
            "<b>Still needed from you:</b> run <font name='Courier'>./venv/bin/python setup_email.py</font> once with a Gmail App Password - see Section 2.",
    "D-18": "Extension keeps its state in chrome.storage, handles events one at a time, compares websites (not titles), counts tab changes and website changes, handles window focus and closed tabs. "
            "API trims, validates and de-duplicates (same switch within 1 s counts once). Summary now counts real tab switches.",
    "D-19": "About 90 dark-mode style variants added to focusguard-ui/src/pages/subadmin/Users/UserActivityPage.tsx; light mode unchanged.",
    "D-20": "config.js has USE_LOCAL_BACKEND = true (set it to false before publishing the extension); manifest allows 127.0.0.1:8000 and localhost:8000 as well as Render.",
}

# ----------------------------------------------------------------------------
# story
# ----------------------------------------------------------------------------
st = []
st.append(NextPageTemplate("body"))
st.append(Spacer(1, 62 * mm))
st.append(Paragraph("FocusGuard AI", S["cover_t"]))
st.append(Spacer(1, 3 * mm))
st.append(Paragraph("End-to-end QA test guide and report", ParagraphStyle("ct2", parent=S["cover_t"], fontSize=21, leading=26)))
st.append(Spacer(1, 8 * mm))
st.append(Paragraph("Sign up, sign in, sign out and log out &bull; Super Admin &bull; Sub Admin &bull; Employee / User &bull; Invitations &bull; Organisation lifecycle", S["cover_s"]))
st.append(Spacer(1, 22 * mm))
cov = Table([[Paragraph("<b>Prepared</b>", ParagraphStyle("a", fontName="Body-B", fontSize=9, textColor=colors.HexColor("#C7D2FE"))),
              Paragraph(date.today().strftime("%d %B %Y"), ParagraphStyle("a2", fontName="Body", fontSize=10.5, textColor=colors.white))],
             [Paragraph("<b>Build tested</b>", ParagraphStyle("a", fontName="Body-B", fontSize=9, textColor=colors.HexColor("#C7D2FE"))),
              Paragraph("FocusGuard-AI-main - FastAPI backend (port 8000), React/Vite front end (port 5173), PostgreSQL <i>focusguard_ai</i>", ParagraphStyle("a3", fontName="Body", fontSize=10.5, leading=14, textColor=colors.white))],
             [Paragraph("<b>Contents</b>", ParagraphStyle("a", fontName="Body-B", fontSize=9, textColor=colors.HexColor("#C7D2FE"))),
              Paragraph("Demo accounts &bull; role/permission matrix &bull; manual test script &bull; automated results &bull; defect register &bull; screenshots", ParagraphStyle("a4", fontName="Body", fontSize=10.5, leading=14, textColor=colors.white))]],
            colWidths=[28 * mm, 130 * mm])
cov.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 5), ("LINEABOVE", (0, 0), (-1, 0), 0.6, colors.HexColor("#818CF8"))]))
st.append(cov)
st.append(PageBreak())

# ---- contents
st.append(Paragraph("Contents", S["h1x"]))
toc = TableOfContents()
toc.levelStyles = [S["toc1"]]
toc.dotsMinLevel = 0
st.append(toc)
st.append(Spacer(1, 8))
st += callout("<b>How to use this document.</b> Section 4 gives you ready-made accounts. Section 6 is the step-by-step script to run by hand in the browser "
              "(tick the Pass / Fail box as you go). Section 7 shows what I already ran automatically against the same accounts, and Section 8 lists the "
              "defects found, with the exact test that proves each one. \"Sign in / log in\" and \"sign out / log out\" are the same actions in this app; "
              "\"sign up\" is the public Register page.", "info")
st.append(PageBreak())

# ---- 1 summary
st.append(P("1. Executive summary", "h1"))
boxes = Table([[stat_box("automated checks run", tot, INDIGO_L, INDIGO), stat_box("passed", npass, GREEN_L, GREEN),
                stat_box("failed (defects)", nfail, RED_L, RED), stat_box("blocked by configuration", nblock, AMBER_L, AMBER)]],
              colWidths=[(W - 18) / 4 + 6] * 4)
boxes.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 6)]))
st.append(boxes)
st.append(Spacer(1, 8))
st.append(P("<b>Verdict.</b> The role model and organisation isolation work as designed: every cross-role and cross-organisation request that should be refused <i>is</i> refused, "
            "all four kinds of user can sign in and reach the right area, and the full organisation life-cycle (create, invite, deactivate request, approve / reject, re-activate) works in both the API and the UI. "
            "What is not release-ready is the account-security layer around it: deactivation does not cut off existing sessions, the invitation e-mail cannot be delivered with the current configuration, "
            "and several basic safeguards (password policy, throttling, password reset, session-expiry handling) are missing. "
            "The problems you reported afterwards - tab switching, the invitation e-mail, the unreadable dark-mode activity page and the extension's \"tracking could not start\" message - have been fixed and re-tested (Section 2)."))
st.append(P("What was verified and works", "h3"))
st += bullets([
    "<b>Authentication:</b> login for all four kinds of account; wrong password / unknown e-mail / malformed input rejected; expired, forged and wrong-type tokens rejected; refresh-token works; change-password rules enforced. Public registration can only create a plain USER (an injected role or organisation is ignored).",
    "<b>Role separation (API):</b> Sub Admin and Employee are refused on every Super-Admin-only endpoint; Employees are refused on every Sub-Admin endpoint; the Super Admin is refused on Sub-Admin-only actions (create employee, request deactivation).",
    "<b>Sub Admin scope:</b> a Sub Admin sees, analyses and deactivates only employees of their own organisation; the second organisation (Beta) is invisible and untouchable from Alpha, in list views, analytics, live status and deactivation.",
    "<b>Invitations:</b> valid link creates a Sub Admin in the right organisation; re-used, expired, tampered, wrong-role, wrong-type, missing-organisation, deleted-organisation and inactive-organisation links are all refused with clear messages; the form also blocks short / mismatching passwords.",
    "<b>Organisation life-cycle:</b> one pending request at a time; reject keeps the organisation running; approve locks out every member at login; invitations into an inactive organisation are blocked; re-activation restores access.",
    "<b>UI guards:</b> every role is redirected to its own area, cannot open another role's URLs, is bounced away from /login while signed in, and is sent to /login after logout or with a corrupted token; admin-only menu items are hidden for Employees; the app renders at phone width.",
])
st.append(P("What still needs attention (full list, with the items fixed since, in Section 8)", "h3"))
top = [["ID", "Severity", "Status", "Finding"]] + [[d[0], d[1], STATUS.get(d[0], "Open").title(), d[2]] for d in DEFECTS if d[1] in ("High", "Medium") and STATUS.get(d[0]) != "FIXED"]
t = table(top, [14 * mm, 18 * mm, 22 * mm, W - 54 * mm])
st.append(t)
st.append(Spacer(1, 6))
st.append(PageBreak())

# ---- 2 overview
# ---- 2 fixes
st.append(P("2. Fixes made after the first test pass", "h1"))
st.append(P("You reported these problems while running the project. Each one was traced to its cause in the code, fixed, and then tested again with the same demo accounts. "
            "Before / after evidence is listed for each."))


def fixrow(n, symptom, cause, change, files, proof):
    return [f"<b>{n}</b>", symptom, cause, change, files, proof]


fix_rows = [["#", "What you saw", "Root cause", "What I changed", "Files", "Verified by"],
    fixrow("1", "Tab switching for a normal user does not work properly",
           "<b>(a)</b> The extension remembered the previous website only in memory; Chrome stops that background worker after ~30 s idle, so the first switch after every wake-up was lost. "
           "<b>(b)</b> Tab-activated, page-loaded and window events ran in parallel, giving doubled or missing records. "
           "<b>(c)</b> It compared page <i>titles</i>, so \"(3) Inbox\" vs \"Inbox\" or normal navigation inside one site counted as a switch. "
           "<b>(d)</b> Switching Chrome windows was ignored. "
           "<b>(e)</b> The extension only knew the deployed Render server, so on a local run nothing reached your backend. "
           "<b>(f)</b> The Summary screen counted activity rows minus one instead of tab switches, so two screens disagreed. "
           "<b>(g)</b> The API accepted empty names and double reports.",
           "State is kept in chrome.storage; events are handled one at a time; websites (hostnames) are compared; a switch = different tab or different site; window focus and closed tabs handled; "
           "local backend switch + permissions; API trims, validates (max 255) and counts the same switch once within 1 s; Summary counts real tab switches.",
           "chrome_extension/background.js, storage.js, config.js, manifest.json; app/routers/activity.py, analytics.py; app/schemas.py",
           "12 extension checks (original code: 4 fail, new code: all pass) and 16 API checks TAB-01..16"),
    fixrow("2", "Invitation e-mail never arrives; no e-mail or notification about it",
           "The mail account in <font name='Courier'>.env</font> is still the placeholder text, and the code hid the real error and answered a bare 500. "
           "The link was hard-coded to localhost, the Super Admin got no feedback, and nothing was notified when someone accepted.",
           "Clear reasons (not configured / login refused / server unreachable, 15 s time-out). The invite call now succeeds and, if the mail fails, returns the link: the form shows an amber notice "
           "with the link and a <b>Copy link</b> button. In-app notifications: Invitation Sent, Invitation Not Delivered, Invitation Accepted (Super Admin) and a welcome notice + e-mail for the new Sub Admin. "
           "Link and sender settings come from <font name='Courier'>FRONTEND_URL</font>, <font name='Courier'>SMTP_HOST / PORT / SECURITY</font>.",
           "app/email_service.py, config.py, routers/admin.py; focusguard-ui InviteSubAdminCard.tsx, admin.api.ts; .env, .env.example",
           "22 e-mail-flow checks incl. a Gmail-style server (STARTTLS + App Password login) and the setup script; INV-01, INV-01b, INV-01c; UI flows FLOW-08, 14, 15"),
    fixrow("3", "Weekly / Monthly Activity, Website Usage, Category Usage, Activity History and Tab Switching text invisible in the Sub Admin's user-activity page",
           "That page was written with light-mode colours only. In dark mode the cards stayed white but the text inherited the light page colour, so it was white on white.",
           "Dark-mode variants for every card, label, bar track, badge and table row on the page (light mode unchanged). Every section was re-checked in dark and light mode.",
           "focusguard-ui/src/pages/subadmin/Users/UserActivityPage.tsx",
           "Before / after screenshots below"),
    fixrow("4", "Extension popup after login: \"Login succeeded, but tracking could not start\"",
           "The popup treated \"the current tab is not a website\" (New Tab page, chrome:// page) as a failure, and all real failures used the same unhelpful text.",
           "Structured answer: not-a-website = success with \"tracking starts when you open a website\"; real failures name the reason (server unreachable at address X, HTTP error, not signed in).",
           "chrome_extension/background.js, api.js, popup.js",
           "7 popup checks (previous code: 6 fail, new code: all pass)"),
]
st.append(table(fix_rows, [6 * mm, 25 * mm, 50 * mm, 46 * mm, 25 * mm, W - 152 * mm], font="tiny", pad=3))
st.append(Spacer(1, 6))
st.append(P("Dark mode: before and after (Sub Admin &gt; Users &gt; View Activity)", "h3"))
from PIL import Image as PI
for key, cap in [("crop_dark_before", "BEFORE - the titles \"Weekly Activity\" / \"Monthly Activity\" and every day / week label are white on a white card"),
                 ("crop_dark_after", "AFTER - the same cards, everything readable")]:
    f = SHOTS / f"{key}.png"
    w, h = PI.open(f).size
    width = W * 0.64
    st.append(KeepTogether([Image(str(f), width=width, height=width * h / w), Paragraph(cap, S["small"]), Spacer(1, 7)]))
st.append(P("What you still have to do for real e-mail", "h2"))
st.append(P("I cannot (and should not) create an e-mail login for you, so delivery to a real inbox needs one step from you. Everything else in the invitation flow is proven working with a test mail server."))
st += bullets([
    "In the Google account that will send the mail, turn on <b>2-Step Verification</b> (myaccount.google.com/security), then create an <b>App Password</b> (myaccount.google.com/apppasswords). Google shows 16 characters; spaces do not matter.",
    "In the project folder run <font name='Courier'>./venv/bin/python setup_email.py</font>. It asks for the Gmail address and the App Password (typed hidden), saves them in <font name='Courier'>.env</font> and immediately sends a test e-mail to that address. "
    "It prints <b>SUCCESS</b>, or <b>FAILED</b> with the exact reason. No restart of the backend is needed.",
    "Super Admin &gt; Organization &gt; Invite Sub Admin &gt; Send Invitation. Success shows \"Invitation Email Sent Successfully.\", the invitee receives the mail with the link, and the bell shows \"Invitation Sent\". "
    "If something is wrong you see the reason and the link to send by hand.",
    "When the app is not served from <font name='Courier'>http://localhost:5173</font>, set <font name='Courier'>FRONTEND_URL</font> in <font name='Courier'>.env</font> (needs a backend restart) so the link in the mail points to the right address.",
    "Why a script and not a typed-in field: the App Password is a secret. The script runs on your own machine, so it never passes through chat, logs or this report. Use a dedicated Gmail account for sending (Gmail allows roughly 500 messages per day).",
])
st.append(P("Things I noticed and deliberately left alone", "h2"))
st += bullets([
    "The extension is now set to your local backend (<font name='Courier'>USE_LOCAL_BACKEND = true</font> in <font name='Courier'>chrome_extension/config.js</font>). Set it to <b>false</b> before publishing it. After changing the extension, open <font name='Courier'>chrome://extensions</font> and press Reload on FocusGuard AI, then sign in again in its popup.",
    "<font name='Courier'>GET /send-test-email</font> (defect D-03) is still in <font name='Courier'>app/main.py</font>. Now that mail can work, anyone could use it to send mail to the hard-coded address; remove it.",
    "On the organisation Analytics chart the left axis labels are slightly cut off (\"117m\" shows as \"I17m\"). Cosmetic, not changed.",
    "All other open defects (Section 8) are unchanged.",
])
st.append(PageBreak())

st.append(P("3. How the product is built", "h1"))
st.append(P("FocusGuard AI is a productivity and attention-tracking platform. A Chrome extension reports which sites a person uses; a FastAPI backend stores it in PostgreSQL, "
            "computes analytics and focus scores, and asks an LLM (Groq, Gemini fallback) for recommendations. A React single-page app presents everything, with a separate area per role."))
st.append(table([
    ["Layer", "Technology / location", "Notes"],
    ["Back end", "FastAPI, SQLAlchemy, JWT (python-jose), bcrypt - <font name='Courier'>app/</font>", "Runs on http://127.0.0.1:8000, interactive API docs at <font name='Courier'>/docs</font>"],
    ["Front end", "React + TypeScript + Vite, hash router - <font name='Courier'>focusguard-ui/</font>", "Runs on http://localhost:5173; all URLs look like <font name='Courier'>/#/login</font>"],
    ["Database", "PostgreSQL <font name='Courier'>focusguard_ai</font> (+ pgvector for RAG)", "Tables: users, organizations, deactivation_requests, activity_logs, focus_plans, notifications ..."],
    ["Extension", "Chrome extension - <font name='Courier'>chrome_extension/</font>", "Sends browsing activity and tab switches; its tracking logic is covered by automated tests (Section 2)"],
    ["Start-up", "<font name='Courier'>./focusguard.sh</font>", "Starts PostgreSQL, backend and front end together"],
], [24 * mm, 80 * mm, W - 104 * mm]))
st.append(P("The three roles", "h2"))
st.append(table([
    ["Role", "Who they are", "How the account comes into existence", "Lands on"],
    ["<b>Super Admin</b>", "Platform owner. Sees every organisation and user.", "Only the very first account can self-register through the API; afterwards a Super Admin can only be created in the database.", "/superadmin/dashboard"],
    ["<b>Sub Admin</b>", "Manager of exactly one organisation.", "<b>Invitation only</b>: the Super Admin invites by e-mail (link valid 24 h) and the person sets their own password. The Super Admin can later assign a Sub Admin who has no organisation.", "/subadmin/dashboard"],
    ["<b>Employee</b> (role USER, inside an organisation)", "Member of an organisation. Sees only their own data.", "Created by the Sub Admin of that organisation (Users &gt; Create User).", "/user/dashboard"],
    ["<b>User</b> (role USER, no organisation)", "Individual who signed up on the public Register page.", "Public sign-up.", "/user/dashboard"],
], [28 * mm, 36 * mm, W - 100 * mm, 36 * mm]))
st.append(P("Business rules that the tests are built on", "h2"))
st += bullets([
    "Public registration is always a plain USER with no organisation. Nobody can choose a role while signing up.",
    "A Sub Admin can create, list, view the activity of and deactivate <b>employees of their own organisation only</b>. They cannot touch other Sub Admins, the Super Admin or other organisations.",
    "A Sub Admin cannot deactivate their own organisation - they send a <b>deactivation request</b> with a reason; only the Super Admin can approve or reject it. One pending request per organisation.",
    "When an organisation is deactivated, <b>nobody belonging to it can log in</b> (including its Sub Admin) until the Super Admin re-activates it. Invitations to an inactive organisation are refused.",
    "Deactivating a user blocks that user's login. Super Admins and Sub Admins cannot be deactivated through the Sub Admin screen.",
    "The Super Admin sees organisation-wide analytics for all organisations and the organisation-level AI insights; a Sub Admin sees the same views restricted to their own organisation.",
])
st.append(PageBreak())

# ---- 3 accounts
st.append(P("4. Demo accounts and demo data (created from scratch)", "h1"))
st.append(P("These accounts were created fresh in your local database by the script <font name='Courier'>qa/seed_demo.py</font>. "
            "Everything except the Super Admin and the invitation step went through the real application API - so the creation itself was already a test of registration, "
            "organisation creation, invitation acceptance and employee creation. <b>All demo accounts use the same password: <font name='Courier'>Demo@12345</font></b>."))
st.append(table([
    ["Role", "Name", "E-mail (login)", "Organisation", "ID", "Use it to test"],
    ["<b>Super Admin</b>", "Demo Super Admin", "demo.superadmin@example.com", "- (sees all)", "7", "Create organisations, invite Sub Admins, approve requests, view all users/analytics"],
    ["<b>Sub Admin</b> (main)", "Demo Sub Admin Alpha", "demo.subadmin@example.com", "Demo Corp Alpha", "8", "Create / deactivate employees, org analytics, deactivation request, access limits"],
    ["Sub Admin (other org)", "Demo Sub Admin Beta", "demo.subadmin.beta@example.com", "Demo Corp Beta", "9", "Proves that Alpha and Beta cannot see each other"],
    ["<b>Employee</b> (main)", "Demo Employee Alpha One", "demo.employee@example.com", "Demo Corp Alpha", "10", "Employee features; has 7 days of browsing history"],
    ["Employee", "Demo Employee Alpha Two", "demo.employee2@example.com", "Demo Corp Alpha", "11", "Second employee for list / deactivation tests"],
    ["Employee (other org)", "Demo Employee Beta One", "demo.employee.beta@example.com", "Demo Corp Beta", "12", "Cross-organisation access tests"],
    ["<b>User</b> (stand-alone)", "Demo Standalone User", "demo.user@example.com", "none", "13", "Public sign-up user; not visible to any Sub Admin"],
], [24 * mm, 29 * mm, 52 * mm, 23 * mm, 7 * mm, W - 135 * mm]))
st.append(Spacer(1, 6))
st.append(P("Layout of the demo data", "h3"))
lay = Table([[Paragraph("<b>Super Admin</b><br/>demo.superadmin", S["cellb"]), "", ""],
             [Paragraph("<b>Demo Corp Alpha</b> (organisation 2)<br/>Sub Admin: demo.subadmin<br/>Employees: demo.employee, demo.employee2", S["cell"]),
              Paragraph("<b>Demo Corp Beta</b> (organisation 3)<br/>Sub Admin: demo.subadmin.beta<br/>Employee: demo.employee.beta", S["cell"]),
              Paragraph("<b>No organisation</b><br/>Stand-alone user: demo.user", S["cell"])]],
            colWidths=[W / 3] * 3)
lay.setStyle(TableStyle([("SPAN", (0, 0), (2, 0)), ("BACKGROUND", (0, 0), (-1, 0), INDIGO_L), ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                         ("INNERGRID", (0, 1), (-1, 1), 0.5, LINE), ("LINEBELOW", (0, 0), (-1, 0), 0.5, LINE), ("ALIGN", (0, 0), (-1, 0), "CENTER"),
                         ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7), ("LEFTPADDING", (0, 0), (-1, -1), 8)]))
st.append(lay)
st.append(Spacer(1, 7))
st += bullets([
    "The three employees and the stand-alone user each have <b>7 days of sample data</b> - browsing history (GitHub, Stack Overflow, Python docs, Gmail = productive; YouTube, Instagram = non-productive), active / idle periods and tab switches - so dashboards, charts, reports and organisation analytics show real numbers instead of zeros.",
    "Older accounts from <font name='Courier'>TEST_ACCOUNTS.md</font> (superadmin@example.com, subadmin@example.com, employee@example.com, demo@example.com in \"Acme Test Org\") were <b>left untouched</b>. Use the new <font name='Courier'>demo.*</font> accounts for this assignment.",
    "E-mail addresses must look real: the API's validator rejects reserved endings such as <font name='Courier'>.test</font> and <font name='Courier'>.local</font>. <font name='Courier'>example.com</font> is accepted.",
])
st.append(P("Starting the app and resetting the data", "h2"))
st += code("cd /Users/abhinav/Downloads/FocusGuard-AI-main\n./focusguard.sh                         # PostgreSQL + backend :8000 + front end :5173")
st.append(P("Re-create the demo accounts (safe to run again - existing ones are skipped):"))
st += code("./venv/bin/python qa/seed_demo.py")
st.append(P("Clear leftovers and tidy notifications after you have been testing (removes throw-away <font name='Courier'>qa-tmp*</font> data, empties the admins' notification bell):"))
st += code("psql focusguard_ai -f qa/cleanup.sql")
st.append(P("Get a Sub Admin invitation link <b>without e-mail</b> (needed because SMTP is not configured). Arguments: full name, e-mail, organisation id (2 = Alpha, 3 = Beta):"))
st += code('./venv/bin/python qa/make_invite_link.py "Priya Sharma" priya.sharma@example.com 2\n'
           '# prints  http://localhost:5173/#/accept-invitation?token=eyJhbGciOi...\n'
           '# (valid 24 hours, single use)')
st.append(P("Calling the API directly (for the permission tests in Section 6)", "h3"))
st.append(P("Open <font name='Courier'>http://127.0.0.1:8000/docs</font>. Run <b>POST /auth/login</b> with a demo account, copy <font name='Courier'>access_token</font>, click the green "
            "<b>Authorize</b> button and paste it. Every call you now make is made as that user, which lets you try forbidden requests (for example, a Sub Admin calling "
            "<font name='Courier'>GET /admin/all-users</font>) and see the 403."))
st.append(PageBreak())

# ---- 4 matrix
st.append(P("5. Permission matrix (verified)", "h1"))
st.append(P("\"Yes\" = allowed, \"No\" = refused with HTTP 403 (or hidden in the UI). Each row was checked by an automated test on the API and, where there is a screen, in the browser."))
Y, N = "<font color='#15803D'><b>Yes</b></font>", "<font color='#B91C1C'><b>No</b></font>"
own = "<font color='#B45309'><b>Own org</b></font>"
rows = [["Capability", "Super Admin", "Sub Admin", "Employee", "User", "Evidence"],
        ["Sign up on public Register page (creates a plain USER)", "-", "-", "-", Y, "AUTH-16..19"],
        ["Log in / log out; refresh token", Y, Y, Y, Y, "AUTH-01..15, UI-*"],
        ["Change own password", Y, Y, Y, Y, "AUTH-20..26, SET-*"],
        ["Own dashboard, planner, analytics, reports, AI, notifications", Y, Y, Y, Y, "RBAC-12..14, USR-*"],
        ["Create an organisation", Y, N, N, N, "ORG-01, RBAC-16/17, FLOW-07"],
        ["Invite a Sub Admin", Y, N, N, N, "INV-*, RBAC-18/19"],
        ["Assign a Sub Admin to an organisation", Y, N, N, N, "ORG-04..09, RBAC-23"],
        ["List all users / statistics / change role / delete user", Y, N, N, N, "RBAC-01..03, 20..22, MGT-*"],
        ["Create employees", N, own, N, N, "SUB-15..19, RBAC-24/25"],
        ["List organisation users", N, own, N, N, "RBAC-05, SUB-01/02"],
        ["View an employee's analytics / live status", Y + " (anyone)", own, N, N, "SUB-03..13, RBAC-31/32"],
        ["Organisation-wide analytics &amp; reports", Y + " (all)", own, N, N, "RBAC-06..10, SUB-14"],
        ["Deactivate an employee", N, own, N, N, "SUB-20..27, RBAC-*"],
        ["Request organisation deactivation", N, Y, N, N, "ORG-10/11, RBAC-26/27, FLOW-04"],
        ["Approve / reject deactivation requests", Y, N, N, N, "ORG-14/17, RBAC-28/29, FLOW-05"],
        ["Re-activate an organisation", Y, N, N, N, "ORG-25..28, RBAC-30, FLOW-06"],
        ["Organisation AI insights", Y, N, N, N, "RBAC-11"],
        ["See the Organization / Users menu items", Y, Y, N, N, "UI-11/25/39/50"],
        ]
st.append(table(rows, [66 * mm, 20 * mm, 19 * mm, 17 * mm, 14 * mm, W - 136 * mm]))
st.append(Spacer(1, 6))
st += callout("<b>Two places where reality differs from this ideal table:</b> any logged-in Employee can still read the full organisation list through the API (D-09), "
              "and a Super Admin-created Sub Admin without an organisation can be produced through the change-role call (D-08).", "warn")
st.append(PageBreak())

# ---- 5 manual script
st.append(P("6. Manual test script", "h1"))
st.append(P("Run these in a normal browser window at <font name='Courier'>http://localhost:5173</font> after <font name='Courier'>./focusguard.sh</font>. "
            "Use a private window for the second user when a test needs two people at once. Tick <b>P</b> (pass) or <b>F</b> (fail) and write the "
            "defect id in the margin. Rows marked <font color='#B45309'><b>KNOWN</b></font> are expected to fail today because of the defect shown."))
BOX = "[&nbsp;&nbsp;]&nbsp;P &nbsp;&nbsp; [&nbsp;&nbsp;]&nbsp;F"


def mt(title, rows, intro=None):
    out = [CondPageBreak(60 * mm), P(title, "h2")]
    if intro:
        out.append(P(intro))
    data = [["ID", "Steps", "Expected result", "Result"]] + [[r[0], r[1], r[2], BOX] for r in rows]
    out.append(table(data, [15 * mm, 78 * mm, W - 93 * mm - 20 * mm, 20 * mm], pad=3.6))
    return out


st += mt("6.1  Sign up, sign in, sign out, log out", [
    ("A-01", "Open the site root. Click <b>Login</b> / <b>Get started</b> in the top bar.", "Landing page loads; you reach the login form at <font name='Courier'>#/login</font>."),
    ("A-02", "Go to <b>Register</b>. Fill name, a <i>new</i> e-mail (e.g. <font name='Courier'>my.new.user@example.com</font>), age, occupation, password (8+ chars). Submit.", "Success message; you can now log in. In the DB / Super Admin user list the account has role USER and no organisation."),
    ("A-03", "Register again with the same e-mail.", "\"Email already registered.\" error; no second account."),
    ("A-04", "Log in with the account from A-02.", "Redirect to <font name='Courier'>#/user/dashboard</font>. Sidebar has NO Organization / Users entries. Settings shows Organization: Not assigned."),
    ("A-05", "Log in as <font name='Courier'>demo.superadmin@example.com</font> / Demo@12345.", "Redirect to <font name='Courier'>#/superadmin/dashboard</font>; name and role \"Super Admin\" shown top-right."),
    ("A-06", "Log in as <font name='Courier'>demo.subadmin@example.com</font>.", "Redirect to <font name='Courier'>#/subadmin/dashboard</font>; sidebar has Organization and Users."),
    ("A-07", "Log in as <font name='Courier'>demo.employee@example.com</font>.", "Redirect to <font name='Courier'>#/user/dashboard</font>; no Organization / Users entries."),
    ("A-08", "Log in with a correct e-mail and wrong password.", "Error toast, you stay on the login page."),
    ("A-09", "Log in with an unknown e-mail; then with an empty form; then with \"abc\" as e-mail.", "Each is refused with a message; no crash, no redirect."),
    ("A-10", "Click the eye icon in the password field.", "Password is shown / hidden."),
    ("A-11", "Press F5 while signed in.", "You stay signed in on the same page (no flash to login)."),
    ("A-12", "While signed in, type <font name='Courier'>/#/login</font> in the address bar.", "You are sent straight back to your dashboard."),
    ("A-13", "Sidebar &gt; <b>Logout</b> (bottom-left).", "You land on the login page. Browser Back button does not show any protected page; data is gone."),
    ("A-14", "Sign in again, open <b>Settings</b>, use the <b>Sign Out</b> card's Logout button. Repeat for Sub Admin, Employee and Super Admin.", "Back on the login page each time. <font color='#B45309'><b>KNOWN D-15:</b></font> for the Super Admin the page shown is the landing page, not login."),
    ("A-15", "After logout paste a protected URL such as <font name='Courier'>/#/subadmin/users</font>.", "Redirected to login."),
    ("A-16", "Click <b>Forgot Password?</b> on the login page.", "A reset page should appear. <font color='#B45309'><b>KNOWN D-10:</b></font> blank page."),
    ("A-17", "Settings &gt; Change Password: current wrong / new &lt; 8 chars / confirm differs / valid. Then log out and log in with the new password.", "Each bad case shows a message and changes nothing; the valid change works; the old password no longer logs in. (Change it back afterwards.)"),
    ("A-18", "Switch the language selector and the dark-mode moon icon in the top bar.", "Labels re-translate; theme changes; choice survives a refresh."),
], "Covers the four things asked for: sign up (Register), sign in (Login), sign out (Settings &gt; Sign Out) and log out (sidebar Logout).")

st += mt("6.2  Super Admin  (demo.superadmin@example.com)", [
    ("SA-01", "Open <b>Dashboard</b>.", "Stat cards, weekly / monthly charts and the notification bell render without errors."),
    ("SA-02", "<b>Organization</b> page: read the three counters (Total / Active / Inactive).", "Total = 3 or more (Acme Test Org, Demo Corp Alpha, Demo Corp Beta, ...); inactive = 0 on a fresh set-up."),
    ("SA-03", "<b>Create Organization</b>: name \"Demo Corp Gamma\" &gt; Create.", "Appears in the list as Active; counters update; bell shows \"Organization Created\"."),
    ("SA-04", "Create an organisation with the same name again.", "\"Organization already exists.\" error."),
    ("SA-05", "<b>Organization &gt; Users</b> tab (or the <b>Users</b> menu).", "All users of all organisations plus their organisation, role and Active/Inactive badge. Includes the demo accounts."),
    ("SA-06", "<b>Organization &gt; Requests</b> tab.", "Lists deactivation requests with status; Approve / Reject buttons only for PENDING ones."),
    ("SA-07", "Open <b>Analytics</b>, <b>Reports</b> (try Weekly / Monthly and the JSON / CSV / PDF exports) and <b>AI Insights</b>.", "Org-wide numbers (Alpha + Beta + ...) appear; exports download; AI page can pick an organisation and returns a recommendation (needs LLM key)."),
    ("SA-08", "Planner and Settings pages.", "Both open; Settings shows profile, Change Password and Sign Out cards."),
    ("SA-09", "Type <font name='Courier'>/#/subadmin/dashboard</font> and <font name='Courier'>/#/user/dashboard</font>.", "Each is redirected back to the Super Admin dashboard."),
], None)

st += mt("6.3  Invitations  (Super Admin invites a Sub Admin)", [
    ("INV-01", "Organization &gt; <b>Invite Sub Admin</b>: name, new e-mail, choose \"Demo Corp Alpha\" &gt; Send Invitation.", "<b>Mail configured:</b> green \"Invitation Email Sent Successfully.\", e-mail arrives, bell shows \"Invitation Sent\". <b>Mail not configured (today):</b> amber notice \"Invitation created, but the e-mail could not be sent...\" with the reason, the invitation link and a <b>Copy link</b> button; bell shows \"Invitation Not Delivered\"."),
    ("INV-02", "Invite an e-mail that already has an account (e.g. demo.employee@example.com).", "\"A user with this email already exists.\""),
    ("INV-03", "Open the organisation drop-down.", "Only <b>active</b> organisations are listed."),
    ("INV-04", "Generate a link: <font name='Courier'>./venv/bin/python qa/make_invite_link.py \"Priya Sharma\" priya.sharma@example.com 2</font>, open it in a <b>private window</b>.", "\"Accept Invitation\" page with two password fields."),
    ("INV-05", "Submit with a 5-character password; then with mismatching confirmation.", "\"Password must be at least 8 characters long.\" / \"Passwords do not match.\" - nothing is created."),
    ("INV-06", "Submit a valid matching password.", "Green success text \"... You have joined Demo Corp Alpha.\""),
    ("INV-07", "Log in as the new Sub Admin.", "Lands on <font name='Courier'>#/subadmin/dashboard</font>; Organization page shows Demo Corp Alpha; Users page lists Alpha employees."),
    ("INV-08", "Open the same link again.", "Red error \"User already exists.\" - link is single-use."),
    ("INV-09", "Edit a few characters in the middle of the token in the address bar and submit.", "\"Invalid or Expired Invitation.\""),
    ("INV-10", "Open <font name='Courier'>/#/accept-invitation</font> with no token.", "Red \"Invalid Invitation\" card."),
    ("INV-11", "Expiry: use an invitation older than 24 hours (or change the clock on a test server).", "\"Invalid or Expired Invitation.\" (Automated test INV-10 proves this.)"),
    ("INV-12", "Deactivate the organisation (see 6.5), then open a still-unused link for it.", "\"This organization is no longer active.\""),
    ("INV-13", "Check the Sub Admin's bell and the Super Admin's list.", "New Sub Admin appears in Users with the right organisation."),
    ("INV-14", "<b>With real e-mail:</b> run <font name='Courier'>./venv/bin/python setup_email.py</font> with a Gmail App Password (it sends you a test mail), then repeat INV-01 - no restart needed.", "Mail arrives (check spam) naming the organisation, with a link built from FRONTEND_URL; the link opens the Accept Invitation page."),
    ("INV-15", "Click <b>Copy link</b> in the amber notice (INV-01), paste it into a private window.", "Accept Invitation page opens; completing it creates the Sub Admin (INV-05..07)."),
    ("INV-16", "After INV-06 look at the Super Admin's bell and the new Sub Admin's bell / mailbox.", "Super Admin: \"Invitation Accepted\". New Sub Admin: \"Welcome to FocusGuard\" notification (and a welcome e-mail when mail is configured)."),
])

st += mt("6.4  Sub Admin  (demo.subadmin@example.com - Demo Corp Alpha)", [
    ("SUB-01", "Open <b>Dashboard</b>, <b>Analytics</b>, <b>Reports</b>, <b>AI Insights</b>.", "Organisation-level figures for Alpha only (compare with Beta Sub Admin: numbers are different)."),
    ("SUB-02", "<b>Users</b> page.", "Exactly: Demo Employee Alpha One and Alpha Two. Not Beta's employee, not the other Sub Admin, not demo.user."),
    ("SUB-03", "Search box on Users page: type \"two\".", "List filters to Alpha Two."),
    ("SUB-04", "<b>Create User</b>: name, new e-mail, password, age, occupation &gt; Create.", "New row with status Active. Log in as that person in a private window: lands on user dashboard, bell shows \"Welcome to FocusGuard\"."),
    ("SUB-05", "Create a user with an e-mail that exists.", "\"Email already registered.\""),
    ("SUB-06", "<b>View Activity</b> on Alpha One.", "Page with websites, categories, tab switches, live status and summary for that employee."),
    ("SUB-07", "Change the URL to another organisation's employee, e.g. <font name='Courier'>/#/subadmin/users/12/activity</font> (Beta's employee).", "No data is shown (API answers 403 \"You can only view users from your organization\")."),
    ("SUB-08", "<b>Deactivate</b> the employee you created in SUB-04 and confirm the dialog.", "Badge turns Inactive. That person's login now says \"Your account has been deactivated.\" <font color='#B45309'><b>KNOWN D-01/D-12:</b></font> already-open sessions keep working; no re-activate button."),
    ("SUB-09", "Look for a Deactivate button on the Sub Admin / Super Admin.", "None - only employees are listed."),
    ("SUB-10", "<b>Organization</b> page.", "Shows Demo Corp Alpha, Active, and a <b>Request Deactivation</b> button plus a request history."),
    ("SUB-11", "Request Deactivation with a reason &gt; Send Request. Try again.", "First: success, history shows PENDING. Second: refused (\"A pending request already exists.\")."),
    ("SUB-12", "Type <font name='Courier'>/#/superadmin/organization</font>.", "Redirected to the Sub Admin dashboard."),
    ("SUB-13", "In <font name='Courier'>/docs</font> authorize as this Sub Admin; call GET /admin/all-users, POST /organizations/, PUT /organizations/1/activate, POST /admin/invite-sub-admin.", "All four answer <b>403</b>."),
    ("SUB-14", "Same Sub Admin: GET /analytics/users/12/activity-summary (Beta employee) and PUT /organizations/users/12/deactivate.", "Both 403."),
    ("SUB-15", "Planner / personal Dashboard.", "Works as a normal user for the Sub Admin's own data."),
    ("SUB-16", "Switch to <b>dark mode</b> (moon icon, top bar). Users &gt; <b>View Activity</b> on an employee; scroll through Weekly / Monthly Activity, Website Usage, Category Usage, Activity History and Tab Switching.", "Every title, label, number and table cell is readable on its card in dark and in light mode (fixed D-19)."),
])

st += mt("6.5  Organisation life-cycle - one end-to-end scenario", [
    ("LIFE-01", "Super Admin creates \"Demo Corp Gamma\" (id shown in <font name='Courier'>/docs</font> GET /organizations/).", "Organisation Active."),
    ("LIFE-02", "Generate invitation for gamma.admin@example.com with that id, accept it in a private window.", "Sub Admin exists in Gamma."),
    ("LIFE-03", "Gamma Sub Admin creates employee gamma.emp@example.com.", "Employee can log in."),
    ("LIFE-04", "Gamma Sub Admin sends a deactivation request. Super Admin sees it (Requests tab, bell) and presses <b>Reject</b>.", "Sub Admin gets a \"Deactivation Request Rejected\" notification; both Gamma users still log in."),
    ("LIFE-05", "Send a new request; Super Admin presses <b>Approve</b>.", "Gamma shows Inactive. Gamma Sub Admin and employee are refused: \"Your organization has been deactivated. Please contact the Super Admin.\""),
    ("LIFE-06", "Super Admin: Organizations list &gt; Gamma &gt; <b>Activate Organization</b>.", "Gamma Active; Sub Admin gets \"Organization Activated\"; both users can log in again."),
    ("LIFE-07", "Super Admin tries to invite into an inactive Gamma (repeat 05, then invite).", "Organisation missing from the invite drop-down; API answers \"Cannot invite a Sub Admin to an inactive organization.\""),
])

st += mt("6.6  Employee and stand-alone user  (demo.employee@example.com, demo.user@example.com)", [
    ("EMP-01", "<b>Dashboard</b>.", "Welcome card, quick stats (active time, idle time, browser time, focus score), live status, today's planner preview, weekly / monthly charts filled with the 7 days of demo data."),
    ("EMP-02", "<b>Planner</b>: create today's plan (e.g. Development 90 min, Learning 30 min, total 120). Try a second plan for the same date. Edit the plan.", "Plan saved with progress bars; duplicate refused (\"Focus plan already exists for this date.\"); edit works. With no plan the page shows an empty state, not an error."),
    ("EMP-03", "<b>Analytics</b>: websites, categories, tab switches.", "Charts populated: GitHub / Stack Overflow top; YouTube / Instagram in non-productive."),
    ("EMP-04", "<b>Reports</b>: weekly and monthly, then Export JSON / CSV / PDF.", "Reports render; three file types download with the same numbers."),
    ("EMP-05", "<b>AI Insights</b>: read the recommendation, ask the chatbot a question, send an empty message.", "Recommendation appears (needs LLM key); chatbot answers; empty message is refused."),
    ("EMP-06", "Notification bell: open, click one, \"Mark all as read\".", "Unread count drops; welcome notification present for a Sub-Admin-created employee."),
    ("EMP-07", "<b>Settings</b>.", "Profile shows name, e-mail, role User, <b>Organization</b> (employee) or \"Not assigned\" (stand-alone), Active status."),
    ("EMP-08", "Type <font name='Courier'>/#/subadmin/users</font> and <font name='Courier'>/#/superadmin/dashboard</font>.", "Redirected to the user dashboard. No Organization / Users in the sidebar."),
    ("EMP-09", "In <font name='Courier'>/docs</font> as Employee: GET /organizations/users, GET /analytics/role/report?type=weekly, POST /organizations/users, GET /analytics/users/13/activity-summary.", "All <b>403</b>. (GET /organizations/ returns 200 - D-09.)"),
    ("EMP-10", "Compare data of Alpha One and the stand-alone user.", "Each sees only their own numbers."),
    ("EMP-11", "Resize the window to phone width (or use the device toolbar).", "Layout collapses to a menu; login and dashboard remain usable."),
    ("EMP-12", "<b>Chrome extension:</b> <font name='Courier'>chrome://extensions</font> &gt; Developer mode &gt; Load unpacked &gt; the <font name='Courier'>chrome_extension</font> folder (or press Reload if already loaded). Click the extension icon and sign in with the employee. Open GitHub, then Stack Overflow, YouTube, Gmail ... switching between tabs about ten times with pauses of a minute in between.", "Employee &gt; Analytics &gt; Tab Switch Analytics lists each hop as <i>site -&gt; site</i> (host names such as github.com), the counter matches the number of real switches, and the Sub Admin's <i>View Activity &gt; Tab Switching</i> shows the same. Moving between pages of one site in one tab adds nothing."),
])

st += mt("6.7  Cross-organisation isolation (the Sub Admin's \"particular access\")", [
    ("ISO-01", "Log in as Alpha Sub Admin. Note Users list. Log in as Beta Sub Admin in a private window.", "Alpha sees Alpha One + Two; Beta sees only Beta One. No overlap."),
    ("ISO-02", "Alpha Sub Admin &gt; Analytics. Beta Sub Admin &gt; Analytics.", "Totals differ and are exactly the sum of that organisation's employees; Super Admin's totals equal Alpha + Beta (+ other organisations)."),
    ("ISO-03", "Alpha Sub Admin opens activity page of employee ids 10 and 11 (own) and 12 (Beta).", "10 and 11 show data; 12 shows nothing / 403."),
    ("ISO-04", "Alpha Sub Admin creates an employee. Check Beta's Users list.", "New employee appears only in Alpha."),
    ("ISO-05", "Alpha Sub Admin deactivates Alpha Two. Beta and the stand-alone user are unaffected.", "Only Alpha Two is Inactive."),
    ("ISO-06", "Deactivate Alpha's organisation (LIFE-style). Log in as Beta people.", "Beta logins keep working - one organisation's status never affects another."),
])
st += mt("6.8  Tab switching (employee + Chrome extension)", [
    ("TAB-M1", "Sign in to the extension as <font name='Courier'>demo.employee@example.com</font>. Keep one tab on github.com, open a second on stackoverflow.com, click between them 5 times.", "5 or more new rows appear in Analytics &gt; Tab Switch Analytics, newest first, each \"github.com -&gt; stackoverflow.com\" or the reverse."),
    ("TAB-M2", "Leave Chrome alone for two minutes (the extension's background worker goes to sleep), then switch tabs once.", "That switch is recorded as well (this was lost before the fix)."),
    ("TAB-M3", "Stay on one tab and click through several pages of the same website.", "No tab switch is added."),
    ("TAB-M4", "Open <font name='Courier'>chrome://extensions</font> or a New Tab page, then return to the previous site.", "No tab switch is added; the time on the internal page is not credited to the site."),
    ("TAB-M5", "Open a second Chrome window on another site and click between the windows.", "Each change of window to a different site adds one switch."),
    ("TAB-M6", "Compare the numbers: Employee dashboard (today), Analytics &gt; Tab Switch Analytics, Summary / reports and the Sub Admin's View Activity.", "All screens show consistent counts (the all-time Summary equals the list total)."),
    ("TAB-M7", "Use the date filter on Tab Switch Analytics (today / yesterday / Clear).", "List and counter follow the date; Clear shows everything."),
])
st.append(PageBreak())


# ---- 6 automated results
st.append(P("7. Automated test results", "h1"))
st.append(P(f"I ran four automated suites against your running application with the demo accounts. Destructive actions (deactivating, deleting, changing passwords, "
            f"approving organisation deactivation) were done only on throw-away <font name='Courier'>qa-tmp*</font> data that was removed afterwards; the demo accounts themselves were not changed."))
sumrows = [["Suite", "What it does", "Checks", "Pass", "Fail", "Blocked"]]
desc = {"API (backend) tests": "Calls the REST API directly as each role (script <font name='Courier'>qa/api_tests.py</font>)",
        "Browser UI tests": "Real Chrome: login form, redirects, every sidebar page per role, logout (<font name='Courier'>qa/ui_tests.py</font>)",
        "Interactive UI flows": "Real Chrome: create user, deactivate, deactivation request, approve, re-activate, invitation page (<font name='Courier'>qa/ui_flows.py</font>)",
        "Settings-page tests": "Real Chrome: Change Password form and Sign Out card per role (<font name='Courier'>qa/ui_settings.py</font>)",
        "E-mail flow tests": "Second backend + fake mail server: e-mail content, link, notifications, failure paths (<font name='Courier'>qa/email_flow_test.py</font>)",
        "Extension login-popup tests": "The answer the extension gives the login popup: New Tab page, chrome:// page, normal site, server down, bad token (<font name='Courier'>qa/extension_popup_test.mjs</font>)",
        "Extension tab-tracking tests": "Runs the Chrome extension's real background.js with a simulated browser against the backend (<font name='Courier'>qa/extension_tabswitch_test.mjs</font>)"}
for k, v in suites.items():
    sumrows.append([f"<b>{k}</b>", desc[k], str(len(v)), str(sum(r['status'] == 'PASS' for r in v)), str(sum(r['status'] == 'FAIL' for r in v)), str(sum(r['status'] == 'BLOCKED' for r in v))])
sumrows.append(["<b>Total</b>", "", f"<b>{tot}</b>", f"<b>{npass}</b>", f"<b>{nfail}</b>", f"<b>{nblock}</b>"])
st.append(table(sumrows, [32 * mm, W - 32 * mm - 62 * mm, 14 * mm, 13 * mm, 13 * mm, 22 * mm]))
st.append(Spacer(1, 8))
st.append(P("API results by area", "h2"))
areas = OrderedDict()
for r in api["results"]:
    areas.setdefault(r["area"], []).append(r)
arows = [["Area", "Checks", "Pass", "Fail", "Blocked", "Covers"]]
cov_txt = {"Tab switching": "saving, duplicates, validation, summary vs list, isolation, Sub Admin scope",
           "Authentication": "login, tokens, refresh, registration, password change, logout, brute force",
           "Role-based access": "every endpoint x every role, forbidden writes",
           "Sub Admin scope": "own-organisation visibility, employee create / deactivate, cross-org refusal",
           "Invitations": "valid / reused / expired / tampered / wrong-role / missing-org / inactive-org links",
           "Organisation lifecycle": "create, assign, request, reject, approve, lock-out, re-activate",
           "Super Admin user management": "all-users, statistics, change role, delete",
           "Employee / user features": "dashboard data, activity tracking, planner, notifications, AI"}
for a, v in areas.items():
    arows.append([f"<b>{a}</b>", str(len(v)), str(sum(r['status'] == 'PASS' for r in v)), str(sum(r['status'] == 'FAIL' for r in v)),
                  str(sum(r['status'] == 'BLOCKED' for r in v)), cov_txt.get(a, "")])
st.append(table(arows, [38 * mm, 15 * mm, 12 * mm, 12 * mm, 16 * mm, W - 93 * mm]))
st.append(Spacer(1, 8))
st.append(P("Every check that did not pass", "h2"))
frows = [["ID", "Check", "Expected", "Actual", "Result", "Defect"]]
dmap = {}
for d in DEFECTS:
    for tid in d[3].replace("code review (not executed)", "").replace("code review", "").replace(" ", "").split(","):
        if tid:
            dmap.setdefault(tid.replace("..", "-"), d[0])
manual_map = {"AUTH-19": "D-05", "AUTH-28": "D-13", "AUTH-29": "D-06", "AUTH-30": "D-06", "RBAC-15": "D-09", "SUB-19": "D-05", "SUB-28": "D-01", "SUB-28b": "D-01",
              "SUB-29": "D-12", "INV-01": "D-02", "INV-05": "D-05", "ORG-20": "D-01", "ORG-23": "D-14", "MGT-02": "D-04", "MGT-05": "D-08", "MGT-07": "D-07", "MGT-09": "D-07",
              "UI-05": "D-10", "UI-66": "D-11", "SET-13": "D-15"}
for suite in suites.values():
    for r in suite:
        if r["status"] != "PASS":
            frows.append([r["id"], esc(r["title"]), esc(r["expected"]), esc(r["actual"]), r["status"], manual_map.get(r["id"], "-")])
st.append(table(frows, [16 * mm, 60 * mm, 27 * mm, 29 * mm, 18 * mm, W - 150 * mm], status_col=4, font="tiny"))
st.append(PageBreak())

# ---- 7 defects
st.append(P("8. Defect register", "h1"))
sev_bg = {"High": RED_L, "Medium": AMBER_L, "Low": BLUE_L, "Info": ZEBRA}
sev_fg = {"High": RED, "Medium": AMBER, "Low": colors.HexColor("#1D4ED8"), "Info": MUTED}
cnt = {k: sum(1 for d in DEFECTS if d[1] == k) for k in sev_bg}
st.append(P(f"{len(DEFECTS)} findings: <b>{cnt['High']} High</b>, <b>{cnt['Medium']} Medium</b>, <b>{cnt['Low']} Low</b>, <b>{cnt['Info']} Info</b>; "
            f"{sum(1 for d in DEFECTS if STATUS.get(d[0]) == 'FIXED')} fixed and {sum(1 for d in DEFECTS if STATUS.get(d[0]) == 'PARTLY FIXED')} partly fixed in this round, the rest still open. "
            "High = security hole or core feature unusable; Medium = missing safeguard or broken secondary feature; Low = edge-case or cosmetic; Info = needs a decision or documentation."))
for d in DEFECTS:
    head = Table([[Paragraph(f"<b>{d[0]}</b>", ParagraphStyle("h", fontName="Body-B", fontSize=9.5, textColor=sev_fg[d[1]])),
                   Paragraph(f"<b>{d[2]}</b>", ParagraphStyle("h2", fontName="Body-B", fontSize=9.5, leading=12, textColor=INK)),
                   Paragraph(f"<b>{d[1].upper()}</b><br/><font size='7' color='{'#15803D' if d[0] in STATUS else '#64748B'}'>{STATUS.get(d[0], 'OPEN')}</font>",
                             ParagraphStyle("h3", fontName="Body-B", fontSize=8, leading=10, alignment=TA_CENTER, textColor=sev_fg[d[1]]))]],
                 colWidths=[14 * mm, W - 14 * mm - 20 * mm, 20 * mm])
    head.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), sev_bg[d[1]]), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                              ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5), ("LEFTPADDING", (0, 0), (-1, -1), 6)]))
    body = table([
        ["<b>Evidence</b>", d[3].replace("code review (not executed)", "code review (endpoint not called)")],
        ["<b>What happens</b>", d[4]],
        ["<b>How to see it</b>", d[5]],
        ["<b>Suggested fix</b>", d[6]],
    ] + ([["<b>What I changed</b>", CHANGES[d[0]]]] if d[0] in CHANGES else []), [24 * mm, W - 24 * mm], head=False, zebra=False)
    st.append(KeepTogether([head, body, Spacer(1, 9)]))
st.append(PageBreak())

# ---- 8 coverage
st.append(P("9. What this pass did not cover", "h1"))
st.append(table([
    ["Area", "Status", "How to cover it"],
    ["Invitation e-mail delivery to a real inbox", "Not possible without your credentials", "Everything up to Google's servers is proven with a Gmail-style test server (22 checks: STARTTLS, App Password login, wrong password, setup script). Add a Gmail App Password (Section 2) and run INV-14 in Section 6.3."],
    ["Chrome extension inside real Chrome", "Logic tested, browser not driven", "The extension's real code was run against the backend with a simulated browser (12 checks). Do EMP-12 / TAB-M1..M7 once in real Chrome."],
    ["Quality / wording of AI recommendations and chatbot", "Endpoints respond; content not judged", "Needs a human to read the answers; response time depends on the Groq / Gemini key."],
    ["Translations (many languages)", "Spot-checked English only", "Switch the language selector on each page and look for untranslated labels."],
    ["Performance / load, concurrency", "Not run", "Not part of the assignment; consider a short load test on login and analytics."],
    ["Other browsers, tablets, accessibility", "Chrome desktop + 390 px width only", "Repeat A-section in Firefox / Safari."],
    ["Daily RAG scheduler and pgvector back-fill", "Not run", "Back-end background job; check logs after midnight or call the scripts in <font name='Courier'>app/scripts/</font>."],
], [52 * mm, 40 * mm, W - 92 * mm]))
st.append(P("Assumptions and notes", "h2"))
st += bullets([
    "Tests ran on Sunday 25 Oct 2026 against the backend and front end that were already running on your machine; the database is your local <i>focusguard_ai</i>.",
    "Sub Admin invitation links in the automated tests were signed locally with the project's own secret (via <font name='Courier'>qa/make_invite_link.py</font>), which exercises the same accept-invitation code the e-mailed link would.",
    "\"Sign out\" and \"log out\" exist as two buttons (Settings page card vs sidebar). Both were tested for every role.",
    "The existing accounts from <font name='Courier'>TEST_ACCOUNTS.md</font> and the older \"Acme Test Org\" were not modified.",
    "Folder <font name='Courier'>qa/</font> holds everything needed to repeat the run: seed_demo.py, api_tests.py, ui_tests.py, ui_flows.py, ui_settings.py, make_invite_link.py, cleanup.sql, build_report.py and the raw JSON results.",
])
st.append(P("Re-running the automation", "h2"))
st += code("./venv/bin/python qa/seed_demo.py                 # accounts + sample data (idempotent)\n"
           f"./venv/bin/python qa/api_tests.py                # {len(api['results'])} API checks      -> qa/results.json\n"
           f"/opt/anaconda3/bin/python3 qa/ui_tests.py        # {len(ui['results'])} browser checks   -> qa/ui_results.json\n"
           f"/opt/anaconda3/bin/python3 qa/ui_flows.py        # {len(flow['results'])} interactive flows\n"
           f"/opt/anaconda3/bin/python3 qa/ui_settings.py     # {len(sett['results'])} settings checks\n"
           f"./venv/bin/python qa/email_flow_test.py         # {len(mail['results'])} e-mail flow checks (starts its own backend + fake mail server)\n"
           f"node qa/extension_tabswitch_test.mjs <access_token> <refresh_token>   # {len(ext['results'])} extension checks\n"
           f"node qa/extension_popup_test.mjs <access_token> <refresh_token>       # {len(popup['results'])} login-popup checks\n"
           "psql focusguard_ai -f qa/cleanup.sql             # remove leftovers, empty admin bells\n"
           "./venv/bin/python qa/seed_demo.py --reset-data   # rebuild sample browsing history\n"
           "/opt/anaconda3/bin/python3 qa/build_report.py    # rebuild this PDF")
st.append(PageBreak())

# ---- 9 screenshots
st.append(P("10. Screenshots from the test run", "h1"))
st.append(P("Captured by the browser tests with the demo accounts (1366 x 820 window, light theme)."))
shots = [("dark_after_1", "Dark mode: Website / Category Usage (fixed)"), ("dark_after_5", "Dark mode: Tab Switching list (fixed)"),
         ("login_error", "Login page after a wrong password"), ("register", "Public Register page (creates a User)"),
         ("SA_dashboard", "Super Admin dashboard"), ("SA_org_organizations", "Super Admin: Organizations + Invite Sub Admin"),
         ("FLOW_invite_result", "Invite form: mail not configured - reason + copyable link"), ("invite_invalid", "Invitation page without a token"),
         ("FLOW_invite_accepted", "Invitation accepted - Sub Admin created"), ("FLOW_invite_reuse", "Re-used invitation link refused"),
         ("SUB_dashboard", "Sub Admin dashboard"), ("SUB_users_detail", "Sub Admin: Users (Alpha only)"),
         ("FLOW_user_deactivated", "Employee deactivated by Sub Admin"), ("FLOW_request_modal", "Sub Admin: deactivation request modal"),
         ("SUB_organization_detail", "Sub Admin: My Organization"), ("FLOW_request_approved", "Super Admin approves request"),
         ("EMP_dashboard", "Employee dashboard"), ("EMP_planner", "Employee planner"),
         ("EMP_analytics", "Employee analytics"), ("USR_settings", "Stand-alone user: Settings"),
         ("SET_subadmin_changed", "Change Password - success"), ("EMP_dashboard_mobile", "Phone width (390 px)")]
imgw = (W - 6 * mm) / 2
cells = []
for key, cap in shots:
    f = SHOTS / f"{key}.png"
    if not f.exists():
        continue
    from PIL import Image as PI
    w, h = PI.open(f).size
    im = Image(str(f), width=imgw, height=imgw * h / w)
    cells.append([im, Paragraph(cap, S["small"])])
rows_i = []
for i in range(0, len(cells), 2):
    pair = cells[i:i + 2]
    top_ = [p[0] for p in pair] + [""] * (2 - len(pair))
    bot_ = [p[1] for p in pair] + [""] * (2 - len(pair))
    rows_i.append(top_)
    rows_i.append(bot_)
gt = Table(rows_i, colWidths=[imgw + 3 * mm, imgw + 3 * mm])
gs = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
      ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]
for r in range(1, len(rows_i), 2):
    gs.append(("BOTTOMPADDING", (0, r), (-1, r), 9))
gt.setStyle(TableStyle(gs))
st.append(gt)
st.append(PageBreak())

# ---- appendix
st.append(P("Appendix A. Full automated results - API", "h1"))
rows = [["ID", "Check", "Expected", "Actual", "Result"]]
for r in api["results"]:
    rows.append([r["id"], esc(r["title"]), esc(r["expected"]), esc(str(r["actual"])[:90]), r["status"]])
st.append(table(rows, [16 * mm, W - 16 * mm - 52 * mm - 38 * mm - 14 * mm, 38 * mm, 52 * mm, 14 * mm], status_col=4, font="tiny", pad=2.2))
st.append(PageBreak())
st.append(P("Appendix B. Full automated results - browser", "h1"))
rows = [["ID", "Check", "Expected", "Actual", "Result"]]
for suite in (ui["results"], flow["results"], sett["results"]):
    for r in suite:
        rows.append([r["id"], esc(r["title"]), esc(r["expected"]), esc(str(r["actual"])[:90]), r["status"]])
st.append(table(rows, [16 * mm, W - 16 * mm - 44 * mm - 46 * mm - 14 * mm, 44 * mm, 46 * mm, 14 * mm], status_col=4, font="tiny", pad=2.2))

doc.multiBuild(st)
print("written", OUT)
