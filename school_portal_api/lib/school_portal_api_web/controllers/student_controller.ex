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
    
    case Student.submit_assignment(student_id, assignment_id, file) do
      {:ok, submission} ->
        conn
        |> put_status(:created)
        |> json(%{data: submission})
      
      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: reason})
    end
  end
end