#!/usr/bin/env python3
"""Connect FocusGuard AI to a Gmail account so invitation e-mails are really delivered.

Run from the project folder:

    ./venv/bin/python setup_email.py

It asks for the Gmail address and its App Password (typed hidden - nothing is echoed or sent
anywhere except to Gmail), saves them in .env, and sends you a test e-mail right away so you
know it works. The backend does not need a restart.

How to get an App Password (needed because Gmail does not accept your normal password here):
  1. https://myaccount.google.com/security  ->  turn on 2-Step Verification
  2. https://myaccount.google.com/apppasswords  ->  create one (any name, e.g. "FocusGuard")
  3. Copy the 16 characters Google shows (spaces do not matter)
"""
import argparse
import getpass
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def set_env_value(text: str, key: str, value: str) -> str:
    """Replace KEY=... in the .env text (or append it), keeping every other line as it is."""
    line = f"{key}={value}"
    pattern = re.compile(rf"^{re.escape(key)}=.*$", re.M)
    if pattern.search(text):
        return pattern.sub(lambda _m: line, text, count=1)
    return text.rstrip("\n") + f"\n{line}\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Set up the e-mail account used for invitation e-mails.")
    parser.add_argument("--env-file", default=str(ROOT / ".env"), help="path of the .env file to update")
    parser.add_argument("--email", help="Gmail address (asked if left out)")
    parser.add_argument("--send-to", help="where to send the test e-mail (default: the Gmail address itself)")
    args = parser.parse_args()

    env_path = Path(args.env_file)
    if not env_path.exists():
        print(f"{env_path} not found. Copy .env.example to .env first.")
        return 1

    print("FocusGuard AI - e-mail set-up\n")
    address = (args.email or input("Gmail address that will SEND the invitations: ")).strip()
    if "@" not in address:
        print("That does not look like an e-mail address.")
        return 1
    password = getpass.getpass("App Password (16 characters, input is hidden): ").replace(" ", "").strip()
    if not password:
        print("No password entered.")
        return 1

    text = env_path.read_text()
    text = set_env_value(text, "EMAIL_ADDRESS", address)
    text = set_env_value(text, "EMAIL_PASSWORD", password)
    env_path.write_text(text)
    print(f"\nSaved EMAIL_ADDRESS and EMAIL_PASSWORD in {env_path}.")

    # send a real test message with the same code the backend uses
    os.chdir(env_path.parent)
    from app.email_service import send_email_detailed

    recipient = (args.send_to or address).strip()
    print(f"Sending a test e-mail to {recipient} ...")
    ok, error = send_email_detailed(
        recipient,
        "FocusGuard AI - e-mail test",
        "This is a test message from FocusGuard AI.\n\n"
        "If you can read it, invitation e-mails will be delivered. You can delete it.\n",
    )
    if ok:
        print("\nSUCCESS - the test e-mail was accepted by the mail server. Check the inbox (and Spam).")
        print("Invitations sent from the Super Admin page will now be e-mailed to the invitee.")
        return 0

    print(f"\nFAILED: {error}")
    print("The settings were saved; run this script again to correct them.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
