# Copilot Instructions for SIGCAL Cayambe

## Project Overview
SIGCAL Cayambe is a modular cadastral management system with two main domains:
- **Core System**: Located in `backend/` and `frontend/`, handles cadastral, citizen, and valuation data.
- **Planification Module**: Located in `backend-planificacion/` and `frontend-planificacion/`, manages urban planning, IRM, and project data.

## Architecture & Data Flow
- **Backend**: Node.js/Express REST APIs. Each module has its own backend (`backend/`, `backend-planificacion/`).
  - Data models in `db/models/`.
  - Routes in `routes/` map to controllers in `controllers/`.
  - Configurations in `db/config.js`.
- **Frontend**: Vue 3 + Vite. Each module has its own frontend (`frontend/`, `frontend-planificacion/`).
  - Main entry: `main.js`, root component: `App.vue`.
  - Vuex store in `store/`, routing in `router/`.
  - Uses `<script setup>` SFCs.
- **Inter-module Communication**: Frontends communicate with their respective backends via REST. Some endpoints (e.g., IRM, certificates) are exposed for cross-module use.
- **GeoServer Integration**: Map data is served via GeoServer, configured in `.env.local` as `VITE_GEOSERVER_URL`.

## Developer Workflows
- **Install dependencies**: `npm install` in each module directory.
- **Run development server**: `npm run dev` (frontend), `node index.js` or `npm start` (backend).
- **Build frontend**: `npm run build`.
- **Environment config**: Set variables in `.env.local` (see example in `frontend-planificacion/README.md`).
- **Docker**: Use `docker-compose.yml` for multi-service orchestration. See `Dockerfile-backend` and `Dockerfile-frontend` for builds.

## Project-Specific Patterns
- **Routes/Controllers**: Each feature has a dedicated route/controller pair (e.g., `catastroBloquesRoutes.js` ↔ `catastroBloques.js`).
- **Data Models**: All DB models are in `db/models/`, named after their domain (e.g., `avaluos.js`, `catalogo.js`).
- **Frontend Structure**: Components in `components/`, composables in `composables/`, views in `views/` (planificacion only).
- **Vuex Store**: State management is centralized in `store/`.
- **API URLs**: Always use environment variables for API endpoints.

## Integration Points
- **GeoServer**: Map layers and spatial queries.
- **Nginx**: Reverse proxy config in `nginx.conf`.
- **Docker Compose**: Orchestrates frontend, backend, GeoServer, and Nginx.

## Examples
- To add a new cadastral feature:
  1. Create model in `db/models/`
  2. Add controller in `controllers/`
  3. Register route in `routes/`
  4. Expose API endpoint and update frontend service/composable
- To add a new frontend view (planificacion):
  1. Create component in `components/` or view in `views/`
  2. Register route in `router/index.js`
  3. Connect to backend via service in `services/`

## Conventions
- Use Spanish for domain logic, English for technical code.
- Keep module boundaries clear: do not mix planificacion and core system logic/files.
- Always document new endpoints and environment variables in the relevant README.

---
For questions or unclear patterns, check the module README files or ask for clarification.