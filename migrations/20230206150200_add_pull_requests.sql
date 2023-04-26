create table if not exists public.pull_requests
(
  -- static columns
  id bigint not null,
  repo_id bigint not null references public.repos(id) on delete cascade on update cascade,
  number bigint not null default 0,
  additions bigint not null default 0,
  deletions bigint not null default 0,
  changed_files bigint not null default 0,
  comments bigint not null default 0,
  draft boolean not null default true,
  merged boolean not null default false,
  mergeable boolean not null default false,
  rebaseable boolean not null default false,
  created_at timestamp without time zone not null default now(),
  merged_at timestamp without time zone default null,
  updated_at timestamp without time zone not null default now(),
  last_updated_at timestamp without time zone not null default now(),
  closed_at timestamp without time zone default null,

  -- elastic columns
  state text,
  title text not null,
  source_label text default ''::text,
  target_label text default ''::text,
  target_branch text,
  source_branch text,
  author_login text,
  author_avatar text,
  assignee_login text default ''::text,
  assignee_avatar text default ''::text,
  assignees_login text[],
  assignees_avatar text[],
  requested_reviewers_login text[],
  label_names text[],
  labels jsonb,

  -- dynamic columns
  constraint pull_requests_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists pull_requests_idx_author_login on public.pull_requests (lower(author_login));
