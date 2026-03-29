defmodule SchoolPortalApi.Students.Assignment do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "student_assignments" do
    field :subject, :string
    field :assignment, :string
    field :score, :string
    field :date, :date

    belongs_to :student, SchoolPortalApi.Students.Student

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(assignment, attrs) do
    assignment
    |> cast(attrs, [:subject, :assignment, :score, :date])
    |> validate_required([:subject, :assignment])
  end
end
