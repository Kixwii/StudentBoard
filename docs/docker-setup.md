# Docker Setup Guide

## ⚠️ Important: Run From Project Root

**Always run docker-compose commands from the project root folder** (`/projects/Kixwii Eduportal`), NOT from inside `school_portal_api/` or `student-board/`.

```bash
# ✅ CORRECT - From project root
cd "/projects/Kixwii Eduportal"
docker-compose up --build

# ❌ WRONG - From inside backend folder
cd school_portal_api
docker-compose up --build  # Error: no configuration file provided
```

**Also:** The `entrypoint.sh` script is designed to run **inside the Docker container**, not directly on your host machine. It references `/app/bin/school_portal_api` which only exists inside the container.

---

## Overview

This project uses Docker for both development and production environments. The setup includes:

- **PostgreSQL** database container
- **Backend API** (Phoenix/Elixir) container
- **Frontend** (React/Vite) container served via nginx

---

## Project Structure Compatibility

The Docker configuration has been updated to work with the restructured project layout:

```
/projects/Kixwii Eduportal/
├── docker-compose.yml              # Development orchestration
├── docker-compose.prod.yml         # Production orchestration
├── school_portal_api/              # Backend (Elixir/Phoenix)
│   ├── Dockerfile                  # Production multi-stage build
│   ├── Dockerfile.dev              # Development build
│   ├── entrypoint.sh               # Container entrypoint with migrations
│   └── lib/
│       └── school_portal_api/
│           ├── core/               # Core infrastructure (Repo, Application, Release)
│           ├── auth/               # Authentication context
│           ├── academics/          # Academic documents
│           ├── students/           # Student management
│           └── fees/               # Fee management
└── student-board/                  # Frontend (React/Vite)
    ├── Dockerfile                  # Multi-stage Node + nginx build
    └── nginx.conf                  # SPA routing configuration
```

### Key Structural Changes

After the project restructure, the following Docker-relevant changes were made:

1. **Backend Module Names Updated:**
   - `SchoolPortalApi.Repo` → `SchoolPortalApi.Core.Repo`
   - `SchoolPortalApi.Release` → `SchoolPortalApi.Core.Release`
   - `SchoolPortalApi.Application` → `SchoolPortalApi.Core.Application`

2. **Controller Locations Changed:**
   - `lib/school_portal_api_web/controllers/` → split into:
     - `lib/school_portal_api_web/api/` (API controllers)
     - `lib/school_portal_api_web/auth/` (Auth controllers)
     - `lib/school_portal_api_web/health/` (Health checks)

3. **Entrypoint Updated:** The `entrypoint.sh` now calls `SchoolPortalApi.Core.Release.migrate()`

---

## Development Setup

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Environment Variables

Create a `.env` file in `school_portal_api/`:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_DB=school_portal_api_dev
POOL_SIZE=10
GUARDIAN_SECRET_KEY=your_secret_key_here
SECRET_KEY_BASE=your_secret_key_base_here_at_least_64_chars
```

### Start Development Environment

```bash
# Navigate to project root FIRST
cd "/projects/Kixwii Eduportal"

# Start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

This starts:
- **Database**: PostgreSQL on port 5432
- **API**: Phoenix dev server on port 4000 (with hot reload)
- **Frontend**: nginx on port 3000

The dev setup uses volume mounts for hot reloading:
- Backend code mounted at `/app`
- Dependencies cached in named volumes (`api_deps`, `api_build`)

### Development URLs

- Frontend: http://localhost:3000
- API: http://localhost:4000/api
- API Health: http://localhost:4000/api/health

---

## Production Setup

### Environment Variables

Create a `.env` file with production values:

```bash
# Database
POSTGRES_USER=your_prod_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=school_portal_prod
DATABASE_URL=ecto://user:pass@db/school_portal_prod

# Security
SECRET_KEY_BASE=your_64_character_secret_key_base
GUARDIAN_SECRET_KEY=your_guardian_secret

# Host/Port
PHX_HOST=your-domain.com
PORT=4000
POOL_SIZE=20
```

### Start Production Environment

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Production Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   nginx     │────▶│  Frontend   │     │             │
│  (port 80)  │     │  (static)   │     │             │
└─────────────┘     └─────────────┘     │             │
                                        │  PostgreSQL │
┌─────────────┐     ┌─────────────┐     │   (db)      │
│   API       │◀────│  Phoenix    │────▶│             │
│  (/api)     │     │  (port 4000)│     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Docker Files Explained

### Backend - `Dockerfile` (Production)

Multi-stage build:
1. **Build stage**: Compiles Elixir app with Mix release
2. **Runtime stage**: Minimal Alpine image with release binary

Key features:
- Uses `hexpm/elixir:1.16.3-erlang-26.2.5.2-alpine` base image
- Creates optimized production release
- Includes `postgresql-client` for `pg_isready` health checks
- Entrypoint runs migrations before starting server

### Backend - `Dockerfile.dev` (Development)

- Includes `inotify-tools` for hot code reloading
- Mounts source code as volume
- Runs `mix phx.server` directly (no release)

### Frontend - `Dockerfile`

Multi-stage build:
1. **Build stage**: Node.js builds the Vite app
2. **Runtime stage**: nginx serves static files

Features:
- `VITE_API_URL` build argument for API endpoint configuration
- nginx configured for SPA routing (all routes → index.html)
- Gzip compression enabled

### Frontend - `nginx.conf`

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://api:4000;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Troubleshooting

### Database Connection Issues

**Problem**: `password authentication failed for user`

**Solution**: Ensure environment variables match:
```bash
# Check .env file values match docker-compose.yml defaults
docker-compose config  # Validates and shows merged config
```

### Module Not Found Errors

**Problem**: `module SchoolPortalApi.Release is not available`

**Solution**: The module was moved to `SchoolPortalApi.Core.Release`. Ensure `entrypoint.sh` is updated.

### Frontend Can't Connect to API

**Problem**: CORS errors or connection refused

**Solution**: 
1. Check `VITE_API_URL` matches your setup
2. Ensure CORS is configured in `config/dev.exs`:
   ```elixir
   origin: ["http://localhost:3000"]
   ```

### Build Failures

**Backend**: Check module names match new structure:
```bash
cd school_portal_api
mix compile --force
```

**Frontend**: Check import paths match new structure:
```bash
cd student-board
npm run build
```

---

## Health Checks

All services include health checks:

- **Database**: `pg_isready -U ${POSTGRES_USER}`
- **API**: Built-in Phoenix health endpoint at `/api/health`
- **Frontend**: nginx responds on port 80

View service status:
```bash
docker-compose ps
docker-compose logs -f [service_name]
```

---

## Useful Commands

```bash
# Rebuild specific service
docker-compose build api
docker-compose up -d api

# View logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db

# Database shell
docker-compose exec db psql -U postgres -d school_portal_api_dev

# Backend shell (dev)
docker-compose exec api sh

# Restart with fresh database (WARNING: data loss)
docker-compose down -v
docker-compose up --build

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Post-Restructure Verification

After the project restructure, verify Docker works:

1. **Check file locations**:
   ```bash
   ls school_portal_api/lib/school_portal_api/core/release.ex
   ls school_portal_api/lib/school_portal_api/core/repo.ex
   ls school_portal_api/lib/school_portal_api/core/application.ex
   ```

2. **Verify module names in config**:
   - `config/dev.exs`: Uses `SchoolPortalApi.Core.Repo`
   - `config/test.exs`: Uses `SchoolPortalApi.Core.Repo`
   - `mix.exs`: Uses `SchoolPortalApi.Core.Application`

3. **Test the build**:
   ```bash
   cd school_portal_api && mix compile --force
   cd ../student-board && npm run build
   cd .. && docker-compose build
   ```

---

## Migration from Old Structure

If migrating from the pre-restructure codebase:

1. Update `entrypoint.sh`: Change `SchoolPortalApi.Release` → `SchoolPortalApi.Core.Release`
2. Verify `mix.exs` has correct application module
3. Ensure all config files reference `SchoolPortalApi.Core.Repo`
4. Rebuild all containers: `docker-compose down -v && docker-compose up --build`
