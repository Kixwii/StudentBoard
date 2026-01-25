defmodule SchoolPortalApiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :school_portal_api

  plug Corsica,
    origins: ["http://localhost:3000", "http://localhost:5173"],
    allow_headers: ["content-type", "authorization"],
    allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
end