# LumenIO

A full-stack VFX shot tracking and production management tool. LumenIO lets teams create projects, manage shots, and track production status across a pipeline — replacing the spreadsheets and whiteboards that most small studios rely on.

---

## Architecture

```
┌─────────────────────┐        HTTP/REST        ┌──────────────────────┐
│   React + Vite      │ ──────────────────────► │   Django REST API    │
│   TypeScript        │ ◄────────────────────── │   Python             │
└─────────────────────┘                         └──────────┬───────────┘
                                                           │
                                                           ▼
                                                 ┌──────────────────────┐
                                                 │     PostgreSQL       │
                                                 └──────────────────────┘
```

**Frontend** — React 19, TypeScript, Vite. Axios handles API communication with a shared client instance. Components are organized by page (`/pages`) and reusable UI (`/components`), with shared domain types colocated in `/types/api.ts`.

**Backend** — Django 6 with Django REST Framework. JWT authentication via SimpleJWT. API follows REST conventions with paginated list endpoints.

**Database** — PostgreSQL. Django ORM handles migrations and query construction.

---

## Features

- **Project management** — create and browse production projects
- **Shot tracking** — view all shots within a project, scoped by project ID
- **Task tracking** — manage tasks within shots, with status workflow: `To Do → In Progress → Review → Done`
- **Status workflow** — update shot status inline: `Not Started → In Progress → Completed → Approved → On Hold`
- **JWT authentication** — token-based login/logout with protected routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| HTTP client | Axios |
| Backend | Django 6, Django REST Framework |
| Auth | SimpleJWT |
| Database | PostgreSQL |

---

## Local Development

### Requirements

- Python 3.13+
- Node.js 18+
- PostgreSQL

### Backend

```bash
python -m venv .venv
source .venv/bin/activate       # macOS/Linux
.venv\Scripts\activate          # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
cp .env.example .env            # add your API base URL
npm install
npm run dev
```

### Environment Variables

Create `frontend/.env` from the provided `.env.example`:

```
VITE_API_BASE_URL=http://localhost:8000/api/
```

---

## Project Structure

```
LumenIO/
├── backend/
│   ├── manage.py
│   ├── backend/
│   └── ...
└── frontend/
│   ├── src/
│   │   ├── api/          # Axios client instance
│   │   ├── auth/         # JWT login/logout helpers
│   │   ├── components/   # CreateProject, Shots, Tasks
│   │   ├── pages/        # Login, Projects
│   │   ├── types/        # Shared TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
└── requirements.txt
```