defmodule SchoolPortalApiWeb.DocumentController do
  use SchoolPortalApiWeb, :controller

  def index(conn, %{"student_id" => _student_id}) do
    # Mock documents
    documents = [
      %{name: "Academic Transcript", status: "Available", updated: "2024-08-01"},
      %{name: "Conduct Certificate", status: "Available", updated: "2024-08-01"},
      %{name: "Health Records", status: "Available", updated: "2024-07-15"}
    ]
    
    json(conn, %{data: documents})
  end
end