defmodule SchoolPortalApi.Core.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      SchoolPortalApiWeb.Core.Telemetry,
      SchoolPortalApi.Core.Repo,
      {DNSCluster, query: Application.get_env(:school_portal_api, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: SchoolPortalApi.PubSub},
      # Start a worker by calling: SchoolPortalApi.Worker.start_link(arg)
      # {SchoolPortalApi.Worker, arg},
      # Start to serve requests, typically the last entry
      SchoolPortalApiWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: SchoolPortalApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    SchoolPortalApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
