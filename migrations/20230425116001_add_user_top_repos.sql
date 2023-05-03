create table if not exists public.user_top_repos
(
  -- static columns
  id bigint not null generated by default as identity ( increment 1 start 1 minvalue 1 maxvalue 9223372036854775807 cache 1 ),
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  repo_id bigint not null references public.repos (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint user_top_repos_pkey primary key (id),
  constraint user_top_repos_hash unique (user_id, repo_id)
)

tablespace pg_default;

-- indexes
create index if not exists user_top_repos_idx_created_at on public.user_top_repos (created_at);
create index if not exists user_top_repos_idx_updated_at on public.user_top_repos (updated_at);
create index if not exists user_top_repos_idx_deleted_at on public.user_top_repos (deleted_at);