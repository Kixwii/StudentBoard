defmodule SchoolPortalApiWeb.StudentController do
  use SchoolPortalApiWeb, :controller
  alias SchoolPortal.Accounts.Student

  def grades(conn, %{"id" => student_id}) do
    grades = Student.view_grades(student_id)
    json(conn, %{data: grades})
  end

  def schedule(conn, %{"id" => student_id}) do
    schedule = Student.view_schedule(student_id)
    json(conn, %{data: schedule})
  end

  def submit_assignment(conn, %{"id" => student_id, "assignment_id" => assignment_id} = params) do
    file = params["file"]
    
    # Since submit_assignment always returns {:ok, submission} for now,
    # we can simplify this:
    {:ok, submission} = Student.submit_assignment(student_id, assignment_id, file)
    
    conn
    |> put_status(:created)
    |> json(%{data: submission})
  end
end