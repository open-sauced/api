create table if not exists public.user_highlight_reactions
(
  -- static columns
  id uuid default uuid_generate_v4() not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  highlight_id bigint not null references public.user_highlights (id) on delete cascade on update cascade,
  emoji_id uuid not null references public.emojis (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,

  -- dynamic columns
  constraint highlight_reactions_pkey primary key (id),
  constraint highlight_reactions_hash unique (user_id, highlight_id, emoji_id)
)

tablespace pg_default;

-- indexes
create index if not exists highlight_reactions_idx_created_at on public.user_highlight_reactions (created_at);
create index if not exists highlight_reactions_idx_updated_at on public.user_highlight_reactions (updated_at);
create index if not exists highlight_reactions_idx_deleted_at on public.user_highlight_reactions (deleted_at);
