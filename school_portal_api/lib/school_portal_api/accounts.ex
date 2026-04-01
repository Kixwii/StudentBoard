defmodule SchoolPortalApi.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias SchoolPortalApi.Repo
  alias SchoolPortalApi.Accounts.{User, Guardian}

  ## User functions

  def get_user(id), do: Repo.get(User, id)

  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def authenticate_user(email, password) do
    user = get_user_by_email(email)

    cond do
      user && Bcrypt.verify_pass(password, user.password_hash) ->
        update_last_login(user)
        {:ok, user}

      user ->
        {:error, :invalid_credentials}

      true ->
        Bcrypt.no_user_verify()
        {:error, :invalid_credentials}
    end
  end

  defp update_last_login(user) do
    user
    |> User.login_changeset()
    |> Repo.update()
  end

  ## Guardian functions

  def get_guardian_by_user_id(user_id) do
    Repo.get_by(Guardian, user_id: user_id)
  end

  def create_guardian(user, attrs \\ %{}) do
    %Guardian{}
    |> Guardian.changeset(Map.put(attrs, :user_id, user.id))
    |> Repo.insert()
  end

  def get_guardian_with_user(guardian_id) do
    Guardian
    |> Repo.get(guardian_id)
    |> Repo.preload(:user)
  end
end
