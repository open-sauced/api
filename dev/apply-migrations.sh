#!/usr/bin/env bash

# This script applies all migrations in the migrations directory to a running
# postgres database on port 25060 with a given password.
#
# It assumes that the database is running locally on locahost with port 25060.
# It also assumes you are using the database user and dbname from
# Dockerfile.local-postgres.
#
# If not, you can provide these values on the command line directly to overwrite
# these default values:
# PGPASSWORD=woofwoof ./dev/apply-migrations.sh

export PGHOST=${PGHOST:-localhost}
export PGPORT=${PGPORT:-25060}
export PGPASSWORD=${PGPASSWORD:-UCN2zrH2WGxKck7tT2JG4MY6wbHkeX9s}

export PGDBNAME=${PGDBNAME:-defaultdb}
export PGUSERNAME=${PGUSERNAME:-doadmin}

ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && cd ../ && pwd )

for file in ${ROOT_DIR}/migrations/*; do
  psql -U "${PGUSERNAME}" -d "${DBNAME}" -f "${file}"
done
