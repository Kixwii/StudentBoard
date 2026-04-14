defmodule SchoolPortalApi.Fees.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "payment_transactions" do
    field :amount, :float
    field :description, :string
    field :method, :string

    belongs_to :fee_account, SchoolPortalApi.Fees.Account
    belongs_to :guardian, SchoolPortalApi.Auth.GuardianAccount

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:amount, :description, :method])
    |> validate_required([:amount, :method])
    |> validate_number(:amount, greater_than: 0)
  end
end
