create table if not exists public.insight_members
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  insight_id bigint not null references public.insights (id) on delete cascade on update cascade,
  created_at timestamp without time zone default now() not null,
  updated_at timestamp without time zone default now() not null,
  deleted_at timestamp without time zone default null,

  -- elastic columns
  access character varying(20) collate pg_catalog."default" not null default 'view',

  -- dynamic columns
  constraint insight_team_members_pkey primary key (id)
)

tablespace pg_default;