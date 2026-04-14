defmodule SchoolPortalApi.Repo.Migrations.AddAttendanceDetailsAndAssessmentToStudents do
  use Ecto.Migration

  def change do
    alter table(:students) do
      add :total_days, :integer, default: 0
      add :present_days, :integer, default: 0
      add :absent_days, :integer, default: 0
      add :late_days, :integer, default: 0
      add :behavioural_assessment, :string
    end
  end
end
