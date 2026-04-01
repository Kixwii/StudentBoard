# Dockerfile
FROM hexpm/elixir:1.15.7-erlang-26.2.5-alpine

# Install build tools
RUN apk add --no-cache build-base git postgresql-client

# Create app directory
WORKDIR /school_portal_api

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy mix files first for better caching
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod

# Copy application code
COPY . .

# Compile
RUN mix compile

# Set up entrypoint
CMD ["mix", "phx.server"]