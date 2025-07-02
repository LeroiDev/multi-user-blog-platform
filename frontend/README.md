# Multi-User Blog Platform

A simple full-stack blog platform with a **FastAPI** back end and a **React + Vite + TypeScript** front end.
Supports multi-user registration/login (JWT), CRUD blog posts, form validation (Zod), server-state caching (React Query), and full Dockerization.

---

## 🗂️ Project Structure

```
multi-user-blog-platform/
├── backend/
│   ├── app/                # FastAPI application code
│   │   ├── auth/           # Authentication routes & logic
│   │   ├── posts/          # Blog post routes
│   │   ├── core/           # Security, settings, dependencies
│   │   ├── models.py       # ORM models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── main.py         # FastAPI app entrypoint
│   ├── tests/              # Pytest + HTTPX async tests
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container build
├── frontend/
│   ├── public/             # Static assets & index.html
│   ├── src/
│   │   ├── api/           # Axios client, React Query setup
│   │   ├── pages/         # Screens: Login, Register, PostList, PostDetail, EditPost
│   │   ├── stores/        # Zustand auth store
│   │   ├── App.tsx        # Routes & layout
│   │   └── index.css      # Tailwind imports
│   ├── package.json        # NPM scripts & dependencies
│   ├── package-lock.json
│   ├── vite.config.ts      # Vite config (proxy, env)
│   └── Dockerfile          # Frontend container build
├── docker-compose.yml      # Dev containers for backend + frontend
├── .env.example            # Template for required environment variables
└── README.md               # ← You are here
```

---

## 🚀 Quickstart

### 0. Prepare your environment file

A template of the variables the app needs lives in `.env.example`.
Copy it to two files before running:

```bash
cp .env.example .env.local    # for local development
cp .env.example .env.docker   # if you want Docker to load vars (optional)
```

Then edit **either** `.env.local` (for `uvicorn`) or rely on the `environment:` block in `docker-compose.yml` (for Docker) and fill in the real credentials you received.

### A) Dockerized (recommended)

```bash
# Clone and enter
git clone https://github.com/your-username/multi-user-blog-platform.git
cd multi-user-blog-platform

# Build & start services
docker compose up --build
```

* **Backend Swagger**  →  [http://localhost:8000/docs](http://localhost:8000/docs)
* **Frontend UI**     →  [http://localhost:5173/](http://localhost:5173/)

All code changes in `backend/app` and `frontend/src` will hot-reload inside their containers.

### B) Local (without Docker)

1. **Back end**

   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate       # Windows: .venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt

   # Run with hot-reload
   uvicorn app.main:app --reload --port 8000
   ```

   Open API docs → [http://localhost:8000/docs](http://localhost:8000/docs)

2. **Front end**

   ```bash
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0
   ```

   Open UI → [http://localhost:5173/](http://localhost:5173/)

---

## 📝 Environment Variables

The following variables **must** be set before running (see `.env.example`):

```dotenv
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

* **Local dev**: use `.env.local`
* **Docker**: either mount `.env.docker` or rely on the `environment:` section in `docker-compose.yml`
* **CI/CD**: configure these as repository or pipeline secrets (no `.env` file required)

---

## 📝 API Reference

### Authentication

#### Register

**POST** `/users/`
Body (JSON):

```json
{ "email": "alice@example.com", "password": "password" }
```

**Response** (201):

```json
{ "id": 1, "email": "alice@example.com" }
```

#### Login

**POST** `/token`
Body (form-encoded):

```
username=alice@example.com
password=password
```

**Response** (200):

```json
{ "access_token": "<JWT>", "token_type": "bearer" }
```

### Blog Posts

* **GET** `/posts/`             — List all posts (public)
* **GET** `/posts/{id}`         — Get a single post (public)
* **POST** `/posts/`            — Create post (protected)
* **PUT** `/posts/{id}`         — Update post (protected, owner only)
* **DELETE** `/posts/{id}`      — Delete post (protected, owner only)

All protected endpoints require the header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔧 Testing

**Back end**

```bash
cd backend
pytest -q
```

**Front end**

```bash
cd frontend
npm run test          # run all Vitest tests once
npm run test:watch    # watch mode
```

---

## 🐳 Docker Configuration

* `backend/Dockerfile` and `frontend/Dockerfile` are already set up.
* `docker-compose.yml` ties them together, including shared networks, live-reload mounts, and the Postgres service.

No manual steps beyond `docker compose up --build` are needed!

---

## 📝 Design & Tech Decisions

* **FastAPI + Uvicorn**: high‑performance async Python API
* **SQLAlchemy**: ORM for data modeling
* **PostgreSQL + RLS**: production-quality DB with row-level security
* **JWT (HS256)**: stateless auth
* **Pydantic**: request/response validation & auto docs
* **React + Vite + TypeScript**: fast front‑end dev loop
* **React Query**: server-state caching & background updates
* **React Hook Form + Zod**: form management + validation
* **Tailwind CSS**: utility-first styling
* **Zustand**: lightweight global store for auth state
* **Docker Compose**: unified dev environment (hot-reload, isolated ports)

---

## ✅ Verified

* Clone → Docker ✅
* Clone → Local (Python 3.11, Node 20+) ✅
* All tests passing ✅
* API docs and UI flows validated ✅
* Cross-platform (macOS, Linux, Windows) ✅
