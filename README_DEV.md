# Hydro_AI — Local Development & Deployment

This file explains how to run the project locally (backend + frontend) and seed demo data.

Prerequisites

- Docker & Docker Compose (recommended)
- Or Python 3.11+ and Node 18+ for local non-container runs

Quickstart (Docker Compose)
1. Copy `.env.example` to `.env` and set any secrets (optional).
2. Build and start services:

```powershell
docker-compose up --build
```

- Frontend will be available at `http://localhost:5173`
- Backend API will be available at `http://localhost:8000`

Seeding demo data
To generate synthetic 180-day CSVs for three crops and strategies:

```powershell
python scripts/seed_demo_data.py
```

This will write CSVs to `backend/data/uploads/seed_*.csv` which the backend will use for metrics and previews.

Running backend locally (without Docker)
1. Create and activate a virtualenv
2. Install dependencies:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

3. Start backend:

```powershell
uvicorn app.main:app --reload --port 8000
```

Running frontend locally (Frontend-first / Backend optional)
1. From the `frontend` folder install deps and run the dev server. The frontend now runs as a standalone static/demo app with client-side CSV parsing and mock auth.

```powershell
cd frontend
npm install
npx vite
```

Notes:
- The frontend no longer requires the backend to view the landing, hero and dashboard (client-side parsing + demo data). Sign-in is a client-side mock that stores a demo token in `localStorage`.
- To use your existing CSV files directly in the dashboard (no upload required), copy them into the frontend public data folder so the dev server will serve them statically:

```powershell
# create folders (PowerShell)
cd frontend
mkdir -Force public\data\csvs\EXP1
mkdir -Force public\data\csvs\EXP2
mkdir -Force public\data\csvs\EXP3
```

Place your CSVs (for example `Harvest_EXP1.csv`, `Nutrients_Water_EXP1.csv`, `Seedlings_Measurement_EXP1.csv`, `Water_Quality_EXP1.csv`) under the matching `public\data\csvs\EXP#` folder. Then open the Dashboard and select the dataset from the dropdown to load it client-side.

- To improve the site's hero image, place your image file in `frontend/public/images/` (for example `site-hero.jpg`) and reference it from `frontend/index.html` or the `Hero` component. The app will serve that image automatically during development and in production builds.

- If you want me to automatically copy your existing CSV files from the repository root into `frontend/public/data/csvs/`, tell me and I will move them for you.

Environment variables

- `DATABASE_URL` - database connection string (optional for Docker; otherwise SQLite used)
- `JWT_SECRET` - set to a secure value in production
- `VITE_API_URL` - frontend build-time API base URL (defaults to `http://localhost:8000`)

Testing

- Backend tests (pytest): `pytest -q backend`

Notes & Tradeoffs

- Backend uses SQLite by default in local dev; `docker-compose.yml` includes a Postgres service for production parity.
- Auth is implemented with JWT and bcrypt. Password reset is a mock flow (no email server configured).
- Dataset parsing and metrics are intentionally simple for a minimal prototype; further validation, pagination, and aggregation can be added.

Next steps you might want me to do:

- Add frontend CSV upload mapping UI
- Implement refresh token flow and password reset email
- Add CI pipeline (GitHub Actions) to run tests and linters
