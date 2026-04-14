defmodule SchoolPortalApiWeb.Auth.AuthController do
  use SchoolPortalApiWeb, :controller

  alias SchoolPortalApi.Auth.Accounts
  alias SchoolPortalApi.Guardian

  def register(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        # Create guardian record if role is parent
        if user.role == "parent" do
          Accounts.create_guardian(user, %{
            phone: user_params["phone"],
            relationship_to_student: user_params["relationship_to_student"]
          })
        end

        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> json(%{
          data: %{
            token: token,
            user: %{
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          }
        })

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: translate_errors(changeset)})
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        # Get guardian info if parent
        guardian_id =
          if user.role == "parent" do
            case Accounts.get_guardian_by_user_id(user.id) do
              nil -> nil
              guardian -> guardian.id
            end
          else
            nil
          end

        conn
        |> json(%{
          data: %{
            token: token,
            user: %{
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role,
              guardian_id: guardian_id
            }
          }
        })

      {:error, :invalid_credentials} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid email or password"})
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
