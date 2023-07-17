#!/bin/bash
set -e

# Enable SSL in the main PostgreSQL configuration file
echo "ssl = on" >> "$PGDATA/postgresql.conf"
echo "ssl_cert_file = '/var/lib/postgresql/ssl/server.crt'" >> "$PGDATA/postgresql.conf"
echo "ssl_key_file = '/var/lib/postgresql/ssl/server.key'" >> "$PGDATA/postgresql.conf"

# Append SSL settings to the PostgreSQL client authentication configuration file
echo "hostssl all             all             0.0.0.0/0               md5" >> "$PGDATA/pg_hba.conf"

# Run the rest of the commands with exec so that PID 1 is replaced with the PostgreSQL process
exec "$@"