defmodule SchoolPortalApiWeb.FeeController do
  use SchoolPortalApiWeb, :controller

  def show(conn, %{"account_id" => _account_id}) do
    # Mock fee account data
    account = %{
      currentBalance: 1250.00,
      dueDate: "2024-09-15",
      breakdown: [
        %{category: "Tuition Fee", amount: 800.00},
        %{category: "Activity Fee", amount: 150.00},
        %{category: "Library Fee", amount: 50.00},
        %{category: "Lab Fee", amount: 100.00},
        %{category: "Transportation", amount: 150.00}
      ]
    }
    
    json(conn, %{data: account})
  end

  def transactions(conn, %{"account_id" => _account_id}) do
    # Mock transaction history
    transactions = [
      %{date: "2024-07-15", amount: 1200.00, description: "Q1 Tuition Payment", method: "Bank Transfer"},
      %{date: "2024-06-01", amount: 200.00, description: "Registration Fee", method: "Cash"},
      %{date: "2024-04-20", amount: 1200.00, description: "Q4 Previous Year", method: "Check"}
    ]
    
    json(conn, %{data: transactions})
  end
end