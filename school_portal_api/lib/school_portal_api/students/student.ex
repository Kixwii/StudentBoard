defmodule SchoolPortalApi.Students.Student do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "students" do
    field :name, :string
    field :grade, :string
    field :class, :string
    field :photo, :string, default: "👤"
    field :current_gpa, :float, default: 0.0
    field :attendance, :integer, default: 0
    field :total_days, :integer, default: 0
    field :present_days, :integer, default: 0
    field :absent_days, :integer, default: 0
    field :late_days, :integer, default: 0
    field :behavioural_assessment, :string

    has_many :subjects, SchoolPortalApi.Students.Subject
    has_many :assignments, SchoolPortalApi.Students.Assignment
    has_one :fee_account, SchoolPortalApi.Fees.Account
    has_many :documents, SchoolPortalApi.Documents.Document

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(student, attrs) do
    student
    |> cast(attrs, [
      :name,
      :grade,
      :class,
      :photo,
      :current_gpa,
      :attendance,
      :total_days,
      :present_days,
      :absent_days,
      :late_days,
      :behavioural_assessment
    ])
    |> validate_required([:name, :grade, :class])
  end
end
