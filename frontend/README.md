# Multi-User Blog Platform

A simple full-stack blog platform with a **FastAPI** back end and a **React + Vite + TypeScript** front end.  
Supports multi-user registration/login (JWT), CRUD blog posts, form validation (Zod), server-state caching (React Query), and full Dockerization.

---

## 🗂️ Project Structure

multi-user-blog-platform/
├── backend/
│ ├── app/ # FastAPI application code
│ │ ├── auth/ # Authentication routes & logic
│ │ ├── posts/ # Blog post routes
│ │ ├── core/ # Security, settings, dependencies
│ │ ├── models.py # ORM models
│ │ ├── schemas.py # Pydantic schemas
│ │ └── main.py # FastAPI app entrypoint
│ ├── tests/ # Pytest + HTTPX async tests
│ ├── requirements.txt # Python dependencies
│ └── Dockerfile # Backend container build
├── frontend/
│ ├── public/ # Static assets & index.html
│ ├── src/
│ │ ├── api/ # Axios client, React Query setup
│ │ ├── pages/ # Screens: Login, Register, PostList, PostDetail, EditPost
│ │ ├── stores/ # Zustand auth store
│ │ ├── App.tsx # Routes & layout
│ │ └── index.css # Tailwind imports
│ ├── package.json # NPM scripts & dependencies
│ ├── package-lock.json
│ ├── vite.config.ts # Vite config (proxy, env)
│ └── Dockerfile # Frontend container build
├── docker-compose.yml # Dev containers for backend + frontend
└── README.md # ← You are here

yaml
Copy
Edit

---

## 🚀 Quickstart

### A) Dockerized (recommended)

```bash
# Clone and start both services
git clone https://github.com/your-username/multi-user-blog-platform.git
cd multi-user-blog-platform

docker compose up --build
Backend → http://localhost:8000/docs

Frontend → http://localhost:5173/

All code changes in backend/app and frontend/src will live-reload.

B) Local (without Docker)
1. Back end
bash
Copy
Edit
cd backend
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# Run with hot-reload
uvicorn app.main:app --reload --port 8000
Open API docs → http://localhost:8000/docs

2. Front end
bash
Copy
Edit
cd frontend
npm install
npm run dev -- --host 0.0.0.0
Open UI → http://localhost:5173/

📝 API Reference
Authentication
Register
POST /users/
Body (JSON)

json
Copy
Edit
{ "email": "alice@example.com", "password": "password" }
Response (201)

json
Copy
Edit
{ "id": 1, "email": "alice@example.com" }
Login
POST /token
Body (form-urlencoded)

ini
Copy
Edit
username=alice@example.com
password=password
Response (200)

json
Copy
Edit
{ "access_token": "<JWT>", "token_type": "bearer" }
Blog Posts
GET /posts/ — List all posts (public)

GET /posts/{id} — Get a single post (public)

POST /posts/ — Create post (protected)

PUT /posts/{id} — Update post (protected, owner only)

DELETE /posts/{id} — Delete post (protected, owner only)

All protected endpoints require the header:

makefile
Copy
Edit
Authorization: Bearer <your-jwt-token>
🔧 Testing
Back end
bash
Copy
Edit
cd backend
pytest -q
Front end
bash
Copy
Edit
cd frontend
npm run test          # run all Vitest tests once
npm run test:watch    # watch mode
🐳 Docker Configuration
backend/Dockerfile and frontend/Dockerfile are already set up for you.
docker-compose.yml ties them together, including shared networks and live-reload mounts.

No manual steps beyond docker compose up --build are needed!

📝 Design & Tech Decisions
FastAPI + Uvicorn: high-performance async Python API

SQLAlchemy: ORM for data modeling

JWT (HS256): stateless auth, stored in client (localStorage via Zustand)

Pydantic: request/response validation & auto docs

React + Vite + TypeScript: fast front-end dev loop

React Query: server-state caching & background updates

React Hook Form + Zod: form management + validation

Tailwind CSS: utility-first styling

Zustand: lightweight global store for auth state

Docker Compose: unified dev environment (hot-reload, isolated ports)

In-memory DB (for now): swap to SQLite/Postgres by setting DATABASE_URL in env

✅ Verified
Clone → Docker

Clone → Local (Python 3.11, Node 20+)

All tests passing

API docs and UI flows validated

Cross-platform (macOS, Linux, Windows)