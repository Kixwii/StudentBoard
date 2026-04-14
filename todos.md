# Pending Tasks

## Backend (`school_portal_api/`)

### Cleanup
- [ ] Delete `lib/school_portal_api/accounts/student.ex` — deprecated module with wrong namespace (`SchoolPortal.Accounts.Student`), fully replaced by `Students.Student`

### Missing DB Tables + Real Implementations
- [ ] Create `student_schedules` migration and Ecto schema
- [ ] Implement real `StudentController.schedule/2` — currently returns hardcoded timetable
- [ ] Create `assignment_submissions` migration and Ecto schema
- [ ] Implement real `StudentController.submit_assignment/2` — currently returns mock response with no DB write

### New Features
- [ ] Teacher context (`lib/school_portal_api/teachers/`) — schema, migration, context module
- [ ] `TeacherController` with `assignments/2` action
- [ ] Wire `GET /api/teachers/:id/assignments` route in router
- [ ] Transfer management — referenced in frontend but no backend endpoint exists

### Docker
- [ ] Confirm `docker-compose.yml` (`.yml` extension) is the canonical dev file — old versions of docker-compose do not recognise `.yaml`
- [ ] Verify `docker-compose up` builds and starts cleanly end-to-end

### Testing
- [ ] Backend has zero test coverage — write controller tests for auth, guardian, student, fee, and document endpoints
- [ ] Add factory/fixture helpers for seeding test data

## Frontend (`student-board/`)

- [ ] No test framework configured — add Vitest + React Testing Library
- [ ] Update README to reflect current API endpoint statuses
- [ ] Transfer management UI — referenced in components but backend does not support it yet
