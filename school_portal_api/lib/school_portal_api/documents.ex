defmodule SchoolPortalApi.Documents do
  @moduledoc """
  Context for student documents and transcripts.
  """

  import Ecto.Query, warn: false
  alias SchoolPortalApi.Repo
  alias SchoolPortalApi.Documents.Document

  def get_documents_by_student(student_id) do
    Document
    |> where([d], d.student_id == ^student_id)
    |> order_by([d], asc: d.name)
    |> Repo.all()
  end

  def create_document(student_id, attrs) do
    %Document{}
    |> Document.changeset(attrs)
    |> Ecto.Changeset.put_change(:student_id, student_id)
    |> Repo.insert()
  end
end
