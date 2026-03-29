defmodule SchoolPortalApi.Repo.Migrations.CreatePaymentTransactions do
  use Ecto.Migration

  def change do
    create table(:payment_transactions, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :fee_account_id, references(:fee_accounts, type: :binary_id, on_delete: :delete_all),
        null: false

      add :guardian_id, references(:guardians, type: :binary_id, on_delete: :nilify_all)
      add :amount, :float, null: false
      add :description, :string
      add :method, :string, null: false

      timestamps(type: :utc_datetime)
    end

    create index(:payment_transactions, [:fee_account_id])
    create index(:payment_transactions, [:guardian_id])
  end
end
