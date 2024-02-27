-------------------------------------------------------------------------------
-- Workspaces can be public or private: the workspaces.is_public column is used to determine showing
-- non-authenticated users a workspace (and its underlying resources).
--
-- WARNING!!! By default, all workspaces are PUBLIC. Only paid workspaces may be
-- made private. The mental model is "old" GitHub where repos were public by default
-- and in order to have private repos / orgs, you needed to pay.
--
-- The workspaces.payee_user_id column is a foreign key reference to a paying
-- user which denotes the subscription for the paid workspace.
-------------------------------------------------------------------------------

alter table workspaces
  add column is_public boolean default true;

alter table workspaces
  add column payee_user_id bigint default null,
  add constraint fk_workspaces_payee_user_id foreign key (payee_user_id)
  references users (id) on delete set null;
