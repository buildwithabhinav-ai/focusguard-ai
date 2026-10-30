# FocusGuard AI

> A Chrome extension and web dashboard that compares what you planned to work on with what you actually did, then explains the gap in plain language. Built for individuals and teams.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11-blue)

![Demo](demo_video/shots/emp_dashboard.png)

## Features
- Activity tracking: a Manifest V3 Chrome extension records the sites you visit, for how long, tab switches, and active or idle time, with each site marked productive or distracting.
- Analytics and focus score: breakdowns by website, category and tab switches, plus weekly and monthly views for organizations.
- AI recommendations: an LLM turns your numbers into suggestions. Groq is the default provider and Gemini is the fallback.
- Chat assistant with memory: daily summaries are stored as embeddings in pgvector, so answers can draw on patterns from past weeks.
- Focus planner: plan sessions by category, and the extension flags when your live activity drifts from the plan.
- Notifications for long breaks, long idle stretches, long non-productive activity and planner events.
- Teams and roles: organizations, invitations, and Super Admin, Sub Admin and User roles that each see only their own data.
- Interface in several languages through Sarvam AI translation, with light and dark themes.

## Tech Stack
Python · FastAPI · SQLAlchemy · React 19 · TypeScript · Vite · Tailwind CSS · PostgreSQL + pgvector · Chrome Manifest V3 · Groq · Gemini

## Project Structure
```
├── app/                 FastAPI backend (routers, services, RAG pipeline, models)
├── chrome_extension/    Manifest V3 extension
├── focusguard-ui/       React + TypeScript dashboard
├── qa/                  API, UI, extension, e-mail and RAG test scripts
├── demo_video/          screenshots and assets used in this README
├── docs/                README images
├── focusguard.sh        local start script (macOS)
└── requirements.txt
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node 20.19+
- PostgreSQL with the `pgvector` extension available
- Google Chrome

### Installation
```bash
git clone https://github.com/buildwithabhinav-ai/focusguard-ai.git
cd focusguard-ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
cd focusguard-ui && npm install && cd ..
```

Fill in `.env`. At minimum you need `SECRET_KEY`, `DATABASE_URL`, `GROQ_API_KEY` or `GEMINI_API_KEY`, and `DEFAULT_LLM`. `SARVAM_API_KEY` enables translation, and `EMAIL_ADDRESS` with `EMAIL_PASSWORD` enables invitation e-mails. `.env.example` lists every option.

Then set up pgvector for the RAG features:
```bash
python enable_pgvector.py
python check_pgvector.py
python create_rag_table.py
```

### Run
```bash
uvicorn app.main:app --reload --port 8000
cd focusguard-ui && npm run dev
```

The dashboard opens at `http://localhost:5173`. On macOS with Homebrew PostgreSQL, `./focusguard.sh` starts the database, backend and frontend together.

To load the extension, open `chrome://extensions/`, turn on Developer mode, choose Load unpacked, and select the `chrome_extension` folder. While `USE_LOCAL_BACKEND` in `chrome_extension/config.js` is `true`, the extension talks to `http://127.0.0.1:8000`.

## Usage
With the backend running, create demo accounts and sample browsing history for each role:
```bash
python qa/seed_demo.py
```

To build embeddings from history that already exists in your database:
```bash
python backfill_rag.py
```

## Results
The QA pass on 25 October 2026 ran 337 automated checks against a local build. The 19 failures were logged as defects in the QA report.

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

The scripts behind these numbers are in `qa/`.

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
Fork → create a branch → commit → open a pull request.

## License
MIT. See [LICENSE](LICENSE).

## Contact
Aditi Kumari · [GitHub](https://github.com/buildwithabhinav-ai) · [support.focusguardai@gmail.com](mailto:support.focusguardai@gmail.com)
