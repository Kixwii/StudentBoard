defmodule SchoolPortalApi.Fees.Breakdown do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "fee_breakdowns" do
    field :category, :string
    field :amount, :float, default: 0.0

    belongs_to :fee_account, SchoolPortalApi.Fees.Account

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(breakdown, attrs) do
    breakdown
    |> cast(attrs, [:category, :amount])
    |> validate_required([:category, :amount])
    |> validate_number(:amount, greater_than_or_equal_to: 0)
  end
end
