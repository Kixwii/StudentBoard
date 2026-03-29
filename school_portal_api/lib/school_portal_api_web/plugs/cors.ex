defmodule SchoolPortalApiWeb.Plugs.CORS do
  @moduledoc """
  A plug to add CORS headers to responses
  """

  def init(opts), do: opts

  def call(conn, _opts) do
    conn
    |> Plug.Conn.put_resp_header("access-control-allow-origin", "*")
    |> Plug.Conn.put_resp_header(
      "access-control-allow-methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    )
    |> Plug.Conn.put_resp_header("access-control-allow-headers", "content-type, authorization")
  end
end
