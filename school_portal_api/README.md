# SchoolPortalApi

Phoenix/Elixir REST API backend for the StudentBoard school management portal. Serves parent-facing endpoints for student data, fees, documents, and authentication.

- **API Base URL**: `http://localhost:4000/api`
- **Frontend**: React SPA at `http://localhost:5173` (`../student-board/`)

---

## Quick Start

```bash
# Ensure PostgreSQL is running
sudo service postgresql start

# Install deps, create DB, run migrations, seed
mix setup

# Start dev server
mix phx.server
# or with IEx console
iex -S mix phx.server
```

### Database

Credentials configured in `config/dev.exs`:

| Setting  | Value                  |
|----------|------------------------|
| Host     | localhost:5432         |
| User     | postgres               |
| Password | postgres               |
| Database | school_portal_dev      |

---

## API Endpoints

### Auth (Public)

| Method | Path                  | Status             | Notes                                   |
|--------|-----------------------|--------------------|-----------------------------------------|
| POST   | `/api/auth/register`  | ✅ Implemented     | Creates user + guardian record in DB    |
| POST   | `/api/auth/login`     | ✅ Implemented     | Returns JWT token + guardian_id         |
| GET    | `/api/health`         | ✅ Implemented     |                                         |

### Guardians

| Method | Path                                              | Status             | Notes                          |
|--------|---------------------------------------------------|--------------------|--------------------------------|
| GET    | `/api/guardians/:id/students`                     | 🟡 Mock data       | No students DB table yet       |
| GET    | `/api/guardians/:id/students/:student_id/performance` | 🟡 Mock data   | No students DB table yet       |
| POST   | `/api/guardians/:id/payments`                     | 🟡 Mock data       | No fees DB table yet           |

### Students

| Method | Path                                             | Status             | Notes                                           |
|--------|--------------------------------------------------|--------------------|-------------------------------------------------|
| GET    | `/api/students/:id/grades`                       | 🟡 Mock data       | Module namespace bug (see Known Issues)         |
| GET    | `/api/students/:id/schedule`                     | 🟡 Mock data       | Module namespace bug (see Known Issues)         |
| POST   | `/api/students/:id/assignments/:assignment_id`   | ❌ Not routed      | Action exists in controller, missing route      |

### Fees

| Method | Path                                        | Status       | Notes                  |
|--------|---------------------------------------------|--------------|------------------------|
| GET    | `/api/fees/accounts/:account_id`            | 🟡 Mock data | No fees DB table yet   |
| GET    | `/api/fees/accounts/:account_id/transactions` | 🟡 Mock data | No fees DB table yet   |

### Documents

| Method | Path                               | Status       | Notes                     |
|--------|------------------------------------|--------------|---------------------------|
| GET    | `/api/students/:student_id/documents` | 🟡 Mock data | No documents DB table yet |

### Teachers _(not started)_

| Method | Path                            | Status             | Notes             |
|--------|---------------------------------|--------------------|-------------------|
| GET    | `/api/teachers/:id/assignments` | ❌ Not implemented | No controller or route |

---

## Implementation Status

### ✅ Done

- **Authentication** — register, login, JWT via Guardian, bcrypt password hashing
- **Accounts context** (`lib/school_portal_api/accounts.ex`) — `create_user`, `authenticate_user`, `create_guardian`, `get_guardian_by_user_id`, `get_guardian_with_user`
- **DB migrations** — `users` and `guardians` tables
- **CORS** — headers applied globally via endpoint plug and OPTIONS preflight handler
- **Guardian JWT** — `subject_for_token` and `resource_from_claims` implemented
- **Auth error handler** — returns JSON 401 on authentication failure

### 🟡 Mock Data (routes exist, real DB needed)

All the following controllers return hardcoded data and need database implementations:

- `GuardianController` — `students/2`, `student_performance/2`, `make_payment/2`
- `StudentController` — `grades/2`, `schedule/2`
- `FeeController` — `show/2`, `transactions/2`
- `DocumentController` — `index/2`
- `SchoolPortal.Accounts.Student` — plain struct module, not an Ecto schema

### ❌ Not Yet Started

- **DB schemas and migrations** for: `students`, `fee_accounts`, `transactions`, `documents`, `teachers`, `assignments`, guardian-student join table
- **Teacher controller and routes** — `GET /api/teachers/:id/assignments`
- **Assignment submission route** — action exists in `StudentController` but no route wired up
- **Auth middleware on protected routes** — the `:auth` pipeline is defined but not applied to any route scope yet
- **Real payment processing** — `POST /api/guardians/:id/payments` always returns mock success

---

## Known Issues

| Location | Issue |
|---|---|
| `lib/school_portal_api/accounts/student.ex` | Module named `SchoolPortal.Accounts.Student` (missing `Api`) — wrong namespace, inconsistent with rest of app |
| `lib/school_portal_api_web/auth_error_handler.ex:3` | Unused `import Phoenix.Controller` (compile warning) |
| `lib/school_portal_api_web/router.ex` | `:auth` pipeline defined but never applied — all routes currently public |
| `lib/school_portal_api_web/controllers/student_controller.ex` | `submit_assignment/2` action has no corresponding route in router |

---

## Project Structure

```
lib/
├── school_portal_api/
│   ├── accounts/
│   │   ├── user.ex           # Ecto schema — users table
│   │   ├── guardian.ex       # Ecto schema — guardians table
│   │   └── student.ex        # Plain struct (not Ecto) — mock only
│   ├── accounts.ex           # Accounts context (auth + guardian queries)
│   ├── guardian.ex           # Guardian JWT callbacks
│   ├── application.ex
│   ├── mailer.ex
│   └── repo.ex
└── school_portal_api_web/
    ├── controllers/
    │   ├── auth_controller.ex        # ✅ register + login
    │   ├── guardian_controller.ex    # 🟡 mock students + performance + payments
    │   ├── student_controller.ex     # 🟡 mock grades + schedule
    │   ├── fee_controller.ex         # 🟡 mock account + transactions
    │   ├── document_controller.ex    # 🟡 mock document list
    │   ├── cors_controller.ex        # OPTIONS preflight handler
    │   ├── health_controller.ex      # GET /api/health
    │   └── error_json.ex
    ├── plugs/
    │   └── cors.ex                   # CORS header plug
    ├── auth_error_handler.ex         # Guardian 401 responses
    ├── endpoint.ex
    ├── router.ex
    └── telemetry.ex

priv/repo/migrations/
└── 20260205020729_create_users_and_guardians.exs   # users + guardians tables only
```

---

## Common Commands

```bash
mix setup                        # deps + DB create + migrate + seed
mix phx.server                   # start dev server (localhost:4000)
iex -S mix phx.server            # start with IEx console
mix test                         # run all tests
mix test --failed                # re-run failed tests only
mix ecto.gen.migration <name>    # generate a new migration
mix ecto.migrate                 # run pending migrations
mix ecto.rollback                # rollback last migration
mix ecto.reset                   # drop + create + migrate + seed
mix format                       # format code
mix precommit                    # compile + format + test (run before committing)
```
