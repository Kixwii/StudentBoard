defmodule SchoolPortalApi.Students.GuardianStudent do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "guardian_students" do
    belongs_to :guardian, SchoolPortalApi.Auth.GuardianAccount
    belongs_to :student, SchoolPortalApi.Students.Student

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(guardian_student, attrs) do
    guardian_student
    |> cast(attrs, [])
    |> validate_required([:guardian_id, :student_id])
    |> unique_constraint([:guardian_id, :student_id])
  end
end
