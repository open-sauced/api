create table if not exists public.emojis
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  display_order integer not null default 100,

  -- elastic columns
  name character varying(255) collate pg_catalog."default" not null,
  url character varying(255) collate pg_catalog."default" not null default '',

  -- dynamic columns
  constraint emojis_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index if not exists emojis_idx_created_at on public.emojis (created_at);
create index if not exists emojis_idx_updated_at on public.emojis (updated_at);
create index if not exists emojis_idx_deleted_at on public.emojis (deleted_at);
create index if not exists emojis_idx_display_order on public.emojis (display_order);
create index if not exists emojis_idx_name on public.emojis (name);
