defmodule SchoolPortalApiWeb.StudentController do
  use SchoolPortalApiWeb, :controller

  alias SchoolPortalApi.{Accounts, Students}

  def grades(conn, %{"id" => student_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
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
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  def schedule(conn, %{"id" => student_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
      schedule = [
        %{
          day_of_week: "Monday",
          subject: "Mathematics",
          start_time: "09:00",
          end_time: "10:00",
          location: "Room 101",
          teacher: "Ms. Rodriguez"
        },
        %{
          day_of_week: "Monday",
          subject: "Science",
          start_time: "10:30",
          end_time: "11:30",
          location: "Lab 2",
          teacher: "Dr. Chen"
        },
        %{
          day_of_week: "Tuesday",
          subject: "English Literature",
          start_time: "09:00",
          end_time: "10:00",
          location: "Room 203",
          teacher: "Mr. Thompson"
        },
        %{
          day_of_week: "Wednesday",
          subject: "History",
          start_time: "14:00",
          end_time: "15:00",
          location: "Room 105",
          teacher: "Ms. Williams"
        }
      ]

      json(conn, %{data: schedule})
    else
      {:error, :forbidden} ->
        conn |> put_status(:forbidden) |> json(%{error: "Forbidden"})
    end
  end

  def submit_assignment(conn, %{"id" => student_id, "assignment_id" => assignment_id}) do
    with :ok <- authorize_student_access(conn, student_id) do
      submission = %{
        submission_id: :crypto.strong_rand_bytes(8) |> Base.encode16(case: :lower),
        student_id: student_id,
        assignment_id: assignment_id,
        submitted_at: DateTime.utc_now() |> DateTime.to_iso8601(),
        status: "submitted"
      }

      conn |> put_status(:created) |> json(%{data: submission})
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
