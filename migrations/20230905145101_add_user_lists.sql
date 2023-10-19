create table if not exists public.user_lists
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- elastic columns
  name character varying(255) collate pg_catalog."default" not null,
  is_public boolean not null default false,

  -- dynamic columns
  constraint user_lists_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists user_lists_idx_is_public on public.user_lists (is_public);
create index if not exists user_lists_idx_created_at on public.user_lists (created_at);
create index if not exists user_lists_idx_updated_at on public.user_lists (updated_at);
create index if not exists user_lists_idx_deleted_at on public.user_lists (deleted_at);
