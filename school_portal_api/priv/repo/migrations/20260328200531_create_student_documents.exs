defmodule SchoolPortalApi.Repo.Migrations.CreateStudentDocuments do
  use Ecto.Migration

  def change do
    create table(:student_documents, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :student_id, references(:students, type: :binary_id, on_delete: :delete_all),
        null: false

      add :name, :string, null: false
      add :status, :string, null: false, default: "Available"
      add :updated, :date

      timestamps(type: :utc_datetime)
    end

    create index(:student_documents, [:student_id])
  end
end
