import Config

# Configure your database
config :school_portal_api, SchoolPortalApi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "school_portal_api_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

# For development, we disable any cache and enable
# debugging and code reloading.
config :school_portal_api, SchoolPortalApiWeb.Endpoint,
  # Binding to loopback ipv4 address prevents access from other machines.
  # Change to `ip: {0, 0, 0, 0}` to allow access from other machines.
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "your_secret_key_base_here_at_least_64_characters_long_random_string",
  watchers: []

# Do not include metadata nor timestamps in development logs
config :logger, :default_formatter, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# Enable dev routes for dashboard and mailbox
config :school_portal_api, dev_routes: true

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false
