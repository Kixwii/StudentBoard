defmodule SchoolPortalApi.Fees do
  @moduledoc """
  Context for fee accounts, breakdowns, and payment transactions.
  """

  import Ecto.Query, warn: false
  alias SchoolPortalApi.Core.Repo
  alias SchoolPortalApi.Fees.{Account, Breakdown, Transaction}

  def get_account_by_student(student_id) do
    Account
    |> where([a], a.student_id == ^student_id)
    |> Repo.one()
    |> Repo.preload(:breakdowns)
  end

  def get_transactions_by_student(student_id) do
    case Repo.get_by(Account, student_id: student_id) do
      nil ->
        []

      account ->
        Transaction
        |> where([t], t.fee_account_id == ^account.id)
        |> order_by([t], desc: t.inserted_at)
        |> Repo.all()
    end
  end

  def create_payment(guardian_id, student_id, amount, payment_method) do
    case Repo.get_by(Account, student_id: student_id) do
      nil ->
        {:error, :account_not_found}

      account ->
        cond do
          amount <= 0 ->
            {:error, :invalid_amount}

          amount > account.current_balance ->
            {:error, :exceeds_balance}

          true ->
            Repo.transaction(fn ->
              new_balance = Float.round(account.current_balance - amount, 2)

              case account
                   |> Ecto.Changeset.change(current_balance: new_balance)
                   |> Repo.update() do
                {:ok, _} -> :ok
                {:error, reason} -> Repo.rollback(reason)
              end

              tx_changeset =
                %Transaction{}
                |> Transaction.changeset(%{
                  amount: amount,
                  description: "Payment - #{humanize_method(payment_method)}",
                  method: payment_method
                })
                |> Ecto.Changeset.put_change(:fee_account_id, account.id)
                |> Ecto.Changeset.put_change(:guardian_id, guardian_id)

              case Repo.insert(tx_changeset) do
                {:ok, transaction} -> transaction
                {:error, reason} -> Repo.rollback(reason)
              end
            end)
        end
    end
  end

  def create_account_for_student(student_id, attrs) do
    %Account{}
    |> Account.changeset(attrs)
    |> Ecto.Changeset.put_change(:student_id, student_id)
    |> Repo.insert()
  end

  def create_breakdown(fee_account_id, attrs) do
    %Breakdown{}
    |> Breakdown.changeset(attrs)
    |> Ecto.Changeset.put_change(:fee_account_id, fee_account_id)
    |> Repo.insert()
  end

  defp humanize_method(method) do
    method
    |> String.replace("_", " ")
    |> String.split()
    |> Enum.map(&String.capitalize/1)
    |> Enum.join(" ")
  end
end
