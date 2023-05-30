create table if not exists public.endorsements
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  creator_user_id bigint not null,
  recipient_user_id bigint not null,
  repo_id bigint not null,
  created_at timestamp without time zone not null default now(),
  -- updated_at timestamp without time zone not null default now(),
  -- deleted_at timestamp without time zone default null,

  -- elastic columns
  -- example: doc
  type character varying(20) not null,
  source_comment_url character varying(500) null,
  source_context_url character varying(500) not null,

  -- dynamic columns
  constraint endorsements_pkey primary key (id)
)

tablespace pg_default;

-- indexes
create index endorsements_idx_creator_user_id on public.endorsements (creator_user_id);
create index endorsements_idx_recipient_user_id on public.endorsements (recipient_user_id);
create index endorsements_idx_repo_id on public.endorsements (repo_id);
create index endorsements_idx_created_at on public.endorsements (created_at);
-- create index endorsements_idx_updated_at on public.endorsements (updated_at);
-- create index endorsements_idx_deleted_at on public.endorsements (deleted_at);
