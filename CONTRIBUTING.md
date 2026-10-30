# Contributing to FocusGuard AI

Thanks for taking the time to help. This guide covers how to set up the project, what a good change looks like, and how to send it in. By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- Report a bug or suggest an idea by opening an issue.
- Improve the documentation in `README.md` or `docs/`.
- Fix a bug or build a feature from the [roadmap](README.md#roadmap).
- Add tests under `qa/`.

For anything larger than a small fix, open an issue first so the approach can be agreed before you spend time on it.

## Set up your environment

Follow [Getting started](README.md#getting-started) in the README: create a virtual environment, install `requirements.txt`, run `npm install` in `focusguard-ui`, copy `.env.example` to `.env`, and set up pgvector.

Useful extras while developing:

```bash
python qa/seed_demo.py                      # demo accounts and sample data (backend must be running)
uvicorn app.main:app --reload --port 8000   # backend with auto-reload
cd focusguard-ui && npm run dev             # frontend with hot reload
```

Never commit `.env`, API keys, or `TEST_ACCOUNTS.md`. They are in `.gitignore` on purpose.

## Make a change

1. Fork the repository and clone your fork.
2. Create a branch from `main` with a short, descriptive name, for example `fix/planner-timezone` or `feature/password-reset`.
3. Make your change. Keep it focused: one fix or feature per pull request.
4. Match the style of the code around you, including naming, comment density and structure.
5. Update the docs if you change behavior. API changes belong in [docs/API.md](docs/API.md), architecture changes in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and LLM or RAG changes in [docs/AI-IMPLEMENTATION.md](docs/AI-IMPLEMENTATION.md).
6. Add an entry under `Unreleased` in [CHANGELOG.md](CHANGELOG.md).

## Check your work

Run what applies to the area you touched.

| Area | Command |
|------|---------|
| Frontend types and build | `cd focusguard-ui && npm run build` |
| Frontend lint | `cd focusguard-ui && npm run lint` |
| Backend API | Start the backend, then run `python qa/api_tests.py` |
| RAG | `python qa/rag_tests.py` |
| Extension | Reload it at `chrome://extensions` and try the flow by hand, or run the scripts in `qa/` |

The QA scripts create and clean up their own throw-away data, but run them against a local development database and not one you care about.

## Commit messages

Write a short imperative summary that says what the commit does, for example `Fix idle status heartbeat` or `Add password reset endpoint`. Add a body when the reason is not obvious.

## Open a pull request

Push your branch to your fork and open a pull request against `main`. In the description, say:

- what changed and why,
- how you tested it,
- whether it changes the API, the database, or the extension's permissions.

Screenshots help for any visible UI change. A maintainer will review it, may ask for changes, and will merge it when it is ready.

## Reporting a bug

Include the steps to reproduce, what you expected, what happened instead, your operating system, Python and Node versions, and any error text from the browser console, the extension's service worker console, or the backend log. Remove secrets and personal data first.

For security problems, do not open a public issue. Follow [SECURITY.md](SECURITY.md).
