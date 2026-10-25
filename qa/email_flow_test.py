"""Invitation e-mail flow against a throw-away backend (port 8001) and a fake SMTP server.

Run:  ./venv/bin/python qa/email_flow_test.py
Proves, without a real mail account, that the invitation e-mail is built and sent correctly,
that the link in it works, and that the right notifications/e-mails follow. Also checks the
failure path (mail server down) and the not-configured path (the real .env placeholders).
"""
import os
import re
from email import message_from_string
from email.policy import default as default_policy
import socketserver
import subprocess
import sys
import threading
import time
import uuid
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
PW = "Demo@12345"
RUN = uuid.uuid4().hex[:5]
results = []
mails = []


def rec(tid, title, expected, actual, ok):
    results.append((tid, title, expected, actual, ok))
    print("PASS" if ok else "FAIL", tid, title, "|", expected, "->", actual)


class SMTP(socketserver.StreamRequestHandler):
    def handle(self):
        w = lambda t: self.wfile.write((t + "\r\n").encode())
        w("220 fake ready")
        msg = {"to": [], "data": ""}
        while True:
            line = self.rfile.readline().decode(errors="replace").rstrip("\r\n")
            if not line:
                return
            cmd = line.split(" ")[0].upper()
            if cmd in ("EHLO", "HELO"):
                w("250 fake")
            elif cmd == "MAIL":
                w("250 ok")
            elif cmd == "RCPT":
                msg["to"].append(line.split(":", 1)[1].strip("<> "))
                w("250 ok")
            elif cmd == "DATA":
                w("354 go")
                while True:
                    l = self.rfile.readline().decode(errors="replace")
                    if l.rstrip("\r\n") == ".":
                        break
                    msg["data"] += l
                mails.append(dict(msg))
                msg = {"to": [], "data": ""}
                w("250 queued")
            elif cmd == "QUIT":
                w("221 bye")
                return
            else:
                w("250 ok")


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


smtp = Server(("127.0.0.1", 2525), SMTP)
threading.Thread(target=smtp.serve_forever, daemon=True).start()


# ---------------------------------------------------------------------------------------------
# Gmail-like server: STARTTLS (self-signed cert for "localhost") + AUTH PLAIN
# ---------------------------------------------------------------------------------------------
import base64
import ssl
import tempfile

TLS_DIR = Path(tempfile.mkdtemp(prefix="fg-mailtest-"))
(TLS_DIR / "openssl.cnf").write_text("""[req]
distinguished_name=dn
x509_extensions=v3
prompt=no
[dn]
CN=localhost
[v3]
subjectAltName=DNS:localhost,IP:127.0.0.1
basicConstraints=CA:TRUE
""")
subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "2", "-config", str(TLS_DIR / "openssl.cnf"),
                "-keyout", str(TLS_DIR / "key.pem"), "-out", str(TLS_DIR / "cert.pem")], check=True, capture_output=True)
SERVER_CTX = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
SERVER_CTX.load_cert_chain(str(TLS_DIR / "cert.pem"), str(TLS_DIR / "key.pem"))

SECURE = {"user": "qa.sender@gmail.com", "password": "abcdefghijklmnop", "logins": [], "mails": []}


class SecureSMTP(socketserver.StreamRequestHandler):
    def handle(self):
        tls = False
        authed = False
        msg = {"to": [], "data": "", "authed": False}

        def w(t):
            self.wfile.write((t + "\r\n").encode())
            self.wfile.flush()

        w("220 fake-gmail ready")
        while True:
            line = self.rfile.readline().decode(errors="replace").rstrip("\r\n")
            if not line:
                return
            cmd = line.split(" ")[0].upper()
            if cmd == "EHLO":
                self.wfile.write(b"250-fake-gmail\r\n")
                if not tls:
                    self.wfile.write(b"250 STARTTLS\r\n")
                else:
                    self.wfile.write(b"250 AUTH PLAIN LOGIN\r\n")
                self.wfile.flush()
            elif cmd == "STARTTLS":
                w("220 go ahead")
                self.request = SERVER_CTX.wrap_socket(self.request, server_side=True)
                self.rfile = self.request.makefile("rb")
                self.wfile = self.request.makefile("wb", 0)
                tls = True
            elif cmd == "AUTH":
                if not tls:
                    w("530 Must issue a STARTTLS command first")
                    continue
                parts = line.split(" ")
                if len(parts) < 3 or parts[1].upper() != "PLAIN":
                    w("535 5.7.8 Authentication method not accepted")
                    continue
                _, user, pw = base64.b64decode(parts[2]).decode().split("\0")
                SECURE["logins"].append((user, pw))
                if user == SECURE["user"] and pw == SECURE["password"]:
                    authed = True
                    w("235 2.7.0 Accepted")
                else:
                    w("535-5.7.8 Username and Password not accepted. For more information, go to")
                    w("535 5.7.8  https://support.google.com/mail/?p=BadCredentials")
            elif cmd == "MAIL":
                if not authed:
                    w("530 5.7.0 Authentication Required")
                    continue
                w("250 ok")
            elif cmd == "RCPT":
                msg["to"].append(line.split(":", 1)[1].strip("<> "))
                w("250 ok")
            elif cmd == "DATA":
                w("354 go")
                while True:
                    l = self.rfile.readline().decode(errors="replace")
                    if l.rstrip("\r\n") == ".":
                        break
                    msg["data"] += l
                SECURE["mails"].append(dict(msg))
                msg = {"to": [], "data": "", "authed": False}
                w("250 queued")
            elif cmd == "QUIT":
                w("221 bye")
                return
            else:
                w("250 ok")


secure_server = Server(("127.0.0.1", 2587), SecureSMTP)
threading.Thread(target=secure_server.serve_forever, daemon=True).start()


def start_backend(port, extra_env):
    env = {**os.environ, **extra_env}
    p = subprocess.Popen([str(ROOT / "venv/bin/uvicorn"), "app.main:app", "--port", str(port)], cwd=str(ROOT), env=env,
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            requests.get(f"http://127.0.0.1:{port}/", timeout=1)
            return p
        except Exception:
            time.sleep(0.5)
    p.kill()
    raise SystemExit("backend did not start")


def login(base, email):
    r = requests.post(f"{base}/auth/login", json={"email": email, "password": PW})
    r.raise_for_status()
    return {"Authorization": "Bearer " + r.json()["access_token"]}


def notes(base, h):
    return requests.get(f"{base}/notifications/", headers=h).json()


procs = []
try:
    # ---------------------------------------------------------------- configured server + fake mail server
    p1 = start_backend(8001, {"EMAIL_ADDRESS": "noreply@focusguard.example", "EMAIL_PASSWORD": "not-a-placeholder",
                              "SMTP_HOST": "127.0.0.1", "SMTP_PORT": "2525", "SMTP_SECURITY": "none",
                              "FRONTEND_URL": "http://app.example.test:5173/"})
    procs.append(p1)
    base = "http://127.0.0.1:8001"
    sup = login(base, "demo.superadmin@example.com")
    org = requests.post(f"{base}/organizations/", headers=sup, json={"organization_name": f"qa-tmp-mail-{RUN}"}).json()
    invitee = f"qa-tmp-mail-{RUN}@example.com"

    r = requests.post(f"{base}/admin/invite-sub-admin", headers=sup,
                      json={"full_name": "QA Mail Invitee", "email": invitee, "organization_id": org["id"]})
    rec("MAIL-01", "Invite with working mail server answers 200 and email_sent=true", "200, email_sent true, no link in response",
        f"{r.status_code} {r.json()}", r.status_code == 200 and r.json().get("email_sent") is True and "invitation_link" not in r.json())
    m = mails[0] if mails else None
    rec("MAIL-02", "The mail server received exactly one message addressed to the invitee", "1 mail to invitee",
        f"{len(mails)} mail(s), to={m['to'] if m else None}", len(mails) == 1 and m["to"] == [invitee])
    # decode like a mail client does (long lines are sent quoted-printable: "=3D" is "=")
    body = message_from_string(m["data"], policy=default_policy).get_content() if m else ""
    link = re.search(r"http://app\.example\.test:5173/#/accept-invitation\?token=[A-Za-z0-9_\-\.=]+", body)
    rec("MAIL-03", "E-mail contains a link built from FRONTEND_URL (not hard-coded localhost)", "http://app.example.test:5173/#/accept-invitation?token=...",
        link.group(0)[:70] + "..." if link else "no link", bool(link) and "localhost" not in body)
    rec("MAIL-04", "E-mail names the organisation and the 24-hour validity", f"mentions qa-tmp-mail-{RUN} and 24 hours",
        "yes" if (f"qa-tmp-mail-{RUN}" in body and "24 hours" in body) else "no", f"qa-tmp-mail-{RUN}" in body and "24 hours" in body)
    n = notes(base, sup)
    rec("MAIL-05", "Super Admin gets an in-app 'Invitation Sent' notification", "INVITATION_SENT present",
        [x["notification_type"] for x in n][:3], any(x["notification_type"] == "INVITATION_SENT" and invitee in x["message"] for x in n))

    token = link.group(0).split("token=")[1] if link else ""
    r = requests.post(f"{base}/admin/accept-invitation", params={"token": token}, json={"password": PW})
    rec("MAIL-06", "The link from the e-mail can be used to create the Sub Admin", "200, SUB_ADMIN", f"{r.status_code} {r.json().get('role') if r.ok else r.text[:60]}",
        r.status_code == 200 and r.json().get("role") == "SUB_ADMIN")
    time.sleep(1.5)
    welcome = [x for x in mails if x["to"] == [invitee] and "Subject: Welcome to FocusGuard AI" in x["data"]]
    rec("MAIL-07", "A welcome e-mail is sent to the new Sub Admin after accepting", "1 welcome mail", len(welcome), len(welcome) == 1)
    n = notes(base, sup)
    rec("MAIL-08", "Super Admin gets an 'Invitation Accepted' notification", "INVITATION_ACCEPTED present",
        [x["notification_type"] for x in n][:4], any(x["notification_type"] == "INVITATION_ACCEPTED" and invitee in x["message"] for x in n))
    nn = notes(base, login(base, invitee))
    rec("MAIL-09", "New Sub Admin has a welcome notification", "SUB_ADMIN_WELCOME present", [x["notification_type"] for x in nn],
        any(x["notification_type"] == "SUB_ADMIN_WELCOME" for x in nn))

    # ---------------------------------------------------------------- mail server down
    smtp.shutdown(); smtp.server_close()
    invitee2 = f"qa-tmp-mail2-{RUN}@example.com"
    t0 = time.time()
    r = requests.post(f"{base}/admin/invite-sub-admin", headers=sup,
                      json={"full_name": "QA Mail Down", "email": invitee2, "organization_id": org["id"]})
    d = r.json()
    rec("MAIL-10", "Mail server unreachable: invitation is still created, link is returned, reason is readable", "200, email_sent false, link, reason",
        f"{r.status_code} sent={d.get('email_sent')} link={'yes' if d.get('invitation_link') else 'no'} reason='{str(d.get('email_error'))[:60]}'",
        r.status_code == 200 and d.get("email_sent") is False and bool(d.get("invitation_link")) and bool(d.get("email_error")))
    rec("MAIL-11", "Fallback link points at FRONTEND_URL and can be accepted", "accept works",
        "",
        d.get("invitation_link", "").startswith("http://app.example.test:5173/#/accept-invitation?token=") and
        requests.post(f"{base}/admin/accept-invitation", params={"token": d["invitation_link"].split("token=")[1]}, json={"password": PW}).status_code == 200)
    n = notes(base, sup)
    rec("MAIL-12", "Failed delivery creates an 'Invitation Not Delivered' notification for the Super Admin", "INVITATION_FAILED present",
        [x["notification_type"] for x in n][:4], any(x["notification_type"] == "INVITATION_FAILED" and invitee2 in x["message"] for x in n))
    rec("MAIL-13", "Failure is fast (connection refused, not a 15 s hang)", "< 5 s", f"{time.time()-t0:.1f}s", time.time() - t0 < 5)
    procs[0].terminate()

    # ---------------------------------------------------------------- Gmail-style login (STARTTLS + app password)
    p3 = start_backend(8003, {"EMAIL_ADDRESS": "qa.sender@gmail.com", "EMAIL_PASSWORD": "abcd efgh ijkl mnop",
                              "SMTP_HOST": "localhost", "SMTP_PORT": "2587", "SMTP_SECURITY": "starttls",
                              "SSL_CERT_FILE": str(TLS_DIR / "cert.pem"), "FRONTEND_URL": "http://localhost:5173"})
    procs.append(p3)
    base3 = "http://127.0.0.1:8003"
    sup3 = login(base3, "demo.superadmin@example.com")
    org3 = requests.post(f"{base3}/organizations/", headers=sup3, json={"organization_name": f"qa-tmp-mail-tls-{RUN}"}).json()
    invitee3 = f"qa-tmp-mail-tls-{RUN}@example.com"
    r = requests.post(f"{base3}/admin/invite-sub-admin", headers=sup3,
                      json={"full_name": "QA Gmail Style", "email": invitee3, "organization_id": org3["id"]})
    rec("MAIL-16", "Gmail-style server (STARTTLS + login): invitation is delivered", "200, email_sent true",
        f"{r.status_code} {r.json()}", r.status_code == 200 and r.json().get("email_sent") is True)
    rec("MAIL-17", "App Password typed with spaces is sent without spaces (what Gmail expects)", "login qa.sender@gmail.com / abcdefghijklmnop",
        SECURE["logins"][:1], SECURE["logins"][:1] == [("qa.sender@gmail.com", "abcdefghijklmnop")])
    got = SECURE["mails"][0] if SECURE["mails"] else None
    gtext = message_from_string(got["data"], policy=default_policy) if got else None
    rec("MAIL-18", "Delivered message: From = the Gmail account, To = invitee, link inside", "From qa.sender@gmail.com, To invitee, link present",
        f"From={gtext['From'] if gtext else None}, To={got['to'] if got else None}",
        bool(got) and gtext["From"] == "qa.sender@gmail.com" and got["to"] == [invitee3] and "#/accept-invitation?token=" in gtext.get_content())
    SECURE["password"] = "something-else"          # Google now rejects the login
    r = requests.post(f"{base3}/admin/invite-sub-admin", headers=sup3,
                      json={"full_name": "QA Wrong Pw", "email": f"qa-tmp-mail-tls2-{RUN}@example.com", "organization_id": org3["id"]})
    d = r.json()
    rec("MAIL-19", "Wrong App Password: invite still works, reason says the login was rejected and what to do", "email_sent false, mentions App Password",
        f"{d.get('email_sent')} '{str(d.get('email_error'))[:80]}'", d.get("email_sent") is False and "App Password" in str(d.get("email_error")) and bool(d.get("invitation_link")))
    SECURE["password"] = "abcdefghijklmnop"
    SECURE["mails"].clear()
    SECURE["logins"].clear()
    procs[-1].terminate()

    # setup_email.py: writes .env, keeps other lines, sends the test mail
    tmp_env = TLS_DIR / ".env"
    tmp_env.write_text("SECRET_KEY=abc\nEMAIL_ADDRESS=your-email@example.com\nEMAIL_PASSWORD=your-email-password\nDATABASE_URL=postgresql://x\n")
    env = {**os.environ, "SMTP_HOST": "localhost", "SMTP_PORT": "2587", "SMTP_SECURITY": "starttls", "SSL_CERT_FILE": str(TLS_DIR / "cert.pem")}
    run = subprocess.run([str(ROOT / "venv/bin/python"), str(ROOT / "setup_email.py"), "--env-file", str(tmp_env), "--email", "qa.sender@gmail.com"],
                         input="abcd efgh ijkl mnop\n", capture_output=True, text=True, env=env, cwd=str(ROOT))
    saved = tmp_env.read_text()
    rec("MAIL-20", "setup_email.py saves the login in .env and keeps every other line", "address + password saved (no spaces), other lines intact",
        saved.replace("abcdefghijklmnop", "<password>"),
        "EMAIL_ADDRESS=qa.sender@gmail.com" in saved and "EMAIL_PASSWORD=abcdefghijklmnop" in saved and "SECRET_KEY=abc" in saved and "DATABASE_URL=postgresql://x" in saved)
    rec("MAIL-21", "setup_email.py sends a test e-mail and reports SUCCESS", "SUCCESS printed, 1 mail received",
        f"exit {run.returncode}, mails {len(SECURE['mails'])}", run.returncode == 0 and "SUCCESS" in run.stdout and len(SECURE["mails"]) == 1)
    SECURE["password"] = "different"
    run = subprocess.run([str(ROOT / "venv/bin/python"), str(ROOT / "setup_email.py"), "--env-file", str(tmp_env), "--email", "qa.sender@gmail.com"],
                         input="wrong wrong wrong w\n", capture_output=True, text=True, env=env, cwd=str(ROOT))
    rec("MAIL-22", "setup_email.py with a wrong App Password reports FAILED with the reason", "FAILED + 'App Password'",
        f"exit {run.returncode}", run.returncode == 2 and "FAILED" in run.stdout and "App Password" in run.stdout)

    # ---------------------------------------------------------------- real .env (placeholders)
    p2 = start_backend(8002, {})
    procs.append(p2)
    base2 = "http://127.0.0.1:8002"
    sup2 = login(base2, "demo.superadmin@example.com")
    r = requests.post(f"{base2}/admin/invite-sub-admin", headers=sup2,
                      json={"full_name": "QA No Mail", "email": f"qa-tmp-mail3-{RUN}@example.com", "organization_id": org["id"]})
    d = r.json()
    rec("MAIL-14", "With the placeholder .env the API says exactly what to configure and returns the link", "200, email_sent false, 'not configured'",
        f"{r.status_code} '{str(d.get('email_error'))[:70]}...'", r.status_code == 200 and d.get("email_sent") is False and "not configured" in str(d.get("email_error")) and bool(d.get("invitation_link")))
    rec("MAIL-15", "Link in that case uses the default FRONTEND_URL", "http://localhost:5173/#/accept-invitation?token=...",
        d.get("invitation_link", "")[:60], d.get("invitation_link", "").startswith("http://localhost:5173/#/accept-invitation?token="))
finally:
    try:
        secure_server.shutdown(); secure_server.server_close()
    except Exception:
        pass
    for p in procs:
        p.terminate()
    sql = f"""delete from notifications where user_id in (select id from users where email like 'qa-tmp-mail%');
delete from users where email like 'qa-tmp-mail%'; delete from organizations where organization_name like 'qa-tmp-mail%';"""
    subprocess.run(["psql", "focusguard_ai", "-q", "-c", sql])
    # notifications we created for the demo Super Admin
    subprocess.run(["psql", "focusguard_ai", "-q", "-c",
                    "delete from notifications where message like '%qa-tmp-mail%'"])

failed = [r for r in results if not r[4]]
print(f"\n{len(results)-len(failed)}/{len(results)} e-mail flow checks passed")
import json
(Path(__file__).parent / "email_results.json").write_text(json.dumps(
    {"total": len(results), "passed": len(results) - len(failed),
     "results": [{"id": a, "title": b, "expected": c, "actual": str(d), "status": "PASS" if e else "FAIL", "note": "", "shot": None} for a, b, c, d, e in results]}, indent=2))
sys.exit(1 if failed else 0)
