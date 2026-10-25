# FocusGuard AI

### Human Attention Preservation & Digital Distraction Intelligence Platform

<p align="center">
  <strong>AI-powered productivity and digital attention intelligence platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/pgvector-RAG-3B82F6" alt="pgvector">
  <img src="https://img.shields.io/badge/LLM-Groq%20%7C%20Gemini-purple" alt="LLM">
  <img src="https://img.shields.io/badge/RAG-Enabled-orange" alt="RAG">
</p>

<p align="center">
  <a href="https://github.com/aditikumari4623/FocusGuard-AI">Repository</a>
  ·
  <a href="#-key-features">Features</a>
  ·
  <a href="#-retrieval-augmented-generation-rag">RAG</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

FocusGuard AI is an AI-powered productivity and digital attention monitoring platform that analyzes users' digital activity, identifies distraction patterns, tracks focus behavior, and provides personalized recommendations to improve productivity.

The platform combines a FastAPI backend, React frontend, PostgreSQL database, Chrome Extension, analytics, AI/LLM integration, and Retrieval-Augmented Generation (RAG) to provide both real-time and historical productivity insights.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access and refresh tokens
- Secure password hashing
- Role-Based Access Control (RBAC)
- Three user roles:
  - Super Admin
  - Sub Admin
  - User
- User and organization deactivation workflows

---

### 🏢 Organization Management

- Create and manage organizations
- Assign users to organizations
- Invite users and Sub Admins
- Organization-level analytics
- Organization deactivation workflow
- Role-specific access and data isolation

---

### 🌐 Digital Activity Tracking

The Chrome Extension tracks users' browser activity and sends activity information to the backend.

Tracked information includes:

- Website activity
- Activity start and end time
- Tab switches
- Active/idle status
- Website categories
- Productive and distracting websites

The extension communicates with the FastAPI backend through REST APIs.

---

### 📊 Productivity Analytics

FocusGuard AI provides analytics at multiple levels.

#### User Analytics

- Active time
- Idle time
- Browser time
- Productive time
- Non-productive time
- Focus score
- Website analytics
- Category analytics
- Tab-switch analytics

#### Organization Analytics

Super Admins and Sub Admins can view organization-level productivity insights while maintaining role-based access restrictions.

Analytics include:

- Organization activity
- Focus score
- Website usage
- Category distribution
- Tab switching
- Weekly activity
- Monthly activity

---


## 🤖 AI-Powered Productivity Recommendations

FocusGuard AI uses Large Language Models to transform productivity analytics into personalized recommendations.

The AI layer can analyze information such as:

- Focus score
- Active time
- Idle time
- Browser activity
- Productive websites
- Distracting websites
- Website categories
- Tab switching behavior
- Historical productivity patterns

The application currently uses **Groq as the preferred LLM provider**, with Gemini available as a fallback.

The architecture is designed so additional LLM providers can be integrated without changing the main application flow.

---

## 🧠 Retrieval-Augmented Generation (RAG)

FocusGuard AI also includes a RAG pipeline for historical productivity analysis.

Instead of relying only on the current day's analytics, historical productivity summaries are converted into embeddings and stored in PostgreSQL using `pgvector`.

### RAG Pipeline

```text
User Activity
      ↓
Analytics Engine
      ↓
Daily Productivity Summary
      ↓
Text Document Generation
      ↓
Embedding Generation
      ↓
PostgreSQL + pgvector
      ↓
Semantic Similarity Search
      ↓
Relevant Historical Context
      ↓
LLM
      ↓
Personalized AI Response


RAG Components

The project includes:

Document generation
Sentence Transformer embeddings
Vector storage
Semantic similarity retrieval
Historical context construction
Daily ingestion
Organization-level RAG
User-level RAG
Scheduled ingestion
Historical context filtering

The embedding model used is:
all-MiniLM-L6-v2
with a 384-dimensional embedding vector.

Historical retrieval is also isolated by user and organization to prevent unrelated productivity data from being included in AI responses.



💬 AI Chatbot

FocusGuard AI includes an AI chatbot that can answer FocusGuard-related productivity questions.

The chatbot can use:

Current productivity analytics
Historical productivity context
User activity patterns
FocusGuard-specific application data

The chatbot is designed to distinguish current analytics from historical RAG context.


🧭 Focus Planner

The Focus Planner helps users organize focused work sessions.

Features include:

Create focus plans
Edit existing plans
View today's plan
Track planned categories
Monitor current sessions
Track progress
Live focus status
AI-powered planner recommendations
Focus checking against planned activities

The Chrome Extension periodically communicates with the planner APIs to determine whether the user's current activity matches the planned focus category.


🔔 Smart Notifications

FocusGuard AI provides productivity notifications based on user activity.

Examples include:

Extended break requirements
Long non-productive activity
Extended idle activity
Focus reminders
Planner-related notifications

Notifications are scoped to the authenticated user so that users only access their own notifications.


🌍 Multi-language Support

The application includes translation support for the user interface.

The frontend provides a language selector and translation context, while the backend exposes translation-related APIs and services.



### 🎨 Modern Responsive UI

The frontend is built with:

React
TypeScript
Vite
Tailwind CSS
shadcn/Radix UI components
Lucide icons
Recharts
next-themes

The application supports:
Responsive layouts
Light mode
Dark mode
Role-specific dashboards
Interactive analytics
Modern dashboard components


🏗️ System Architecture

                         ┌──────────────────────┐
                         │    Chrome Extension  │
                         │   Manifest V3        │
                         └──────────┬───────────┘
                                    │
                                    │ REST APIs
                                    ↓
┌────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                        │
│                                                            │
│  Authentication   Activity   Analytics   Planner           │
│  Organizations    Users      Notifications   AI            │
│                                                            │
└───────────────┬──────────────────────────┬─────────────────┘
                │                          │
                ↓                          ↓
       ┌─────────────────┐        ┌─────────────────────┐
       │   PostgreSQL    │        │     AI / LLM Layer  │
       │                 │        │                     │
       │ Application DB  │        │ Groq                │
       │ RAG Documents   │        │ Gemini fallback     │
       │ pgvector        │        │                     │
       └─────────────────┘        └──────────┬──────────┘
                                             │
                                             ↓
                                      AI Recommendations
                                      & Chat Responses


                 ┌─────────────────────────────┐
                 │       React Frontend        │
                 │                             │
                 │ Dashboards / Analytics      │
                 │ Planner / Reports           │
                 │ AI / Settings               │
                 └─────────────────────────────┘





🛠️ Tech Stack
Backend:
Python
FastAPI
SQLAlchemy
PostgreSQL
pgvector
JWT Authentication
Pydantic
Uvicorn

Frontend:
React
TypeScript
Vite
Tailwind CSS
shadcn/Radix UI
Recharts
Lucide React
TanStack Query

AI / Machine Learning:
Groq API
Gemini API
Sentence Transformers
all-MiniLM-L6-v2
Retrieval-Augmented Generation (RAG)
Vector similarity search

Browser Extension:
Chrome Extension
Manifest V3
JavaScript
REST API integration

Database:
PostgreSQL
pgvector
SQLAlchemy



📁 Project Structure

FocusGuardAI/
│
├── app/
│   ├── routers/
│   │   ├── activity.py
│   │   ├── admin.py
│   │   ├── ai.py
│   │   ├── analytics.py
│   │   ├── auth.py
│   │   ├── organization.py
│   │   └── users.py
│   │
│   ├── services/
│   │   ├── rag/
│   │   │   ├── context_builder.py
│   │   │   ├── daily_ingestion.py
│   │   │   ├── documents.py
│   │   │   ├── embeddings.py
│   │   │   ├── rag_service.py
│   │   │   ├── retriever.py
│   │   │   ├── scheduler.py
│   │   │   └── vector_store.py
│   │   │
│   │   ├── analytics_service.py
│   │   ├── llm.py
│   │   └── prompts.py
│   │
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── main.py
│
├── chrome_extension/
│   ├── background.js
│   ├── api.js
│   ├── storage.js
│   └── manifest.json
│
├── focusguard-ui/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
│
├── test_rag_retrieval.py
├── test_rag_vector_store.py
├── test_rag_organization.py
├── backfill_rag.py
├── requirements.txt
└── README.md



⚙️ Local Setup
1. Clone the repository:
git clone https://github.com/aditikumari4623/FocusGuard-AI.git
cd FocusGuard-AI


2. Backend Setup:
Create and activate a virtual environment.

Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

Install dependencies:
pip install -r requirements.txt


3. Environment Variables:
Create a .env file in the project root.

Example:
SECRET_KEY=your_secret_key
DATABASE_URL=your_postgresql_database_url

EMAIL_ADDRESS=your_email
EMAIL_PASSWORD=your_email_password

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

DEFAULT_LLM=groq



4. PostgreSQL + pgvector:
The RAG system requires PostgreSQL with the pgvector extension enabled.

The project contains helper scripts for:

Creating the RAG table
Checking pgvector
Enabling pgvector
Backfilling historical RAG data



5. Run the Backend:
uvicorn app.main:app --reload

The API will be available locally through the FastAPI server.


🌐 Frontend Setup

Navigate to the frontend:
cd focusguard-ui

Install dependencies:
npm install

Run the development server:
npm run dev


🧩 Chrome Extension

The Chrome Extension is used to collect browser activity and communicate with the backend.

General setup:

1. Open Chrome.
2. Navigate to:
 chrome://extensions/
3. Enable Developer mode.
4. Select Load unpacked.
5. Select the chrome_extension directory.
6. Configure the backend API URL according to your local environment.


🔒 Security & Data Isolation:

FocusGuard AI uses role-based and user-based access controls.
The application separates:

Super Admin data
Sub Admin organization data
Individual user data

RAG retrieval also applies user and organization filters at the database query level rather than retrieving unrelated documents and filtering them afterward.

Sensitive configuration values are stored through environment variables and are excluded from version control.


🧪 Testing

The repository includes tests for the RAG functionality, including:

Vector storage
Semantic retrieval
Historical RAG
Organization-level retrieval
API/RAG integration
Real-data RAG scenarios

Example:
pytest


📈 Current Project Capabilities

FocusGuard AI currently combines:
Browser Activity Tracking
        +
Productivity Analytics
        +
Focus Planning
        +
Role-Based Organization Management
        +
Notifications
        +
LLM Recommendations
        +
AI Chatbot
        +
Historical RAG
        ↓
Digital Attention Intelligence Platform



## 📬 Support & Contact

Questions, problems with an account, or want to talk to the team?
Write to **[support.focusguardai@gmail.com](mailto:support.focusguardai@gmail.com)**.

The address is used by the Contact page, the "Talk to our team" and Enterprise buttons, the footer, the
Privacy and Terms pages, the Settings pages ("Need help?"), the login "Forgot Password?" link, the Chrome
extension popup, and the invitation / welcome e-mails. In the web app it lives in one place,
`focusguard-ui/src/config/support.ts`; in the backend it is `SUPPORT_EMAIL` in `.env`.

## 👩‍💻 Developer

Aditi Kumari

Computer Science Engineering — 2026

Focus areas:

Software Engineering
Backend Development
Full-Stack Development
AI / Generative AI
RAG Systems
REST APIs
Database Systems


📌 Note

This project was developed as a full-stack AI productivity and digital attention intelligence platform, combining software engineering, browser activity tracking, analytics, LLM integration, and Retrieval-Augmented Generation.