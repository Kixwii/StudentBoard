defmodule SchoolPortalApi.Academics.Document do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "student_documents" do
    field :name, :string
    field :status, :string, default: "Available"
    field :updated, :date

    belongs_to :student, SchoolPortalApi.Students.Student

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(document, attrs) do
    document
    |> cast(attrs, [:name, :status, :updated])
    |> validate_required([:name, :status])
  end
end
