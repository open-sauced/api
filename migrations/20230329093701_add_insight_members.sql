create table if not exists public.insight_members
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  user_id bigint null references public.users (id) on delete cascade on update cascade,
  insight_id bigint not null references public.insights (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  invitation_emailed_at timestamp without time zone default null,

  -- elastic columns
  access character varying(20) collate pg_catalog."default" not null default 'pending',
  invitation_email character varying(255) collate pg_catalog."default" not null default '',

-- dynamic columns
  constraint insight_team_members_pkey primary key (id)
)

  tablespace pg_default;

-- indexes
create index insight_members_idx_created_at on public.insight_members (created_at);
create index insight_members_idx_updated_at on public.insight_members (updated_at);
create index insight_members_idx_deleted_at on public.insight_members (deleted_at);
create index insight_members_idx_invitation_emailed_at on public.insight_members (invitation_emailed_at);
create index insight_members_idx_access on public.insight_members (access);
create index insight_members_idx_invitation_email on public.insight_members (invitation_email);
