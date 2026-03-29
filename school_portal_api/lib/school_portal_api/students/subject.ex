defmodule SchoolPortalApi.Students.Subject do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "student_subjects" do
    field :name, :string
    field :grade, :string
    field :percentage, :integer, default: 0
    field :teacher, :string

    belongs_to :student, SchoolPortalApi.Students.Student

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(subject, attrs) do
    subject
    |> cast(attrs, [:name, :grade, :percentage, :teacher])
    |> validate_required([:name])
  end
end
