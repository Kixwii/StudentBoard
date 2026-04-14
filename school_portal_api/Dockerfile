# Build stage
FROM hexpm/elixir:1.16.3-erlang-26.2.5.2-alpine AS build

RUN apk add --no-cache build-base git

WORKDIR /app

RUN mix local.hex --force && mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix deps.get --only prod

COPY config config
RUN mix deps.compile

COPY lib lib
COPY priv priv

RUN mix compile
RUN mix release

# Runtime stage
FROM alpine:3.19 AS runtime

RUN apk add --no-cache libstdc++ openssl ncurses-libs postgresql-client

WORKDIR /app

COPY --from=build /app/_build/prod/rel/school_portal_api ./

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["start"]