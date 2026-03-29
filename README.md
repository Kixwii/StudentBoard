# StudentBoard - School Management Portal

A full-stack parent portal for accessing student academic information, fee management, and school documents. Built with Phoenix/Elixir backend and React frontend.

## The Architecture

```
├── school_portal_api/     # Phoenix/Elixir REST API backend
│   ├── lib/
│   │   ├── school_portal_api/          # Business logic contexts
│   │   │   ├── accounts/               # User & Guardian management
│   │   │   ├── students/               # Student, Subject, Assignment schemas
│   │   │   ├── fees/                   # Fee accounts & transactions
│   │   │   └── documents/              # Document management
│   │   └── school_portal_api_web/      # Web layer (controllers, router)
│   └── priv/repo/migrations/           # Database migrations
│
└── student-board/         # React 19 + Vite SPA frontend
    ├── src/
    │   ├── services/                   # API client & service modules
    │   ├── Login.jsx                   # Authentication UI
    │   └── ParentDashboard.jsx         # Main dashboard
    └── public/
```

## Quick Start

### Prerequisites
- **Elixir** 1.14+ and **Erlang** 25+
- **Node.js** 18+ and **npm** 9+
- **PostgreSQL** 14+

### Backend Setup

```bash
cd school_portal_api

# Install dependencies
mix deps.get

# Create database, run migrations, seed demo data
mix setup

# Start Phoenix server (http://localhost:4000)
mix phx.server
```

**Demo Credentials:**
- Email: `parent@demo.com`
- Password: `password123`

### Frontend Setup

```bash
cd student-board

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

## Key Features

### For Parents
- **Student Overview** - View multiple children's academic progress
- **Academic Performance** - GPA, attendance, subject grades, assignments
- **Fee Management** - Current balance, payment history, breakdowns
- **Documents** - Access transcripts, certificates, health records
- **Payments** - Submit fee payments via multiple methods
- **Persistent Login** - "Remember Me" functionality with localStorage

### Technical Features
- **JWT Authentication** - Secure token-based auth with Guardian library
- **IDOR Protection** - Authorization checks on all protected endpoints
- **CORS Support** - Proper preflight handling for cross-origin requests
- **Real-time Validation** - Ecto changesets with comprehensive validations
- **Responsive UI** - Mobile-first design with breakpoint handling

## Tech Stack

### Backend
- **Phoenix** 1.7.21 - Web framework
- **Ecto** 3.13 - Database wrapper and query DSL
- **PostgreSQL** - Primary database
- **Guardian** 2.4 - JWT authentication
- **Bcrypt** - Password hashing
- **CORSPlug** - CORS middleware

### Frontend
- **React** 19.1 - UI library
- **Vite** 4.5 - Build tool and dev server
- **Axios** 1.13 - HTTP client with interceptors
- **Lucide React** - Icon library

## API Overview

**Base URL:** `http://localhost:4000/api`

### Public Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate and receive JWT token

### Protected Endpoints (JWT Required)
- `GET /guardians/:id/students` - List guardian's students
- `GET /guardians/:id/students/:student_id/performance` - Academic data
- `POST /guardians/:id/payments` - Submit fee payment
- `GET /students/:id/grades` - Student grades
- `GET /students/:id/schedule` - Class schedule
- `GET /fees/accounts/:account_id` - Fee account details
- `GET /fees/accounts/:account_id/transactions` - Payment history
- `GET /students/:student_id/documents` - Student documents

See `school_portal_api/README.md` for detailed API documentation.

## Database Schema

**Core Tables:**
- `users` - Authentication (email, password_hash, role)
- `guardians` - Parent/guardian profiles
- `students` - Student records (name, grade, GPA, attendance)
- `guardian_students` - Many-to-many relationship
- `student_subjects` - Subject grades and teachers
- `student_assignments` - Assignment submissions and scores
- `fee_accounts` - Student billing accounts
- `fee_breakdowns` - Fee category breakdowns
- `payment_transactions` - Payment history
- `student_documents` - Document metadata

## Development

### Backend Commands
```bash
mix test                         # Run tests
mix test --failed                # Re-run failed tests
mix ecto.gen.migration <name>    # Generate migration
mix ecto.migrate                 # Run migrations
mix ecto.rollback                # Rollback last migration
mix precommit                    # Compile + format + test
```

### Frontend Commands
```bash
npm run dev                      # Start dev server
npm run build                    # Production build
npm run preview                  # Preview production build
npm run lint                     # Lint code
```

## Environment Variables

### Backend (`school_portal_api/config/`)
- Database credentials in `dev.exs` and `runtime.exs`
- Secret key base in `runtime.exs`

### Frontend (`student-board/.env`)
```bash
VITE_API_URL=http://localhost:4000/api
```

## Security

- **Password Hashing:** Bcrypt with salt
- **JWT Tokens:** Guardian library with configurable expiry
- **IDOR Protection:** Ownership checks on all student data access
- **CORS:** Configured for localhost development
- **Input Validation:** Ecto changesets with comprehensive rules

## Deployment

### Backend
- Docker support included (`Dockerfile`, `docker-compose.yaml`)
- Environment-based configuration via `runtime.exs`
- Database migrations run via `mix ecto.migrate`

### Frontend
- Static build output in `dist/`
- Deploy to Netlify, Vercel, or any static host
- Configure `VITE_API_URL` for production API

## Contributing

1. Create feature branch from `main`
2. Follow conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
3. Run `mix precommit` (backend) before committing
4. Ensure all tests pass
5. Submit PR with clear description

## 📄 License

MIT

---

WANTAM SIKU ZOMBO 👊🏿 👊🏿
