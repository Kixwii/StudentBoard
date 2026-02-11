defmodule SchoolPortalApiWeb.CORSController do
  use SchoolPortalApiWeb, :controller

  def preflight(conn, _params) do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "content-type, authorization")
    |> send_resp(200, "")
  end
end