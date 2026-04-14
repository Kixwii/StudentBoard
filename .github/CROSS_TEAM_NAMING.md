# Cross-Team Naming Conventions

This document defines the naming standards for the entire Kixwii EduPortal codebase.

---

## 1. Folder Naming

- Use `kebab-case` for all folders: `auth`, `fee-service`, `mock-data-service`
- Group by **feature/domain**, not by file type
  - ✅ `src/auth/`, `src/dashboard/`, `src/shared/`
  - ❌ `src/components/`, `src/utils/` (at root level)
- Depth limit: **≤ 4 levels**

---

## 2. Frontend (React/JavaScript) — `student-board/`

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase.jsx` | `ParentDashboard.jsx` |
| Hooks | `camelCase.js` starting with `use` | `useProfilePhoto.js` |
| Service modules | `kebab-case.js` | `guardian-service.js` |
| Style files | `kebab-case.css` | `global.css` |
| Test files | match source + `.test.jsx/.js` | `Login.test.jsx` |
| Barrel exports | `index.js` only | `src/services/index.js` |
| Constants | `UPPER_SNAKE_CASE.js` | `API_ENDPOINTS.js` |

### Module Structure

```
src/
  core/          # Infrastructure: API client, config, global styles
  auth/          # Authentication feature
  dashboard/     # Dashboard views by role (parent/, teacher/)
  shared/        # Reusable components, hooks, utilities used across 2+ features
  services/      # Domain-specific API service modules
```

### Import Rules
- Always import from barrel `index.js` when available
- Use relative imports — no path aliases unless configured in `vite.config.js`
- Never import directly from `node_modules` paths

---

## 3. Backend (Elixir/Phoenix) — `school_portal_api/`

Elixir enforces snake_case for files, PascalCase for modules. Follow these **in addition to** Elixir conventions:

| Type | Convention | Example |
|------|-----------|---------|
| Schema files | `snake_case.ex` | `guardian_account.ex` |
| Context modules | `snake_case.ex` | `accounts.ex` |
| Controller files | `snake_case_controller.ex` | `guardian_controller.ex` |
| Test files | match source + `_test.exs` | `guardian_controller_test.exs` |
| Migration files | timestamp + `_description.exs` (auto via `mix ecto.gen.migration`) | |

### Module Structure

```
lib/
  school_portal_api/
    core/       # Infrastructure: Repo, Mailer, Application, Release
    auth/       # Auth context: Accounts, User, GuardianAccount schemas
    students/   # Students context + schemas
    fees/       # Fees context + schemas
    academics/  # Academic documents context + schemas
  school_portal_api_web/
    core/       # Endpoint, Router, Telemetry, ErrorJSON, Gettext
    auth/       # Auth controllers, error handler
    api/        # Domain API controllers
    health/     # Health check controller
    plugs/      # Shared plugs
```

### Module Naming
- Domain context module: `SchoolPortalApi.<Domain>.<ContextName>` — e.g., `SchoolPortalApi.Auth.Accounts`
- Schema module: `SchoolPortalApi.<Domain>.<EntityName>` — e.g., `SchoolPortalApi.Students.Student`
- Controller module: `SchoolPortalApiWeb.<Layer>.<EntityName>Controller` — e.g., `SchoolPortalApiWeb.API.GuardianController`

### Router Conventions
Use `scope` blocks with domain aliases to avoid long module references:
```elixir
scope "/api", SchoolPortalApiWeb.API do
  pipe_through [:api, :auth]
  get "/guardians/:id/students", GuardianController, :students
end
```

---

## 4. Cross-Cutting Rules

- **No generic names**: avoid `misc`, `tmp`, `stuff`, `helpers` as folder/file names
- **No abbreviations**: use `guardian-service` not `grd-svc`
- **Shared prefix**: utilities shared across team repos should be prefixed with `shared_` or `core_`
- **README.md required** in every root-level source folder (`src/auth/README.md`, `lib/school_portal_api/core/`, etc.)
- **Barrel exports**: always create `index.js` (frontend) as a barrel for each feature module

---

## 5. Git Conventions

- Branch names: `kebab-case` — `feature/guardian-dashboard`, `fix/cors-error`
- Commit messages: imperative present tense — `Add fee service`, `Fix auth error handler`

---

## 6. File Extension Rules

- Do not change extensions without reason
- `.jsx` for React components with JSX syntax
- `.js` for plain JavaScript (services, hooks, utilities)
- `.ex` for Elixir modules
- `.exs` for Elixir scripts (config, migrations, seeds, tests)
- TypeScript migration (`.ts`/`.tsx`) only as a team-wide coordinated effort

---

## Rename Log

All historical renames are documented in `/rename_log.md` at project root.
