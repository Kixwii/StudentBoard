defmodule SchoolPortalApi.Repo.Migrations.CreateFeeAccountsAndBreakdowns do
  use Ecto.Migration

  def change do
    create table(:fee_accounts, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :student_id, references(:students, type: :binary_id, on_delete: :delete_all),
        null: false

      add :current_balance, :float, null: false, default: 0.0
      add :due_date, :date

      timestamps(type: :utc_datetime)
    end

    create unique_index(:fee_accounts, [:student_id])

    create table(:fee_breakdowns, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :fee_account_id, references(:fee_accounts, type: :binary_id, on_delete: :delete_all),
        null: false

      add :category, :string, null: false
      add :amount, :float, null: false, default: 0.0

      timestamps(type: :utc_datetime)
    end

    create index(:fee_breakdowns, [:fee_account_id])
  end
end
