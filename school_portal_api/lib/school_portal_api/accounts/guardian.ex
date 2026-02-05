defmodule SchoolPortalApi.Accounts.Guardian do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "guardians" do
    field :phone, :string
    field :relationship_to_student, :string

    belongs_to :user, SchoolPortalApi.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(guardian, attrs) do
    guardian
    |> cast(attrs, [:user_id, :phone, :relationship_to_student])
    |> validate_required([:user_id])
  end
end