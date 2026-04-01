defmodule SchoolPortalApi.Repo.Migrations.CreateStudentSubjectsAndAssignments do
  use Ecto.Migration

  def change do
    create table(:student_subjects, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :student_id, references(:students, type: :binary_id, on_delete: :delete_all),
        null: false

      add :name, :string, null: false
      add :grade, :string
      add :percentage, :integer, default: 0
      add :teacher, :string

      timestamps(type: :utc_datetime)
    end

    create index(:student_subjects, [:student_id])

    create table(:student_assignments, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :student_id, references(:students, type: :binary_id, on_delete: :delete_all),
        null: false

      add :subject, :string, null: false
      add :assignment, :string, null: false
      add :score, :string
      add :date, :date

      timestamps(type: :utc_datetime)
    end

    create index(:student_assignments, [:student_id])
  end
end
