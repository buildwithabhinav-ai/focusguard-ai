# Changelog

All notable changes to FocusGuard AI are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `docs/ARCHITECTURE.md`, `docs/API.md` and `docs/AI-IMPLEMENTATION.md` with the deeper technical detail.
- `docs/images/` with the architecture, workflow, RAG pipeline and extension diagrams and the dashboard screenshots used in the README.
- `docs/FocusGuard_AI_Workflow_Overview.pdf`, an 11-page workflow and system overview.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and this changelog.
- `LICENSE` (MIT).

### Changed

- Rewrote `README.md` so the first screen explains what the project does, what makes it different and how to run it, with the project structure and setup steps matching the repository.

### Removed

- The demo video and its poster page (`FocusGuard_AI_Demo.mp4`, `docs/demo.html`, `docs/assets/demo-poster.jpg`).

## [1.0.0] - 2026-10-26

Initial release.

### Added

- Chrome extension (Manifest V3) that records website activity, tab switches, window focus and idle status, and shows Chrome notifications.
- FastAPI backend with JWT authentication (access and refresh tokens), role-based access control and the routers for auth, users, admin, organization, activity, analytics, planner, notifications, AI and translation.
- Analytics: active, idle, browser, productive and non-productive time, tab switches, top websites and categories, and the focus score.
- AI recommendations for today, the week and the month, with provider selection and fallback across Groq, Gemini and OpenAI.
- Chat assistant that combines current analytics, retrieved history and recent conversation.
- Historical memory with RAG: nightly summaries embedded with `all-MiniLM-L6-v2` and stored in PostgreSQL with pgvector, scoped by user and organization.
- Focus planner with category sessions and `ON_TRACK` or `OFF_TRACK` checks against live activity.
- Notifications for breaks, idle time, non-productive activity and organization events.
- Organizations with Super Admin, Sub Admin and User roles, signed invitation links, and a deactivation request workflow with approval, rejection and re-activation.
- React 19 dashboard with role-specific areas, light and dark themes, and interactive charts.
- Interface translation through Sarvam AI.
- QA scripts in `qa/` and a demo data seeder.

[Unreleased]: https://github.com/buildwithabhinav-ai/focusguard-ai/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/buildwithabhinav-ai/focusguard-ai/releases/tag/v1.0.0
