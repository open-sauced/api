-------------------------------------------------------------------------------
-- Contributors / workspaces glue table
-------------------------------------------------------------------------------
create table if not exists workspace_contributors (
  id uuid default uuid_generate_v4() not null,
  contributor_id int not null references public.users (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint workspace_contributors_pkey primary key (id)
);

-- indexes
create index if not exists workspace_contributors_idx_id on public.workspace_contributors (id);
create index if not exists workspace_contributors_idx_user_id on public.workspace_contributors (contributor_id);
create index if not exists workspace_contributors_idx_workspace_id on public.workspace_contributors (workspace_id);
create index if not exists workspace_contributors_idx_created_at on public.workspace_contributors (created_at);
create index if not exists workspace_contributors_idx_updated_at on public.workspace_contributors (updated_at);
create index if not exists workspace_contributors_idx_deleted_at on public.workspace_contributors (deleted_at);
