# API reference

The backend is a FastAPI application. With it running, interactive documentation is generated automatically:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

Those pages are the full specification. This file summarizes the conventions and the endpoints.

## Conventions

- Base URL: `http://127.0.0.1:8000` locally.
- Request and response bodies are JSON.
- Protected endpoints need `Authorization: Bearer <access_token>`. The Access column below shows who may call each one.
- Errors use FastAPI's shape: `{ "detail": "message" }` with an HTTP status such as 400, 401, 403, 404 or 503.
- Time values are ISO 8601. Durations are in seconds. Planner times use IST.
- Many notification, planner and translation endpoints accept `?language=<code>` (default `en`) and translate their messages.

## Authentication

### Register and log in

| Method | Path | Access | Body |
|--------|------|--------|------|
| POST | `/auth/register` | Public, first account only | `UserRegister` |
| POST | `/auth/register-user` | Public | `UserRegister` |
| POST | `/auth/login` | Public | `UserLogin` |
| POST | `/auth/refresh-token` | Public | `{ "refresh_token": "..." }` |
| PATCH | `/auth/change-password` | Bearer | `{ "current_password", "new_password", "confirm_password" }` |
| POST | `/auth/logout` | Public | none |

`/auth/register` works only while the database has no users. The account it creates is the Super Admin, and later calls return 403. `/auth/register-user` always creates a `USER`, and any role or organization sent with it is ignored. Sub Admins come only from invitations.

`UserRegister` is `{ "full_name", "email", "password", "age", "occupation" }`. `UserLogin` is `{ "email", "password" }`.

```http
POST /auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "********" }
```

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "Bearer"
}
```

`/auth/refresh-token` returns a new `access_token` and `token_type`. Logout is stateless: the response tells the client to discard its token, and issued tokens stay valid until they expire.

## Users

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/users/me` | Bearer | Profile of the signed-in user |

## Activity

Used by the Chrome extension.

| Method | Path | Access | Body or query | Purpose |
|--------|------|--------|---------------|---------|
| POST | `/activity/start` | Bearer | `{ "url", "tab_title", "application" }` | Start an activity. The backend looks up the site's category and productivity. |
| PUT | `/activity/end/{activity_id}` | Bearer | none | End an activity and store its duration |
| GET | `/activity/current` | Bearer | none | The running activity |
| GET | `/activity/history` | Bearer | none | Past activities |
| POST | `/activity/tab-switch` | Bearer | `{ "from_website", "to_website" }` | Record a tab or website switch |
| POST | `/activity/status` | Bearer | `{ "status": "ACTIVE" or "IDLE" }` | Update the user's status |
| GET | `/activity/status` | Bearer | none | Current status |
| GET | `/activity/users/{user_id}/status` | Sub Admin | none | Live status of a user in the Sub Admin's organization |

```json
{ "message": "Activity Started", "activity_id": 123 }
```

## Analytics

All Bearer. Endpoints without a prefix return the signed-in user's own data. The `/analytics/role/...` variants return data for the signed-in role's scope (own data for a User, the organization for a Sub Admin, everything for a Super Admin). The `/analytics/users/{user_id}/...` variants return one user's data to a role allowed to see that user.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/analytics/summary` | Time totals |
| GET | `/analytics/categories` | Time by category |
| GET | `/analytics/websites` | Time by website |
| GET | `/analytics/tab-switches?date=` | Tab switches, optionally for one date |
| GET | `/analytics/activity-summary` | Activity summary |
| GET | `/analytics/dashboard` | Metrics for the dashboard, including the focus score |
| GET | `/analytics/report?type=weekly or monthly` | Daily breakdown report. Any other type returns 400. |
| GET | `/analytics/role/categories`, `/websites`, `/activity-summary`, `/tab-switches`, `/report` | Same data at the role's scope |
| GET | `/analytics/users/{user_id}/activity-summary`, `/activity`, `/websites`, `/categories`, `/tab-switches`, `/report` | Same data for one user |

## AI

| Method | Path | Access | Body or query | Purpose |
|--------|------|--------|---------------|---------|
| GET | `/ai/recommendation?period=today\|week\|month` | Bearer | none | Personalized recommendation |
| GET | `/ai/organization-recommendation?organization_id=&period=` | Bearer | none | Organization-level recommendation |
| POST | `/ai/chat` | Bearer | `{ "message", "history": [{ "sender", "text" }] }` | Ask the assistant |

```http
POST /ai/chat
Authorization: Bearer <access_token>

{
  "message": "Which websites distracted me the most this week?",
  "history": [{ "sender": "user", "text": "How was my focus today?" }]
}
```

```json
{ "response": "..." }
```

A recommendation response includes `period`, `generated_at`, the metrics it used (`active_time`, `idle_time`, `browser_time`, `productive_time`, `non_productive_time`, their `_seconds` forms, `focus_score`, `tab_switches`, `top_websites`, `top_categories`, `productive_websites`, `distracting_websites`) and the `recommendation` text. If no LLM provider can answer, the endpoints return 503. See [AI-IMPLEMENTATION.md](AI-IMPLEMENTATION.md).

## Planner

All Bearer.

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | `/planner` | `FocusPlanCreate` | Create a plan for a day |
| PUT | `/planner/{plan_id}` | `FocusPlanUpdate` | Replace a plan's goal and sessions |
| GET | `/planner/today` | none | Today's plan |
| GET | `/planner/categories` | none | Categories available for sessions |
| GET | `/planner/progress` | none | Progress against the plan |
| GET | `/planner/recommendation` | none | Planner suggestion |
| GET | `/planner/current-session` | none | The session running now |
| GET | `/planner/live-status?language=` | none | Live planner status |
| POST | `/planner/check-focus` | none | Compare current activity with the planned session |

```json
{
  "plan_date": "2026-10-31T00:00:00",
  "total_goal_minutes": 180,
  "plans": [
    { "category": "Development", "planned_minutes": 120, "start_time": "10:00:00", "end_time": "12:00:00" },
    { "category": "Documentation", "planned_minutes": 60, "start_time": "14:00:00", "end_time": "15:00:00" }
  ]
}
```

`/planner/check-focus` returns a `status` of `NO_PLAN`, `NO_SESSION`, `NO_ACTIVITY`, `ON_TRACK` or `OFF_TRACK`. `ON_TRACK` and `OFF_TRACK` also carry `planned_category`, `current_category` and a translated `message`. `OFF_TRACK` adds `website`, `url`, `notification` and `already_notified`.

## Notifications

All Bearer. `language` is an optional query parameter.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/notifications/` | List the user's notifications |
| GET | `/notifications/unread-count` | Number of unread notifications |
| GET | `/notifications/latest` | Latest unread notification |
| PATCH | `/notifications/{notification_id}/read` | Mark one as read |
| PATCH | `/notifications/read-all` | Mark all as read |

`/notifications/latest` returns `id`, `title`, `message`, `notification_type`, `is_read` and `created_at`. When there is nothing new it returns `notification: null` with a message.

## Organizations

| Method | Path | Access | Body | Purpose |
|--------|------|--------|------|---------|
| POST | `/organizations/` | Super Admin | `{ "organization_name" }` | Create an organization |
| GET | `/organizations/` | Bearer | none | List organizations |
| PUT | `/organizations/assign` | Super Admin | `{ "user_id", "organization_id" }` | Assign a Sub Admin to an organization |
| POST | `/organizations/deactivation-request` | Sub Admin | `{ "reason" }` | Request deactivation. One pending request at a time. |
| GET | `/organizations/deactivation-requests` | Super Admin | none | List requests |
| PUT | `/organizations/deactivation-request/{request_id}/approve` | Super Admin | none | Approve and deactivate the organization |
| PUT | `/organizations/deactivation-request/{request_id}/reject` | Super Admin | none | Reject |
| PUT | `/organizations/{organization_id}/activate` | Super Admin | none | Re-activate |
| POST | `/organizations/users` | Sub Admin | `OrganizationUserCreate` | Add an employee. Body: `{ "full_name", "email", "password", "age", "occupation" }`. |
| GET | `/organizations/users` | Sub Admin | none | List the organization's users |
| PUT | `/organizations/users/{user_id}/deactivate` | Sub Admin | none | Deactivate a user in the organization |

## Admin

All require a Super Admin, except `accept-invitation`.

| Method | Path | Body or query | Purpose |
|--------|------|---------------|---------|
| GET | `/admin/dashboard` | none | Super Admin dashboard data |
| GET | `/admin/all-users` | none | Every user |
| PUT | `/admin/change-role/{user_id}` | `{ "role" }` | Change a user's role |
| DELETE | `/admin/delete-user/{user_id}` | none | Delete a user |
| GET | `/admin/statistics` | none | Counts by role |
| POST | `/admin/invite-sub-admin` | `{ "full_name", "email", "organization_id" }` | E-mail a signed invitation link |
| POST | `/admin/accept-invitation?token=` | `{ "password" }` | Public. Create the Sub Admin account from a valid invitation. |

## Translation

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/translation/languages` | Public | Supported languages |
| GET | `/translation/message/{message_key}?language=` | Public | A stored interface message |
| POST | `/translation/dynamic?language=` | Public | Body `{ "message" }`. Translate free text. |
| POST | `/translation/batch?language=` | Public | Body `{ "items": [{ "text", "key" }] }`. Translate many strings. |
| PUT | `/translation/language` | Bearer | Body `{ "language" }`. Save the user's preferred language. |
