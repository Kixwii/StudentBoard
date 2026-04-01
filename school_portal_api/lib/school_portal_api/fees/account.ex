defmodule SchoolPortalApi.Fees.Account do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "fee_accounts" do
    field :current_balance, :float, default: 0.0
    field :due_date, :date

    belongs_to :student, SchoolPortalApi.Students.Student
    has_many :breakdowns, SchoolPortalApi.Fees.Breakdown, foreign_key: :fee_account_id
    has_many :transactions, SchoolPortalApi.Fees.Transaction, foreign_key: :fee_account_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(account, attrs) do
    account
    |> cast(attrs, [:current_balance, :due_date])
    |> validate_required([:current_balance])
    |> validate_number(:current_balance, greater_than_or_equal_to: 0)
  end
end
