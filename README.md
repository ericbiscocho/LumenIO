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
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Image registry | Amazon ECR |
| Static files | Whitenoise, nginx |

---

## Infrastructure & CI/CD

LumenIO is fully containerized and deployed via an automated CI/CD pipeline.

**Containers** — the backend and frontend each have a multi-stage `Dockerfile`. The backend uses a builder stage to install Python dependencies, then copies only the necessary artifacts into a lean runtime image. The frontend builds the React app with Node, then serves the static output from nginx.

**Local development** — `docker-compose.yml` runs all three services (PostgreSQL, Django, React) together with a single command:
```bash
docker compose up --build
```

**CI pipeline** (`test.yml`) — runs on every push and pull request:
- Spins up a PostgreSQL service container
- Installs Python dependencies and runs Django migrations
- Runs the pytest suite against the live database
- Installs frontend dependencies and verifies the production build

**Deploy pipeline** (`deploy.yml`) — runs on every merge to `main`:
- Authenticates with AWS via GitHub Actions secrets
- Builds both Docker images using multi-stage builds
- Pushes versioned images to Amazon ECR, tagged with the commit SHA

This mirrors the Jenkins-based CI/CD patterns common in larger engineering organizations — the GitHub Actions workflows are structured as direct analogs to declarative Jenkins pipelines.

---

## Local Development

### Requirements

- Python 3.13+
- Node.js 18+
- PostgreSQL (or Docker)

### With Docker (recommended)
```bash
docker compose up --build
```

The API will be available at `http://localhost:8000` and the frontend at `http://localhost:5173`.

### Without Docker

#### Backend
```bash
python -m venv .venv
source .venv/bin/activate       # macOS/Linux
.venv\Scripts\activate          # Windows

pip install -r requirements.txt
python backend/manage.py migrate
python backend/manage.py runserver
```

#### Frontend
```bash
cd frontend
cp src/.env.example src/.env    # add your API base URL
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
├── .github/
│   └── workflows/
│       ├── test.yml            # CI — runs on every push/PR
│       └── deploy.yml          # CD — builds and pushes images to ECR on merge to main
├── backend/
│   ├── Dockerfile.backend
│   ├── manage.py
│   ├── backend/               # Django project settings
│   └── api/                   # Models, views, serializers, tests
├── frontend/
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   ├── src/
│   │   ├── api/               # Axios client instance
│   │   ├── auth/              # JWT login/logout helpers
│   │   ├── components/        # CreateProject, Shots, Tasks
│   │   ├── pages/             # Login, Projects
│   │   ├── types/             # Shared TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── pytest.ini
└── requirements.txt
```