create table if not exists public.user_collaborations
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
  constraint user_collaborations_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index user_collaborations_idx_created_at on public.user_collaborations (created_at);
create index user_collaborations_idx_updated_at on public.user_collaborations (updated_at);
create index user_collaborations_idx_deleted_at on public.user_collaborations (deleted_at);
create index user_collaborations_idx_request_emailed_at on public.user_collaborations (request_emailed_at);
create index user_collaborations_idx_status on public.user_collaborations (status);
