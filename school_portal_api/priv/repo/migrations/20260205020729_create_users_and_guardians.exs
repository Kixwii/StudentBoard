defmodule SchoolPortalApi.Repo.Migrations.CreateUsersAndGuardians do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :first_name, :string
      add :last_name, :string
      add :role, :string, null: false
      add :last_login, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:email])

    create table(:guardians, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all)
      add :phone, :string
      add :relationship_to_student, :string

      timestamps(type: :utc_datetime)
    end

    create index(:guardians, [:user_id])
  end
end