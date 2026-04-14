defmodule SchoolPortalApiWeb.API.FeeController do
  use SchoolPortalApiWeb, :controller

  alias SchoolPortalApi.{Auth.Accounts, Students, Fees}

  def show(conn, %{"account_id" => student_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
      case Fees.get_account_by_student(student_id) do
        nil ->
          conn |> put_status(:not_found) |> json(%{error: "Fee account not found"})

        account ->
          breakdown =
            Enum.map(account.breakdowns, fn b ->
              %{category: b.category, amount: b.amount}
            end)

          json(conn, %{
            data: %{
              currentBalance: account.current_balance,
              dueDate: Date.to_string(account.due_date),
              breakdown: breakdown
            }
          })
      end
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  def transactions(conn, %{"account_id" => student_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
      txns = Fees.get_transactions_by_student(student_id)

      formatted =
        Enum.map(txns, fn t ->
          %{
            date: Date.to_string(DateTime.to_date(t.inserted_at)),
            amount: t.amount,
            description: t.description,
            method: t.method
          }
        end)

      json(conn, %{data: formatted})
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  defp authorize_student_access(conn, student_id) do
    current_user = Guardian.Plug.current_resource(conn)
    guardian = Accounts.get_guardian_by_user_id(current_user.id)

    if guardian != nil and Students.guardian_owns_student?(guardian.id, student_id) do
      :ok
    else
      {:error, :forbidden}
    end
  end
end
