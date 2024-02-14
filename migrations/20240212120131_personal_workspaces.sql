-------------------------------------------------------------------------------
-- Adds personal workspaces columns to the user table
--
-- This denotes which workspace ID is that user's personal workspace and creates
-- a one sided, one-to-one relationship with workspaces (where workspaces have
-- no key for a user's personal workspace, just a reference in the users table).
-------------------------------------------------------------------------------

alter table users
  add column personal_workspace_id uuid null,
  add constraint personal_workspace_fkey foreign key (personal_workspace_id) references workspaces(id);
