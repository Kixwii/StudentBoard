# Project Restructure Log

## Overview
Full-stack renaming and restructuring following dev-friendly, cross-team conventions.
Date: 2026-04-14
Scope: Frontend (React) + Backend (Elixir/Phoenix)

---

## Frontend (student-board)

### Folder Structure Changes

#### Created
- `src/core/` - Core infrastructure (API, config, styles)
- `src/core/api/` - API client
- `src/core/config/` - Constants and configuration
- `src/core/styles/` - Global styles
- `src/auth/` - Authentication feature
- `src/auth/components/` - Auth UI components
- `src/auth/hooks/` - Auth hooks
- `src/dashboard/` - Dashboard feature
- `src/dashboard/parent/` - Parent dashboard
- `src/dashboard/parent/components/` - Parent dashboard UI
- `src/dashboard/teacher/` - Teacher dashboard
- `src/dashboard/teacher/components/` - Teacher dashboard UI
- `src/dashboard/shared/` - Shared dashboard components
- `src/services/` - API service modules (reorganized)
- `src/shared/` - Shared components, hooks, utilities
- `src/shared/components/` - Reusable UI components
- `src/shared/hooks/` - Shared hooks
- `src/shared/utils/` - Utility functions

### File Renames

| Old Path | New Path | Change Type |
|----------|----------|-------------|
| `src/App.test.jsx` | `src/core/App.test.jsx` | Moved |
| `src/Login.jsx` | `src/auth/components/Login.jsx` | Moved |
| `src/Login.test.jsx` | `src/auth/components/Login.test.jsx` | Moved |
| `src/ParentDashboard.jsx` | `src/dashboard/parent/components/ParentDashboard.jsx` | Moved |
| `src/ParentDashboard.test.jsx` | `src/dashboard/parent/components/ParentDashboard.test.jsx` | Moved |
| `src/TeacherDashboard.jsx` | `src/dashboard/teacher/components/TeacherDashboard.jsx` | Moved |
| `src/TeacherDashboard.test.jsx` | `src/dashboard/teacher/components/TeacherDashboard.test.jsx` | Moved |
| `src/index.css` | `src/core/styles/global.css` | Moved + Renamed |
| `src/components/ProfilePhotoModal.jsx` | `src/shared/components/ProfilePhotoModal.jsx` | Moved |
| `src/components/ProfilePhotoModal.test.jsx` | `src/shared/components/ProfilePhotoModal.test.jsx` | Moved |
| `src/hooks/useProfilePhoto.js` | `src/shared/hooks/useProfilePhoto.js` | Moved |
| `src/hooks/useProfilePhoto.test.js` | `src/shared/hooks/useProfilePhoto.test.js` | Moved |
| `src/services/api.js` | `src/core/api/client.js` | Moved + Renamed |
| `src/services/documentService.js` | `src/services/document-service.js` | Renamed |
| `src/services/documentService.test.js` | `src/services/document-service.test.js` | Renamed |
| `src/services/feeService.js` | `src/services/fee-service.js` | Renamed |
| `src/services/feeService.test.js` | `src/services/fee-service.test.js` | Renamed |
| `src/services/guardianService.js` | `src/services/guardian-service.js` | Renamed |
| `src/services/guardianService.test.js` | `src/services/guardian-service.test.js` | Renamed |
| `src/services/mockDataService.js` | `src/services/mock-data-service.js` | Renamed |
| `src/services/studentService.js` | `src/services/student-service.js` | Renamed |
| `src/setupTests.js` | `src/setup-tests.js` | Renamed |

### Deleted (Empty After Move)
- `src/components/` (after ProfilePhotoModal moved)
- `src/hooks/` (after useProfilePhoto moved)

---

## Backend (school_portal_api)

### Folder Structure Changes

#### Created
- `lib/school_portal_api/core/` - Core infrastructure
- `lib/school_portal_api/auth/` - Authentication context
- `lib/school_portal_api/academics/` - Academic documents context
- `lib/school_portal_api_web/core/` - Core web infrastructure
- `lib/school_portal_api_web/auth/` - Auth web layer
- `lib/school_portal_api_web/api/` - API controllers
- `lib/school_portal_api_web/health/` - Health check

#### Removed
- `lib/school_portal_api/accounts/` (merged into auth/)
- `lib/school_portal_api/documents/` (moved to academics/)
- `lib/school_portal_api_web/controllers/` (split into api/, auth/, health/)

### File Renames

| Old Path | New Path | Change Type |
|----------|----------|-------------|
| `lib/school_portal_api/accounts.ex` | `lib/school_portal_api/auth/accounts.ex` | Moved |
| `lib/school_portal_api/accounts/guardian.ex` | `lib/school_portal_api/auth/guardian.ex` | Moved |
| `lib/school_portal_api/accounts/student.ex` | `lib/school_portal_api/auth/student.ex` | Moved |
| `lib/school_portal_api/accounts/user.ex` | `lib/school_portal_api/auth/user.ex` | Moved |
| `lib/school_portal_api/documents.ex` | `lib/school_portal_api/academics/documents.ex` | Moved |
| `lib/school_portal_api/documents/document.ex` | `lib/school_portal_api/academics/document.ex` | Moved |
| `lib/school_portal_api/students.ex` | `lib/school_portal_api/students/students.ex` | Moved |
| `lib/school_portal_api/fees.ex` | `lib/school_portal_api/fees/fees.ex` | Moved |
| `lib/school_portal_api/guardian.ex` | `lib/school_portal_api/students/guardian.ex` | Moved |
| `lib/school_portal_api/mailer.ex` | `lib/school_portal_api/core/mailer.ex` | Moved |
| `lib/school_portal_api/release.ex` | `lib/school_portal_api/core/release.ex` | Moved |
| `lib/school_portal_api/repo.ex` | `lib/school_portal_api/core/repo.ex` | Moved |
| `lib/school_portal_api/application.ex` | `lib/school_portal_api/core/application.ex` | Moved |
| `lib/school_portal_api_web/auth_error_handler.ex` | `lib/school_portal_api_web/auth/auth_error_handler.ex` | Moved |
| `lib/school_portal_api_web/endpoint.ex` | `lib/school_portal_api_web/core/endpoint.ex` | Moved |
| `lib/school_portal_api_web/router.ex` | `lib/school_portal_api_web/core/router.ex` | Moved |
| `lib/school_portal_api_web/telemetry.ex` | `lib/school_portal_api_web/core/telemetry.ex` | Moved |
| `lib/school_portal_api_web/gettext.ex` | `lib/school_portal_api_web/core/gettext.ex` | Moved |
| `lib/school_portal_api_web/error_json.ex` | `lib/school_portal_api_web/core/error_json.ex` | Moved |
| `lib/school_portal_api_web/controllers/auth_controller.ex` | `lib/school_portal_api_web/auth/auth_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/cors_controller.ex` | `lib/school_portal_api_web/auth/cors_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/guardian_controller.ex` | `lib/school_portal_api_web/api/guardian_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/student_controller.ex` | `lib/school_portal_api_web/api/student_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/fee_controller.ex` | `lib/school_portal_api_web/api/fee_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/document_controller.ex` | `lib/school_portal_api_web/api/document_controller.ex` | Moved |
| `lib/school_portal_api_web/controllers/health_controller.ex` | `lib/school_portal_api_web/health/health_controller.ex` | Moved |

### Module Name Changes

| Old Module | New Module |
|------------|------------|
| `SchoolPortalApi.Accounts` | `SchoolPortalApi.Auth.Accounts` |
| `SchoolPortalApi.Documents` | `SchoolPortalApi.Academics.Documents` |
| `SchoolPortalApiWeb.GuardianController` | `SchoolPortalApiWeb.API.GuardianController` |
| `SchoolPortalApiWeb.StudentController` | `SchoolPortalApiWeb.API.StudentController` |
| `SchoolPortalApiWeb.FeeController` | `SchoolPortalApiWeb.API.FeeController` |
| `SchoolPortalApiWeb.DocumentController` | `SchoolPortalApiWeb.API.DocumentController` |
| `SchoolPortalApiWeb.AuthController` | `SchoolPortalApiWeb.Auth.AuthController` |
| `SchoolPortalApiWeb.AuthErrorHandler` | `SchoolPortalApiWeb.Auth.AuthErrorHandler` |
| `SchoolPortalApiWeb.HealthController` | `SchoolPortalApiWeb.Health.HealthController` |

---

## Import/Alias Updates Required

### Frontend (JavaScript/JSX)

All files need import path updates:
- `../services/api` → `../../core/api/client`
- `../services/guardianService` → `../../services/guardian-service`
- `../components/ProfilePhotoModal` → `../../shared/components/ProfilePhotoModal`
- `../hooks/useProfilePhoto` → `../../shared/hooks/useProfilePhoto`

### Backend (Elixir)

All files need alias updates:
- `alias SchoolPortalApi.Accounts` → `alias SchoolPortalApi.Auth.Accounts`
- `alias SchoolPortalApi.Documents` → `alias SchoolPortalApi.Academics.Documents`
- `alias SchoolPortalApiWeb.GuardianController` → `alias SchoolPortalApiWeb.API.GuardianController`
- Router module references need updating

---

## Verification Status

- [x] All files moved according to log
- [x] All imports updated in frontend
- [x] All aliases updated in backend
- [x] Barrel exports created
- [x] README.md files created
- [x] Frontend build passes (`npm run build` ✓)
- [x] Backend compile passes (`mix compile` ✓, zero warnings)
- [x] Frontend lint passes (`npm run lint` ✓, zero errors)
- [x] Test mock paths updated to new file locations

