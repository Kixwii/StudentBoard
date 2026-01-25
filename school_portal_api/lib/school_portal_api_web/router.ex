defmodule SchoolPortalApiWeb.Router do
  use SchoolPortalApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug SchoolPortalApiWeb.Auth.Pipeline  # JWT authentication
  end

  scope "/api", SchoolPortalApiWeb do
    pipe_through :api

    # Authentication
    post "/auth/login", AuthController, :login
    post "/auth/register", AuthController, :register
    
    # Protected routes
    scope "/" do
      pipe_through :authenticate_user
      
      # Students
      get "/students/:id/grades", StudentController, :grades
      get "/students/:id/schedule", StudentController, :schedule
      post "/students/:id/assignments/:assignment_id/submit", StudentController, :submit_assignment
      
      # Guardians
      get "/guardians/:id/students/:student_id/performance", GuardianController, :student_performance
      post "/guardians/:id/payments", GuardianController, :make_payment
      
      # Teachers
      post "/teachers/:id/assignments", TeacherController, :create_assignment
      put "/teachers/:id/submissions/:submission_id/grade", TeacherController, :grade_submission
      
      # Fees
      get "/fees/accounts/:account_id", FeeController, :show
      get "/fees/accounts/:account_id/transactions", FeeController, :transactions
    end
  end
end