defmodule SchoolPortalApi.Core.Repo do
  use Ecto.Repo,
    otp_app: :school_portal_api,
    adapter: Ecto.Adapters.Postgres
end
