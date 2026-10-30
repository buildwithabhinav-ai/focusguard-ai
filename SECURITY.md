# Security policy

FocusGuard AI handles browsing activity, so we take security reports seriously.

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.0.x | Yes |
| Earlier | No |

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately in one of these ways:

- Use GitHub's private vulnerability reporting on this repository's Security tab, if it is enabled.
- Or e-mail [support.focusguardai@gmail.com](mailto:support.focusguardai@gmail.com) with the subject line "FocusGuard AI security report".

Include as much as you can:

- what the problem is and which part is affected (backend endpoint, dashboard page, Chrome extension, RAG, invitations),
- steps to reproduce, or a proof of concept,
- the impact you expect, for example access to another user's data,
- the version or commit you tested.

We will acknowledge your report, look into it, and keep you updated on the fix. Please give us reasonable time to fix the issue before sharing details publicly. We are happy to credit you in the changelog if you want that.

## What we especially care about

- Access across roles or organizations: a User reaching Sub Admin or Super Admin data, or one organization seeing another's.
- Authentication and session handling: JWT access and refresh tokens, invitation links, password changes, deactivated accounts.
- RAG retrieval returning another person's stored summaries.
- Exposure of secrets such as the secret key, database URL or LLM and translation API keys.
- Injection (SQL, prompt, script) through activity data, chat messages or translated text.
- The Chrome extension's permissions and what it sends to the backend.

## Please do

- Test against your own local setup or data you own. `python qa/seed_demo.py` creates throw-away accounts for this.
- Avoid accessing, changing or deleting other people's data.

## Please do not

- Run denial-of-service or high-volume automated attacks against a hosted deployment.
- Use social engineering or physical attacks against maintainers or users.

## For people running FocusGuard AI

- Set a long, random `SECRET_KEY` and keep `.env` out of version control.
- Use a dedicated database user with only the permissions the app needs.
- Raise the notification thresholds in `app/services/notification_rules.py` before real use. They are set for testing.
- Keep the extension's `USE_LOCAL_BACKEND` flag set to `false` for any build you distribute, and serve the backend and dashboard over HTTPS.
- Restrict `CORS_ORIGINS` to the origins you actually use.
