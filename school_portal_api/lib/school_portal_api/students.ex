defmodule SchoolPortalApi.Students do
  @moduledoc """
  Context for student data: roster, academic performance, guardian linkage.
  """

  import Ecto.Query, warn: false
  alias SchoolPortalApi.Repo
  alias SchoolPortalApi.Students.{Student, GuardianStudent, Subject, Assignment}

  def get_students_for_guardian(guardian_id) do
    Student
    |> join(:inner, [s], gs in GuardianStudent, on: gs.student_id == s.id)
    |> where([_s, gs], gs.guardian_id == ^guardian_id)
    |> Repo.all()
  end

  def get_student(student_id), do: Repo.get(Student, student_id)

  def get_student_performance(student_id) do
    case get_student(student_id) do
      nil -> nil
      student -> Repo.preload(student, [:subjects, :assignments])
    end
  end

  def guardian_owns_student?(guardian_id, student_id) do
    GuardianStudent
    |> where([gs], gs.guardian_id == ^guardian_id and gs.student_id == ^student_id)
    |> Repo.exists?()
  end

  def create_student(attrs \\ %{}) do
    %Student{}
    |> Student.changeset(attrs)
    |> Repo.insert()
  end

  def create_subject(student_id, attrs) do
    %Subject{}
    |> Subject.changeset(attrs)
    |> Ecto.Changeset.put_change(:student_id, student_id)
    |> Repo.insert()
  end

  def create_assignment(student_id, attrs) do
    %Assignment{}
    |> Assignment.changeset(attrs)
    |> Ecto.Changeset.put_change(:student_id, student_id)
    |> Repo.insert()
  end

  def link_guardian_to_student(guardian_id, student_id) do
    %GuardianStudent{}
    |> Ecto.Changeset.change(%{guardian_id: guardian_id, student_id: student_id})
    |> Ecto.Changeset.unique_constraint([:guardian_id, :student_id])
    |> Repo.insert()
  end
end
