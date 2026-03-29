defmodule SchoolPortalApi.Repo.Migrations.CreateStudentsAndGuardianStudents do
  use Ecto.Migration

  def change do
    create table(:students, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :grade, :string, null: false
      add :class, :string, null: false
      add :photo, :string, default: "👤"
      add :current_gpa, :float, default: 0.0
      add :attendance, :integer, default: 0

      timestamps(type: :utc_datetime)
    end

    create table(:guardian_students, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :guardian_id, references(:guardians, type: :binary_id, on_delete: :delete_all),
        null: false

      add :student_id, references(:students, type: :binary_id, on_delete: :delete_all),
        null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:guardian_students, [:guardian_id, :student_id])
    create index(:guardian_students, [:guardian_id])
    create index(:guardian_students, [:student_id])
  end
end
