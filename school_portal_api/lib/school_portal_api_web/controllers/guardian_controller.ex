defmodule SchoolPortalApiWeb.GuardianController do
  use SchoolPortalApiWeb, :controller

  def students(conn, %{"id" => _guardian_id}) do
    # Mock students data
    students = [
      %{
        name: "Gladys King'ang'i",
        grade: "Grade 8",
        class: "8A",
        photo: "👧🏿",
        studentId: "STU2024001"
      },
      %{
        name: "Onesmus Oliech",
        grade: "Grade 5",
        class: "5B",
        photo: "👦🏿",
        studentId: "STU2024002"
      }
    ]
    
    json(conn, %{data: students})
  end

  def student_performance(conn, %{"id" => _guardian_id, "student_id" => student_id}) do
    # Mock performance data
    performance = %{
      student_id: student_id,
      currentGPA: 3.7,
      attendance: 94,
      subjects: [
        %{name: "Mathematics", grade: "A-", percentage: 87, teacher: "Ms. Rodriguez"},
        %{name: "English Literature", grade: "B+", percentage: 85, teacher: "Mr. Thompson"},
        %{name: "Science", grade: "A", percentage: 92, teacher: "Dr. Chen"},
        %{name: "History", grade: "B", percentage: 82, teacher: "Ms. Williams"},
        %{name: "Art", grade: "A", percentage: 95, teacher: "Mr. Davis"}
      ],
      recentAssignments: [
        %{subject: "Mathematics", assignment: "Algebra Quiz 3", score: "18/20", date: "2024-08-15"},
        %{subject: "Science", assignment: "Chemistry Lab Report", score: "A", date: "2024-08-12"},
        %{subject: "English", assignment: "Book Report", score: "B+", date: "2024-08-10"}
      ]
    }
    
    json(conn, %{data: performance})
  end
end