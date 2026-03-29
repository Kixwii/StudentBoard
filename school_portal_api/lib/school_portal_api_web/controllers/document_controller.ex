defmodule SchoolPortalApiWeb.DocumentController do
  use SchoolPortalApiWeb, :controller

  alias SchoolPortalApi.{Accounts, Students, Documents}

  def index(conn, %{"student_id" => student_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
      docs = Documents.get_documents_by_student(student_id)

      formatted =
        Enum.map(docs, fn d ->
          %{name: d.name, status: d.status, updated: Date.to_string(d.updated)}
        end)

      json(conn, %{data: formatted})
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  defp authorize_student_access(conn, student_id) do
    current_user = Guardian.Plug.current_resource(conn)
    guardian = Accounts.get_guardian_by_user_id(current_user.id)

    if guardian != nil and Students.guardian_owns_student?(guardian.id, student_id) do
      :ok
    else
      {:error, :forbidden}
    end
  end
end
