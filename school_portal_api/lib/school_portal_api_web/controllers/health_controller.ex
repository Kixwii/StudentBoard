defmodule SchoolPortalApiWeb.HealthController do
  use SchoolPortalApiWeb, :controller

  def index(conn, _params) do
    json(conn, %{
      status: "ok",
      message: "School Portal API is running",
      timestamp: DateTime.utc_now()
    })
  end
end