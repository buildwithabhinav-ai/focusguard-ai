# FocusGuard AI

> AI-powered focus monitoring and distraction intelligence for individuals and teams. It compares what you planned to work on with what you actually did, scores the difference, and explains it in plain language.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL_+_pgvector-336791)
![Chrome](https://img.shields.io/badge/extension-Manifest_V3-4285F4)

<p align="center">
  <img src="docs/images/employee-dashboard.png" alt="Employee dashboard with focus score, planner and live focus status" width="400">
  &nbsp;
  <img src="docs/images/ai-insights.png" alt="AI insights page with the chat assistant" width="520">
</p>

## Overview

A Chrome extension records which sites you visit, for how long, when you switch tabs and when you go idle. A FastAPI backend turns those records into analytics, and an LLM turns the analytics into advice. Each night the day is summarized and stored as an embedding in PostgreSQL, so later answers can refer to earlier weeks and not only to today.

Most screen-time tools tell you how long you were online. FocusGuard AI answers the questions that matter after that:

- How much of your time was productive, and how much was a distraction?
- Were you following the plan you set for today?
- Which sites pulled you away, and how often did you switch tabs?
- How does this week compare with the last one?
- What should you change next?

It works for one person or for a whole organization. Super Admins, Sub Admins and Users each see only the data their role allows.

## Contents

- [Features](#features)
- [Getting started](#getting-started)
- [How it works](#how-it-works)
- [Architecture](#architecture)
- [AI and RAG](#ai-and-rag)
- [Roles](#roles)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Testing](#testing)
- [Security](#security)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- Activity tracking. The extension records websites, durations, tab switches, window focus and active or idle status. The backend marks each site with a category and as productive or non-productive.
- Analytics and focus score. Active, idle, browser, productive and non-productive time, tab switches, and breakdowns by website and category. Organizations also get weekly and monthly views.
- AI recommendations. Daily, weekly and monthly advice written by an LLM from your own numbers. Groq is the default provider, with Gemini and OpenAI as fallbacks.
- Chat assistant. Ask about your own productivity. It combines today's analytics, relevant history and the recent conversation.
- Historical memory (RAG). Daily summaries are embedded with `all-MiniLM-L6-v2` and stored with pgvector, scoped to the user and organization.
- Focus planner. Plan sessions by category with start and end times. The extension checks your live activity against the plan and reports `ON_TRACK` or `OFF_TRACK`.
- Notifications. Break reminders, idle alerts, distraction alerts and organization events, shown as Chrome notifications.
- Teams and roles. Organizations, Sub Admin invitations, employee management, and a deactivation request workflow with approval, rejection and re-activation.
- Multilingual interface. Interface text and dynamic messages are translated through Sarvam AI.

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 20.19+ and npm
- PostgreSQL with the `pgvector` extension available
- Google Chrome

### Installation

```bash
git clone https://github.com/buildwithabhinav-ai/focusguard-ai.git
cd focusguard-ai

python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt

cd focusguard-ui && npm install && cd ..
cp .env.example .env
```

### Environment variables

Open `.env` and fill in at least the following. `.env.example` lists every option, including SMTP settings, `CORS_ORIGINS`, `FRONTEND_URL` and `SUPPORT_EMAIL`.

```env
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/focusguard_ai

DEFAULT_LLM=groq
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=                      # optional

SARVAM_API_KEY=your_sarvam_api_key   # translation

EMAIL_ADDRESS=your_email             # invitation e-mails
EMAIL_PASSWORD=your_app_password
```

A provider without a key is skipped. Never commit your real `.env`; it is already in `.gitignore`.

### Database and pgvector

Create the PostgreSQL database named in `DATABASE_URL`, then run the helper scripts once:

```bash
python enable_pgvector.py     # enable the extension
python check_pgvector.py      # confirm it works
python create_rag_table.py    # create the RAG table
```

Tables for the rest of the app are created when the backend starts.

### Run

```bash
uvicorn app.main:app --reload --port 8000     # backend, http://127.0.0.1:8000
cd focusguard-ui && npm run dev               # frontend, http://localhost:5173
```

On macOS with Homebrew PostgreSQL, `./focusguard.sh` starts the database, backend and frontend together. The backend serves interactive API docs at `http://127.0.0.1:8000/docs`.

The first account registered in an empty database becomes the Super Admin. Everyone after that signs up as a User.

### Load the Chrome extension

1. Open `chrome://extensions` and turn on Developer mode.
2. Choose Load unpacked and select the `chrome_extension` folder.
3. Open the extension popup and sign in with your account.

While `USE_LOCAL_BACKEND` in `chrome_extension/config.js` is `true`, the extension talks to `http://127.0.0.1:8000`. Set it to `false` to use the hosted backend.

### Try it with demo data

With the backend running, this creates demo accounts for each role and sample browsing history:

```bash
python qa/seed_demo.py
```

## How it works

<p align="center">
  <img src="docs/images/workflow.png" alt="Eight-step workflow: sign in, track, classify and store, analyze, advise, plan and notify, remember, review" width="100%">
</p>

1. Sign in. A person registers or logs in and receives JWT access and refresh tokens. The extension has its own sign-in popup.
2. Track. The extension watches tab, window and idle events in Chrome and sends them to the API.
3. Classify and store. When an activity starts, the backend looks the site up in its category table and saves the activity with a category and a productivity value.
4. Analyze. The analytics service computes time totals, tab switches, top sites and the focus score.
5. Advise. The LLM writes recommendations and chat answers from those numbers, plus relevant history.
6. Plan and notify. The planner compares live activity with the planned session, and notification rules raise break, idle and distraction alerts.
7. Remember. Every night at 00:10 IST the previous day is summarized, embedded and stored.
8. Review. Sub Admins and Super Admins open analytics and reports for the users they manage.

### Focus score

The focus score is the share of recorded status time that was active:

```
focus score = active time / (active time + idle time) x 100
```

A user with 7 hours active and 3 hours idle scores 70. Browser time is not part of the denominator.

## Architecture

<p align="center">
  <img src="docs/images/system-architecture.png" alt="System architecture: Chrome extension and React dashboard talk to the FastAPI backend, which uses PostgreSQL with pgvector, the LLM layer and Sarvam AI" width="100%">
</p>

Two clients talk to one FastAPI backend over REST with JWT authentication. The backend owns the database and every call to an outside AI service, so API keys never reach the browser. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for components, request flows and the data model.

## AI and RAG

Yesterday's focus is as useful as today's, so recommendations and chat can look back.

<p align="center">
  <img src="docs/images/rag-pipeline.png" alt="RAG pipeline with a nightly write path and a question-time read path" width="100%">
</p>

- Provider order follows `DEFAULT_LLM`. With `groq`, the backend tries Groq, then Gemini, then OpenAI. If every provider fails, the API returns HTTP 503 with a short message.
- Retrieval filters by user and organization inside the SQL query, so another person's data is never fetched and filtered out afterward.
- Chat looks at the previous 30 days (today excluded), returns up to 5 summaries, and ignores matches below 0.25 similarity.
- Today's metrics are authoritative. Retrieved history is supporting context and keeps its original dates.

Details are in [docs/AI-IMPLEMENTATION.md](docs/AI-IMPLEMENTATION.md).

## Roles

| Role | Can do |
|------|--------|
| Super Admin | Create organizations, invite Sub Admins, approve or reject deactivation requests, re-activate organizations, and see every organization's users and analytics. |
| Sub Admin | Work inside one organization: add users, deactivate users, request deactivation of the organization, and see team analytics, live status and reports. |
| User | See their own dashboard, analytics, AI insights, planner, notifications and reports, and chat with the assistant about their own data. |

## Screenshots

<table>
  <tr>
    <td align="center"><img src="docs/images/employee-dashboard.png" alt="Employee dashboard" width="400"><br><sub>Employee dashboard</sub></td>
    <td align="center"><img src="docs/images/ai-insights.png" alt="AI insights and chat assistant" width="400"><br><sub>AI insights and chat assistant</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/images/focus-planner.png" alt="Focus planner with a live session" width="400"><br><sub>Focus planner with a live session</sub></td>
    <td align="center"><img src="docs/images/superadmin-dashboard.png" alt="Super Admin dashboard" width="400"><br><sub>Super Admin dashboard</sub></td>
  </tr>
</table>

## Tech stack

| Layer | Built with |
|-------|------------|
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn, JWT, APScheduler |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn and Radix UI, Recharts, TanStack Query, Framer Motion |
| AI | Groq, Gemini, OpenAI (optional), Sentence Transformers (`all-MiniLM-L6-v2`), Sarvam AI for translation |
| Data | PostgreSQL with pgvector |
| Extension | Chrome Manifest V3, JavaScript |

## Project structure

```
focusguard-ai/
├── app/                      FastAPI backend
│   ├── routers/              auth, users, admin, organization, activity, analytics,
│   │                         planner, notifications, ai, translation
│   ├── services/
│   │   ├── rag/              documents, embeddings, vector store, retriever,
│   │   │                     context builder, daily ingestion, scheduler
│   │   ├── analytics_service.py
│   │   ├── notification_rules.py
│   │   ├── llm.py            provider selection and fallback
│   │   ├── prompts.py
│   │   └── translation_service.py
│   └── models.py  schemas.py  config.py  database.py  main.py
├── chrome_extension/         Manifest V3 extension (service worker, popup, API client)
├── focusguard-ui/            React + TypeScript dashboard
├── qa/                       API, UI, extension, e-mail and RAG test scripts, demo seeding
├── demo_video/               screenshot capture scripts and source images
├── docs/                     documentation and README images
├── enable_pgvector.py  check_pgvector.py  create_rag_table.py  backfill_rag.py
├── focusguard.sh             one-command local start (macOS)
├── .env.example
└── requirements.txt
```

## Documentation

| File | Contents |
|------|----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, how they communicate, key request flows, data model |
| [docs/API.md](docs/API.md) | Endpoints, authentication, request and response formats |
| [docs/AI-IMPLEMENTATION.md](docs/AI-IMPLEMENTATION.md) | LLM providers, prompts, RAG pipeline, recommendation logic |
| [docs/FocusGuard_AI_Workflow_Overview.pdf](docs/FocusGuard_AI_Workflow_Overview.pdf) | The same overview as an 11-page PDF |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

## Testing

The `qa/` folder holds scripts for the API, browser UI, interactive flows, settings page, e-mail flow and extension behavior. The QA pass on 25 October 2026 ran 337 automated checks against a local build. The 19 failures were logged as defects in the QA report.

| Suite | Checks | Passed | Failed |
|-------|--------|--------|--------|
| API (backend) | 201 | 185 | 16 |
| Browser UI | 67 | 65 | 2 |
| Interactive UI flows | 15 | 15 | 0 |
| Settings page | 13 | 12 | 1 |
| E-mail flow | 22 | 22 | 0 |
| Extension tab tracking | 12 | 12 | 0 |
| Extension login popup | 7 | 7 | 0 |
| Total | 337 | 318 | 19 |

## Security

Passwords are hashed, sessions use JWT access and refresh tokens, and role-based access control limits what each role can reach. Super Admin, Sub Admin and user data are kept apart, including in RAG queries. Secrets live in environment variables. To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Known limitations

- The extension tracks Chrome tabs. It does not see other applications on the computer.
- The focus score uses active and idle time. Productive browsing time is reported separately.
- Recommendations and chat need at least one configured LLM provider and a working connection to it.
- RAG retrieval only looks inside its date window and above its similarity threshold.
- The break, idle and non-productive notification thresholds in `app/services/notification_rules.py` are set to 20 seconds each for testing. Raise them before real use.
- Logout is stateless: the server tells the client to discard its token, and issued tokens stay valid until they expire.

## Roadmap

- [x] Chrome extension activity tracking
- [x] Analytics, focus score and AI recommendations
- [x] Chat assistant with historical RAG
- [x] Focus planner and notifications
- [x] Organizations, invitations and role-based access
- [x] Translated interface
- [ ] End existing sessions when an account is deactivated
- [ ] Password policy and login throttling
- [ ] Password reset

## Contributing

Fork the repository, create a branch, commit your changes and open a pull request. Read [CONTRIBUTING.md](CONTRIBUTING.md) first, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

MIT. See [LICENSE](LICENSE).

## Author

Abhinav · [GitHub](https://github.com/buildwithabhinav-ai) · [support.focusguardai@gmail.com](mailto:support.focusguardai@gmail.com)

Thanks to the teams behind React, FastAPI, PostgreSQL, pgvector, Groq, Google Gemini, OpenAI, Hugging Face (Sentence Transformers) and Sarvam AI.
