# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

StudentBoard is a full-stack school management portal connecting parents with their children's academic information. The project consists of two main applications:

- **Backend API** (`school_portal_api/`): Phoenix/Elixir REST API with Guardian JWT authentication
- **Frontend** (`student-board/`): React 19 + Vite SPA with Axios HTTP client

Both applications communicate via RESTful API endpoints at `http://localhost:4000/api` (development).

## Architecture

### Backend (Phoenix/Elixir)
- **Context**: `lib/school_portal_api/` - Business logic layer (currently minimal)
- **Web Layer**: `lib/school_portal_api_web/` - Controllers, routing, telemetry
- **Database**: PostgreSQL with Ecto ORM (migrations in `priv/repo/migrations/`)
- **Authentication**: Guardian library for JWT tokens, Bcrypt for password hashing
- **CORS**: Configured via `cors_plug` for cross-origin requests from frontend
- **HTTP Client**: Uses `:req` library (not httpoison, tesla, or httpc)

### Frontend (React + Vite)
- **Entry Point**: `src/main.jsx` → `src/App.jsx`
- **Main Components**: `Login.jsx`, `ParentDashboard.jsx`
- **API Layer**: Service modules in `src/services/` (api.js, guardianService.js, studentService.js)
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Axios with interceptors for auth tokens and 401 handling
- **Styling**: Custom CSS (App.css, ParentDashboard.css, index.css)

### API Routes Structure
Routes follow RESTful conventions under `/api` scope:
- Authentication: `/api/auth/login`, `/api/auth/register`
- Students: `/api/students/:id/grades`, `/api/students/:id/schedule`
- Guardians: `/api/guardians/:id/students/:student_id/performance`
- Fees: `/api/fees/accounts/:account_id`, `/api/fees/accounts/:account_id/transactions`
- Teachers: `/api/teachers/:id/assignments`

Protected routes use `:authenticate_user` pipeline (implementation in progress).

## Common Development Commands

### Backend (Phoenix)
```bash
# Navigate to backend
cd school_portal_api

# Initial setup (install deps, create DB, migrate, seed)
mix setup

# Start development server (localhost:4000)
mix phx.server

# Interactive development with IEx console
iex -S mix phx.server

# Run tests
mix test

# Run specific test file
mix test test/path/to/test_file.exs

# Re-run only failed tests
mix test --failed

# Database operations
mix ecto.create         # Create database
mix ecto.migrate        # Run migrations
mix ecto.rollback       # Rollback last migration
mix ecto.reset          # Drop, create, migrate, and seed
mix ecto.gen.migration migration_name_using_underscores

# Code quality (precommit checks)
mix precommit          # Compiles with warnings-as-errors, cleans unused deps, formats, tests

# Format code
mix format

# Check dependencies
mix deps.get
```

### Frontend (React + Vite)
```bash
# Navigate to frontend
cd student-board

# Install dependencies
npm install

# Start development server (localhost:3000 or localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Database Configuration

Development database credentials (in `school_portal_api/config/dev.exs`):
- **Username**: postgres
- **Password**: postgres
- **Host**: localhost
- **Database**: school_portal_api_dev
- **Port**: 5432 (default)

Ensure PostgreSQL is running before starting the backend server.

## Environment Variables

### Frontend
Create `.env` file in `student-board/`:
```
VITE_API_URL=http://localhost:4000/api
```

The frontend defaults to `http://localhost:4000/api` if not set.

## Project-Specific Guidelines

### Backend Development
- The backend already has comprehensive Elixir/Phoenix/Ecto guidelines in `school_portal_api/AGENTS.md` - refer to that file for all backend code changes
- **IMPORTANT**: Always read `school_portal_api/AGENTS.md` before making changes to backend code
- Use `mix precommit` before committing changes to ensure code quality
- Database schema not fully implemented - migrations directory is currently empty
- Authentication controllers (AuthController, GuardianController, TeacherController, FeeController) are referenced in router but not yet implemented

### Frontend Development
- API base URL configured via environment variable with sensible default
- Authentication token stored in localStorage as `auth_token`
- Axios interceptors handle token injection and 401 redirects automatically
- Frontend currently uses mock/fallback data when API calls fail
- ParentDashboard includes inline API service layer and service modules for clean separation
- Icons from lucide-react library

### Cross-Cutting Concerns
- Authentication flow: Frontend stores JWT from `/api/auth/login` in localStorage, includes in Authorization header as Bearer token
- CORS configured on backend to allow frontend origin
- Error handling: Backend returns JSON errors, frontend catches and displays or falls back to mock data
- The project is in early development - many API endpoints referenced in frontend/router are not yet implemented

## Testing Strategy

### Backend Tests
- Test files in `test/` directory mirror `lib/` structure
- Use `start_supervised!/1` to start processes in tests
- Avoid `Process.sleep/1` - use `Process.monitor/1` and assert on DOWN messages
- Database cleaned between tests automatically via Ecto sandbox

### Frontend Tests
No test framework configured yet. Consider adding Vitest or React Testing Library.

## Key Dependencies

### Backend
- phoenix ~> 1.8.3
- ecto_sql ~> 3.13
- postgrex (PostgreSQL adapter)
- guardian ~> 2.3 (JWT auth)
- bcrypt_elixir ~> 3.0
- cors_plug ~> 3.0
- req ~> 0.5 (HTTP client)
- swoosh ~> 1.16 (email)

### Frontend
- react ^19.1.1
- axios ^1.13.3
- vite ^4.5.3
- eslint ^9.33.0

## Development Workflow

1. Ensure PostgreSQL is running
2. Start backend: `cd school_portal_api && mix phx.server`
3. Start frontend in separate terminal: `cd student-board && npm run dev`
4. Access frontend at http://localhost:5173 (or port shown by Vite)
5. API requests proxy to http://localhost:4000/api

## Known Gaps
- Database migrations not created yet - schema needs to be defined
- Authentication controllers not implemented (AuthController, GuardianController, etc.)
- Guardian authentication plug (`:authenticate_user`) not implemented
- Frontend falls back to mock data when API unavailable
- No test coverage on frontend
- Transfer management and document features referenced in frontend README but not in code
