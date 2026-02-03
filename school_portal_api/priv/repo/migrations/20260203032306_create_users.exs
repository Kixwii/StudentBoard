defmodule SchoolPortalApi.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :role, :string, null: false, default: "parent"
      add :full_name, :string
      add :guardian_id, :string

      timestamps()
    end

    create unique_index(:users, [:email])
    create index(:users, [:guardian_id])
  end
end
