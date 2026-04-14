defmodule SchoolPortalApi.Repo.Migrations.AddScoreToStudentSubjects do
  use Ecto.Migration

  def change do
    alter table(:student_subjects) do
      add :score, :integer, default: 0
      add :max_score, :integer, default: 100
    end
  end
end
