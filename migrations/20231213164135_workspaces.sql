-------------------------------------------------------------------------------
-- Workspaces table
-------------------------------------------------------------------------------

create table if not exists public.workspaces
(
  id uuid default uuid_generate_v4() not null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- elastic columns
  name character varying(255) collate pg_catalog."default" not null,
  description character varying(255) collate pg_catalog."default" not null,

  -- dynamic columns
  constraint workspaces_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists workspaces_idx_id on public.workspaces (id);
create index if not exists workspaces_idx_created_at on public.workspaces (created_at);
create index if not exists workspaces_idx_updated_at on public.workspaces (updated_at);
create index if not exists workspaces_idx_deleted_at on public.workspaces (deleted_at);

-------------------------------------------------------------------------------
-- Users / workspaces member glue table
-------------------------------------------------------------------------------

-- Defines the role a specific member user can have
create type workspace_member_role as enum ('owner', 'editor', 'viewer');

create table if not exists workspace_members (
  id uuid default uuid_generate_v4() not null,
  user_id int not null references public.users (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- elastic columns
  role workspace_member_role not null default 'viewer',

  -- dynamic columns
  constraint workspace_members_pkey primary key (id)
);

-- indexes
create index if not exists workspace_members_idx_id on public.workspace_members (id);
create index if not exists workspace_members_idx_user_id on public.workspace_members (user_id);
create index if not exists workspace_members_idx_workspace_id on public.workspace_members (workspace_id);
create index if not exists workspace_members_idx_role on public.workspace_members (role);
create index if not exists workspace_members_idx_created_at on public.workspace_members (created_at);
create index if not exists workspace_members_idx_updated_at on public.workspace_members (updated_at);
create index if not exists workspace_members_idx_deleted_at on public.workspace_members (deleted_at);

-------------------------------------------------------------------------------
-- Orgs / workspaces glue table
-------------------------------------------------------------------------------
create table if not exists workspace_orgs (
  id uuid default uuid_generate_v4() not null,
  org_id int not null references public.users (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint workspace_orgs_pkey primary key (id)
);

-- indexes
create index if not exists workspace_orgs_idx_id on public.workspace_orgs (id);
create index if not exists workspace_orgs_idx_user_id on public.workspace_orgs (org_id);
create index if not exists workspace_orgs_idx_workspace_id on public.workspace_orgs (workspace_id);
create index if not exists workspace_orgs_idx_created_at on public.workspace_orgs (created_at);
create index if not exists workspace_orgs_idx_updated_at on public.workspace_orgs (updated_at);
create index if not exists workspace_orgs_idx_deleted_at on public.workspace_orgs (deleted_at);

-------------------------------------------------------------------------------
-- Repos / workspaces glue table
-------------------------------------------------------------------------------
create table if not exists workspace_repos (
  id uuid default uuid_generate_v4() not null,
  repo_id int not null references public.repos (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint workspace_repos_pkey primary key (id)
);

-- indexes
create index if not exists workspace_repos_idx_id on public.workspace_repos (id);
create index if not exists workspace_repos_idx_user_id on public.workspace_repos (repo_id);
create index if not exists workspace_repos_idx_workspace_id on public.workspace_repos (workspace_id);
create index if not exists workspace_repos_idx_created_at on public.workspace_repos (created_at);
create index if not exists workspace_repos_idx_updated_at on public.workspace_repos (updated_at);
create index if not exists workspace_repos_idx_deleted_at on public.workspace_repos (deleted_at);

-------------------------------------------------------------------------------
-- Insight page / workspaces glue table
-------------------------------------------------------------------------------
create table if not exists workspace_insights (
  id uuid default uuid_generate_v4() not null,
  insight_id int not null references public.insights (id) on delete cascade on update cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint workspace_insights_pkey primary key (id)
);

-- indexes
create index if not exists workspace_insights_idx_id on public.workspace_insights (id);
create index if not exists workspace_insights_idx_user_id on public.workspace_insights (insight_id);
create index if not exists workspace_insights_idx_workspace_id on public.workspace_insights (workspace_id);
create index if not exists workspace_insights_idx_created_at on public.workspace_insights (created_at);
create index if not exists workspace_insights_idx_updated_at on public.workspace_insights (updated_at);
create index if not exists workspace_insights_idx_deleted_at on public.workspace_insights (deleted_at);
