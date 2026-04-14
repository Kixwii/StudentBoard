defmodule SchoolPortalApiWeb.GuardianController do
  use SchoolPortalApiWeb, :controller

  alias SchoolPortalApi.{Accounts, Students, Fees}

  def students(conn, %{"id" => guardian_id}) do
    with {:ok, guardian} <- authorize_guardian(conn, guardian_id) do
      students = Students.get_students_for_guardian(guardian.id)

      formatted =
        Enum.map(students, fn s ->
          %{studentId: s.id, name: s.name, grade: s.grade, class: s.class, photo: s.photo}
        end)

      json(conn, %{data: formatted})
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  def student_performance(conn, %{"id" => guardian_id, "student_id" => student_id}) do
    with {:ok, guardian} <- authorize_guardian(conn, guardian_id),
         true <- Students.guardian_owns_student?(guardian.id, student_id) do
      case Students.get_student_performance(student_id) do
        nil ->
          conn |> put_status(:not_found) |> json(%{error: "Student not found"})

        student ->
          subjects =
            Enum.map(student.subjects, fn sub ->
              %{
                name: sub.name,
                grade: sub.grade,
                score: sub.score,
                maxScore: sub.max_score,
                teacher: sub.teacher
              }
            end)

          assignments =
            Enum.map(student.assignments, fn a ->
              %{
                subject: a.subject,
                assignment: a.assignment,
                score: a.score,
                date: Date.to_string(a.date)
              }
            end)

          json(conn, %{
            data: %{
              currentGPA: student.current_gpa,
              attendance: %{
                totalDays: student.total_days,
                present: student.present_days,
                absent: student.absent_days,
                late: student.late_days
              },
              behavioralAssessment: student.behavioural_assessment,
              subjects: subjects,
              recentAssignments: assignments
            }
          })
      end
    else
      {:error, :forbidden} -> conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
      false -> conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  def make_payment(conn, %{"id" => guardian_id} = params) do
    with {:ok, guardian} <- authorize_guardian(conn, guardian_id) do
      student_id = params["student_id"]
      amount = params["amount"]
      payment_method = params["payment_method"] || "bank_transfer"

      cond do
        is_nil(student_id) ->
          conn |> put_status(:bad_request) |> json(%{error: "student_id is required"})

        not Students.guardian_owns_student?(guardian.id, student_id) ->
          conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})

        not is_number(amount) or amount <= 0 ->
          conn |> put_status(:bad_request) |> json(%{error: "amount must be a positive number"})

        true ->
          case Fees.create_payment(guardian.id, student_id, amount, payment_method) do
            {:ok, transaction} ->
              json(conn, %{
                data: %{
                  transactionId: transaction.id,
                  amount: transaction.amount,
                  method: transaction.method,
                  description: transaction.description,
                  date: Date.to_string(DateTime.to_date(transaction.inserted_at)),
                  status: "completed"
                }
              })

            {:error, :exceeds_balance} ->
              conn
              |> put_status(:unprocessable_entity)
              |> json(%{error: "Amount exceeds current balance"})

            {:error, :invalid_amount} ->
              conn |> put_status(:unprocessable_entity) |> json(%{error: "Invalid amount"})

            {:error, :account_not_found} ->
              conn |> put_status(:not_found) |> json(%{error: "Fee account not found"})

            {:error, _} ->
              conn |> put_status(:internal_server_error) |> json(%{error: "Payment failed"})
          end
      end
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  defp authorize_guardian(conn, guardian_id) do
    current_user = Guardian.Plug.current_resource(conn)
    guardian = Accounts.get_guardian_by_user_id(current_user.id)

    if guardian != nil and guardian.id == guardian_id do
      {:ok, guardian}
    else
      {:error, :forbidden}
    end
  end
end
