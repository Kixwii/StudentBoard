# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Safe to run multiple times — existing records are skipped via on_conflict: :nothing.

import Ecto.Query

alias SchoolPortalApi.Repo
alias SchoolPortalApi.Accounts
alias SchoolPortalApi.Students
alias SchoolPortalApi.Fees
alias SchoolPortalApi.Documents

IO.puts("Seeding database...")

# ── Demo guardian account ────────────────────────────────────────────────────

guardian_user =
  case Accounts.get_user_by_email("parent@demo.com") do
    nil ->
      {:ok, user} =
        Accounts.create_user(%{
          "email" => "parent@demo.com",
          "password" => "password123",
          "first_name" => "Demo",
          "last_name" => "Parent",
          "role" => "parent"
        })

      {:ok, _guardian} =
        Accounts.create_guardian(user, %{
          phone: "+254700000000",
          relationship_to_student: "parent"
        })

      IO.puts("Created demo guardian: parent@demo.com / password123")
      user

    user ->
      IO.puts("Demo guardian already exists, skipping.")
      user
  end

guardian = Accounts.get_guardian_by_user_id(guardian_user.id)

# ── Demo teacher account ─────────────────────────────────────────────────────

case Accounts.get_user_by_email("teacher@demo.com") do
  nil ->
    {:ok, _user} =
      Accounts.create_user(%{
        "email" => "teacher@demo.com",
        "password" => "password123",
        "first_name" => "Sarah",
        "last_name" => "Johnson",
        "role" => "teacher"
      })

    IO.puts("Created demo teacher: teacher@demo.com / password123")

  _user ->
    IO.puts("Demo teacher already exists, skipping.")
end

# Student 1: Gladys 

gladys =
  case Repo.one(
         from s in SchoolPortalApi.Students.Student,
           join: gs in SchoolPortalApi.Students.GuardianStudent,
           on: gs.student_id == s.id,
           where: gs.guardian_id == ^guardian.id and s.name == "Gladys King'ang'i",
           limit: 1
       ) do
    nil ->
      {:ok, s} =
        Students.create_student(%{
          name: "Gladys King'ang'i",
          grade: "Grade 8",
          class: "8A",
          photo: "👧🏿",
          current_gpa: 3.8,
          attendance: 96,
          total_days: 100,
          present_days: 94,
          absent_days: 5,
          late_days: 1,
          behavioural_assessment:
            "Gladys is very attentive and participates actively in class discussions. She consistently demonstrates strong work ethic and leadership qualities."
        })

      {:ok, _} = Students.link_guardian_to_student(guardian.id, s.id)
      IO.puts("Created student: Gladys King'ang'i")
      s

    s ->
      IO.puts("Gladys already exists, checking for field updates...")

      s =
        if s.total_days == 0 do
          {:ok, updated} =
            s
            |> SchoolPortalApi.Students.Student.changeset(%{
              total_days: 100,
              present_days: 94,
              absent_days: 5,
              late_days: 1,
              behavioural_assessment:
                "Gladys is very attentive and participates actively in class discussions. She consistently demonstrates strong work ethic and leadership qualities."
            })
            |> Repo.update()

          updated
        else
          s
        end

      s
  end

# Subjects for Gladys
existing_gladys_subjects =
  Repo.all(from sub in SchoolPortalApi.Students.Subject, where: sub.student_id == ^gladys.id)

if Enum.empty?(existing_gladys_subjects) do
  {:ok, _} =
    Students.create_subject(gladys.id, %{
      name: "Mathematics",
      grade: "A-",
      score: 87,
      max_score: 100,
      percentage: 87,
      teacher: "Ms. Rodriguez"
    })

  {:ok, _} =
    Students.create_subject(gladys.id, %{
      name: "English Literature",
      grade: "B+",
      score: 85,
      max_score: 100,
      percentage: 85,
      teacher: "Mr. Thompson"
    })

  {:ok, _} =
    Students.create_subject(gladys.id, %{
      name: "Science",
      grade: "A",
      score: 92,
      max_score: 100,
      percentage: 92,
      teacher: "Dr. Chen"
    })

  {:ok, _} =
    Students.create_subject(gladys.id, %{
      name: "History",
      grade: "B",
      score: 82,
      max_score: 100,
      percentage: 82,
      teacher: "Ms. Williams"
    })

  {:ok, _} =
    Students.create_subject(gladys.id, %{
      name: "Art",
      grade: "A+",
      score: 96,
      max_score: 100,
      percentage: 96,
      teacher: "Mr. Davis"
    })
else
  Enum.each(existing_gladys_subjects, fn sub ->
    if sub.score == 0 do
      sub
      |> SchoolPortalApi.Students.Subject.changeset(%{score: sub.percentage, max_score: 100})
      |> Repo.update()
    end
  end)
end

existing_gladys_assignments =
  Repo.all(from a in SchoolPortalApi.Students.Assignment, where: a.student_id == ^gladys.id)

if Enum.empty?(existing_gladys_assignments) do
  {:ok, _} =
    Students.create_assignment(gladys.id, %{
      subject: "Mathematics",
      assignment: "Algebra Quiz 3",
      score: "18/20",
      date: ~D[2026-02-15]
    })

  {:ok, _} =
    Students.create_assignment(gladys.id, %{
      subject: "Science",
      assignment: "Chemistry Lab Report",
      score: "A",
      date: ~D[2026-02-12]
    })

  {:ok, _} =
    Students.create_assignment(gladys.id, %{
      subject: "English Literature",
      assignment: "Book Report: Animal Farm",
      score: "B+",
      date: ~D[2026-02-10]
    })
end

existing_gladys_account =
  Repo.one(from a in SchoolPortalApi.Fees.Account, where: a.student_id == ^gladys.id)

if is_nil(existing_gladys_account) do
  {:ok, account} =
    Fees.create_account_for_student(gladys.id, %{
      current_balance: 1250.00,
      due_date: ~D[2026-04-30]
    })

  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Tuition Fee", amount: 800.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Activity Fee", amount: 150.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Library Fee", amount: 50.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Lab Fee", amount: 100.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Transportation", amount: 150.00})
end

existing_gladys_docs =
  Repo.all(from d in SchoolPortalApi.Documents.Document, where: d.student_id == ^gladys.id)

if Enum.empty?(existing_gladys_docs) do
  {:ok, _} =
    Documents.create_document(gladys.id, %{
      name: "Academic Transcript",
      status: "Available",
      updated: ~D[2026-01-15]
    })

  {:ok, _} =
    Documents.create_document(gladys.id, %{
      name: "Conduct Certificate",
      status: "Available",
      updated: ~D[2026-01-15]
    })

  {:ok, _} =
    Documents.create_document(gladys.id, %{
      name: "Health Records",
      status: "Available",
      updated: ~D[2025-12-01]
    })
end

# Student 2: Onesmus

onesmus =
  case Repo.one(
         from s in SchoolPortalApi.Students.Student,
           join: gs in SchoolPortalApi.Students.GuardianStudent,
           on: gs.student_id == s.id,
           where: gs.guardian_id == ^guardian.id and s.name == "Onesmus Oliech",
           limit: 1
       ) do
    nil ->
      {:ok, s} =
        Students.create_student(%{
          name: "Onesmus Oliech",
          grade: "Grade 5",
          class: "5B",
          photo: "👦🏿",
          current_gpa: 3.4,
          attendance: 91,
          total_days: 100,
          present_days: 88,
          absent_days: 10,
          late_days: 2,
          behavioural_assessment:
            "Onesmus is a bright student but needs to focus more during class. He shows great potential and has been improving steadily this term."
        })

      {:ok, _} = Students.link_guardian_to_student(guardian.id, s.id)
      IO.puts("Created student: Onesmus Oliech")
      s

    s ->
      IO.puts("Onesmus already exists, checking for field updates...")

      s =
        if s.total_days == 0 do
          {:ok, updated} =
            s
            |> SchoolPortalApi.Students.Student.changeset(%{
              total_days: 100,
              present_days: 88,
              absent_days: 10,
              late_days: 2,
              behavioural_assessment:
                "Onesmus is a bright student but needs to focus more during class. He shows great potential and has been improving steadily this term."
            })
            |> Repo.update()

          updated
        else
          s
        end

      s
  end

# Subjects for Onesmus
existing_onesmus_subjects =
  Repo.all(from sub in SchoolPortalApi.Students.Subject, where: sub.student_id == ^onesmus.id)

if Enum.empty?(existing_onesmus_subjects) do
  {:ok, _} =
    Students.create_subject(onesmus.id, %{
      name: "Mathematics",
      grade: "B+",
      score: 83,
      max_score: 100,
      percentage: 83,
      teacher: "Mr. Kamau"
    })

  {:ok, _} =
    Students.create_subject(onesmus.id, %{
      name: "English",
      grade: "A-",
      score: 88,
      max_score: 100,
      percentage: 88,
      teacher: "Mrs. Njoroge"
    })

  {:ok, _} =
    Students.create_subject(onesmus.id, %{
      name: "Science",
      grade: "B",
      score: 79,
      max_score: 100,
      percentage: 79,
      teacher: "Mr. Otieno"
    })

  {:ok, _} =
    Students.create_subject(onesmus.id, %{
      name: "Social Studies",
      grade: "A",
      score: 91,
      max_score: 100,
      percentage: 91,
      teacher: "Ms. Mwangi"
    })
else
  Enum.each(existing_onesmus_subjects, fn sub ->
    if sub.score == 0 do
      sub
      |> SchoolPortalApi.Students.Subject.changeset(%{score: sub.percentage, max_score: 100})
      |> Repo.update()
    end
  end)
end

existing_onesmus_assignments =
  Repo.all(from a in SchoolPortalApi.Students.Assignment, where: a.student_id == ^onesmus.id)

if Enum.empty?(existing_onesmus_assignments) do
  {:ok, _} =
    Students.create_assignment(onesmus.id, %{
      subject: "Mathematics",
      assignment: "Times Tables Test",
      score: "16/20",
      date: ~D[2026-02-14]
    })

  {:ok, _} =
    Students.create_assignment(onesmus.id, %{
      subject: "English",
      assignment: "Essay: My Holiday",
      score: "A-",
      date: ~D[2026-02-11]
    })
end

existing_onesmus_account =
  Repo.one(from a in SchoolPortalApi.Fees.Account, where: a.student_id == ^onesmus.id)

if is_nil(existing_onesmus_account) do
  {:ok, account} =
    Fees.create_account_for_student(onesmus.id, %{
      current_balance: 950.00,
      due_date: ~D[2026-04-30]
    })

  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Tuition Fee", amount: 650.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Activity Fee", amount: 100.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Library Fee", amount: 50.00})
  {:ok, _} = Fees.create_breakdown(account.id, %{category: "Transportation", amount: 150.00})
end

existing_onesmus_docs =
  Repo.all(from d in SchoolPortalApi.Documents.Document, where: d.student_id == ^onesmus.id)

if Enum.empty?(existing_onesmus_docs) do
  {:ok, _} =
    Documents.create_document(onesmus.id, %{
      name: "Academic Transcript",
      status: "Available",
      updated: ~D[2026-01-15]
    })

  {:ok, _} =
    Documents.create_document(onesmus.id, %{
      name: "Vaccination Records",
      status: "Available",
      updated: ~D[2025-11-20]
    })
end

IO.puts("Seeding complete!")
