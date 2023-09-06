create table if not exists public.user_list_contributors
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  list_id uuid not null references public.user_lists (id) on delete cascade on update cascade,
  user_id bigint NOT NULL,
  created_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint user_list_contributors_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists user_list_contributors_idx_list_id on public.user_list_contributors (list_id);
create index if not exists user_list_contributors_idx_user_id on public.user_list_contributors (user_id);
create index if not exists user_list_contributors_idx_created_at on public.user_list_contributors (created_at);
create index if not exists user_list_contributors_idx_deleted_at on public.user_list_contributors (deleted_at);