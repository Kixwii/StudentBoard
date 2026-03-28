defmodule SchoolPortalApiWeb.Router do
  use SchoolPortalApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :put_cors_headers
  end

  pipeline :auth do
    plug Guardian.Plug.Pipeline,
      module: SchoolPortalApi.Guardian,
      error_handler: SchoolPortalApiWeb.AuthErrorHandler

    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  # Handle all OPTIONS requests for CORS preflight
  options "/*path", SchoolPortalApiWeb.CORSController, :preflight

  scope "/api", SchoolPortalApiWeb do
    pipe_through :api

    # Public routes
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login
    get "/health", HealthController, :index
    
    # Temporarily public for testing
    get "/students/:id/grades", StudentController, :grades
    get "/students/:id/schedule", StudentController, :schedule
    get "/students/:student_id/documents", DocumentController, :index
    
    get "/guardians/:id/students", GuardianController, :students
    get "/guardians/:id/students/:student_id/performance", GuardianController, :student_performance
    post "/guardians/:id/payments", GuardianController, :make_payment
    
    get "/fees/accounts/:account_id", FeeController, :show
    get "/fees/accounts/:account_id/transactions", FeeController, :transactions
  end

  # Helper function to add CORS headers
  defp put_cors_headers(conn, _opts) do
    conn
    |> Plug.Conn.put_resp_header("access-control-allow-origin", "*")
    |> Plug.Conn.put_resp_header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
    |> Plug.Conn.put_resp_header("access-control-allow-headers", "content-type, authorization")
  end
end