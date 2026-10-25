"""Print a valid Sub Admin invitation link without needing SMTP.

Usage:  ./venv/bin/python qa/make_invite_link.py "Full Name" person@example.com <organization_id>

The backend normally e-mails this link (valid 24 h). The e-mail account in .env is a placeholder,
so use this script to get the same link for testing the invitation flow.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.security import create_invitation_token  # noqa: E402

name, email, org_id = sys.argv[1], sys.argv[2], int(sys.argv[3])
token = create_invitation_token({"email": email, "name": name, "role": "SUB_ADMIN", "organization_id": org_id})
print(f"http://localhost:5173/#/accept-invitation?token={token}")
