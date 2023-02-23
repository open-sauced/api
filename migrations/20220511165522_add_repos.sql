create table if not exists public.repos
(
  -- static columns
  id bigint not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  size bigint not null default 0,
  issues bigint not null default 0,
  stars bigint not null default 0,
  forks bigint not null default 0,
  watchers bigint not null default 0,
  subscribers bigint not null default 0,
  network bigint not null default 0,
  is_fork boolean not null default false,
  is_private boolean not null default false,
  is_template boolean not null default false,
  is_archived boolean not null default false,
  is_disabled boolean not null default false,
  has_issues boolean not null default true,
  has_projects boolean not null default true,
  has_downloads boolean not null default true,
  has_wiki boolean not null default true,
  has_pages boolean not null default true,
  has_discussions boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  pushed_at timestamp without time zone default now(),
  last_fetched_repos_at timestamp without time zone default to_timestamp(0),
  last_fetched_prs_at timestamp without time zone default to_timestamp(0),
  last_fetched_commits_at timestamp without time zone default to_timestamp(0),
  last_fetched_contributors_at timestamp without time zone default to_timestamp(0),

  -- elastic columns
  default_branch character varying(255) collate pg_catalog."default" not null default 'main',
  node_id character varying(255) collate pg_catalog."default" not null default '',
  git_url character varying(255) collate pg_catalog."default" not null default '',
  ssh_url character varying(255) collate pg_catalog."default" not null default '',
  clone_url character varying(255) collate pg_catalog."default" not null default '',
  svn_url character varying(255) collate pg_catalog."default" not null default '',
  mirror_url character varying(255) collate pg_catalog."default" not null default '',
  name character varying(255) collate pg_catalog."default",
  full_name character varying(255) collate pg_catalog."default",
  description text collate pg_catalog."default" not null default '',
  language character varying(64) collate pg_catalog."default" not null default '',
  license character varying(64) collate pg_catalog."default" not null default '',
  url character varying(255) collate pg_catalog."default" not null default '',
  homepage character varying(255) collate pg_catalog."default" not null default '',
  topics varchar[] not null default array[]::varchar[],

  -- dynamic columns
  constraint repos_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists repos_idx_size on repos (size);
create index if not exists repos_idx_is_fork on repos (is_fork desc);
create index if not exists repos_idx_is_private on repos (is_private desc);
create index if not exists repos_idx_is_template on repos (is_template desc);
create index if not exists repos_idx_is_archived on repos (is_archived desc);
create index if not exists repos_idx_is_disabled on repos (is_disabled desc);
create index if not exists repos_idx_has_issues on repos (has_issues);
create index if not exists repos_idx_has_projects on repos (has_projects);
create index if not exists repos_idx_has_downloads on repos (has_downloads);
create index if not exists repos_idx_has_wiki on repos (has_wiki);
create index if not exists repos_idx_has_pages on repos (has_pages);
create index if not exists repos_idx_has_discussions on repos (has_discussions);
create index if not exists repos_idx_issues on repos (issues);
create index if not exists repos_idx_stars on repos (stars);
create index if not exists repos_idx_forks on repos (forks);
create index if not exists repos_idx_watchers on repos (watchers);
create index if not exists repos_idx_subscribers on repos (subscribers);
create index if not exists repos_idx_network on repos (network);
create index if not exists repos_idx_deleted_at on repos (deleted_at);
create index if not exists repos_idx_last_fetched_repos_at on repos (last_fetched_repos_at);
create index if not exists repos_idx_last_fetched_prs_at on repos (last_fetched_prs_at);
create index if not exists repos_idx_last_fetched_commits_at on repos (last_fetched_commits_at);
create index if not exists repos_idx_last_fetched_contributors_at on repos (last_fetched_contributors_at);
create index if not exists repos_idx_default_branch on repos (default_branch);
create index if not exists repos_idx_name on repos (name);
create index if not exists repos_idx_full_name on repos (full_name);
create index if not exists repos_idx_language on repos (language);
create index if not exists repos_idx_license on repos (license);
create index if not exists repos_idx_topics on repos (topics);
