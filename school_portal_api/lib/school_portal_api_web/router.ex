defmodule SchoolPortalApiWeb.Router do
  use SchoolPortalApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug Guardian.Plug.Pipeline,
      module: SchoolPortalApi.Guardian,
      error_handler: SchoolPortalApiWeb.AuthErrorHandler

    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  # Public routes — no authentication required
  scope "/api", SchoolPortalApiWeb do
    pipe_through :api

    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login
    get "/health", HealthController, :index
  end

  # Protected routes — valid JWT required
  scope "/api", SchoolPortalApiWeb do
    pipe_through [:api, :auth]

    get "/students/:id/grades", StudentController, :grades
    get "/students/:id/schedule", StudentController, :schedule
    post "/students/:id/assignments/:assignment_id", StudentController, :submit_assignment
    get "/students/:student_id/documents", DocumentController, :index

    get "/guardians/:id/students", GuardianController, :students

    get "/guardians/:id/students/:student_id/performance",
        GuardianController,
        :student_performance

    post "/guardians/:id/payments", GuardianController, :make_payment

    get "/fees/accounts/:account_id", FeeController, :show
    get "/fees/accounts/:account_id/transactions", FeeController, :transactions
  end
end
