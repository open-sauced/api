create table if not exists public.user_connections
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  request_user_id bigint null references public.users (id) on delete cascade on update cascade,
  message character varying(500) collate pg_catalog."default" not null default '',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  request_emailed_at timestamp without time zone default null,

  -- elastic columns
  status character varying(20) collate pg_catalog."default" not null default 'pending',

-- dynamic columns
  constraint user_connections_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index user_connections_idx_created_at on public.user_connections (created_at);
create index user_connections_idx_updated_at on public.user_connections (updated_at);
create index user_connections_idx_deleted_at on public.user_connections (deleted_at);
create index user_connections_idx_request_emailed_at on public.user_connections (request_emailed_at);
create index user_connections_idx_status on public.user_connections (status);
