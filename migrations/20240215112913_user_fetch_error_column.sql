-------------------------------------------------------------------------------
-- This adds a "fetch_error" column to the users and repos tables: this is in service
-- of surfacing issues with the ETL not being able to fetch data from GitHub on entities.
-------------------------------------------------------------------------------

-- Users fetch_error column
alter table users
  add column fetch_error boolean default false;

create index idx_users_fetch_error on users (fetch_error);

-- Repos fetch_error column
alter table repos
  add column fetch_error boolean default false;

create index idx_repo_fetch_error on repos (fetch_error);
