-------------------------------------------------------------------------------
-- User list page / workspaces glue table
--
-- This allows for entries in the user_list table to be associated with a workspace
-- via the user_list id and the workspace id
-------------------------------------------------------------------------------

create table if not exists workspace_user_lists (
  id uuid default uuid_generate_v4() not null,
  user_list_id uuid not null references public.user_lists (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint workspace_user_lists_pkey primary key (id)
);

-- indexes
create index if not exists workspace_user_lists_idx_id on public.workspace_user_lists (id);
create index if not exists workspace_user_lists_idx_user_id on public.workspace_user_lists (user_list_id);
create index if not exists workspace_user_lists_idx_workspace_id on public.workspace_user_lists (workspace_id);
create index if not exists workspace_user_lists_idx_created_at on public.workspace_user_lists (created_at);
create index if not exists workspace_user_lists_idx_updated_at on public.workspace_user_lists (updated_at);
create index if not exists workspace_user_lists_idx_deleted_at on public.workspace_user_lists (deleted_at);
