defmodule SchoolPortalApiWeb.Router do
  use SchoolPortalApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", SchoolPortalApiWeb do
    pipe_through :api

    # Health check
    get "/health", HealthController, :index
    
    # Students
    get "/students/:id/grades", StudentController, :grades
    get "/students/:id/schedule", StudentController, :schedule
  end
end