#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" 2>/dev/null; do
  sleep 1
done
echo "Database is ready."

echo "Running migrations..."
/app/bin/school_portal_api eval "SchoolPortalApi.Release.migrate()"

export PHX_SERVER=true
exec /app/bin/school_portal_api "$@"
