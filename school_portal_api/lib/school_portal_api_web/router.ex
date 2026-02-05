defmodule SchoolPortalApiWeb.Router do
  use SchoolPortalApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug, origin: ["http://localhost:5173", "http://localhost:3000"]
  end

  pipeline :auth do
    plug Guardian.Plug.Pipeline,
      module: SchoolPortalApi.Guardian,
      error_handler: SchoolPortalApiWeb.AuthErrorHandler

    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  scope "/api", SchoolPortalApiWeb do
    pipe_through :api

    # Public routes - TEMPORARILY ALL PUBLIC
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login
    get "/health", HealthController, :index
    
    # Temporarily public for testing
    get "/students/:id/grades", StudentController, :grades
    get "/students/:id/schedule", StudentController, :schedule
    get "/students/:student_id/documents", DocumentController, :index
    
    get "/guardians/:id/students", GuardianController, :students
    get "/guardians/:id/students/:student_id/performance", GuardianController, :student_performance
    
    get "/fees/accounts/:account_id", FeeController, :show
    get "/fees/accounts/:account_id/transactions", FeeController, :transactions
  end

  # Protected routes (empty for now)
  # scope "/api", SchoolPortalApiWeb do
  #   pipe_through [:api, :auth]
  #   # Will add protected routes here later
  # end
end