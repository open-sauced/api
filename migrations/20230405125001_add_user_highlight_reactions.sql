create table if not exists public.user_highlight_reactions
(
  id uuid default uuid_generate_v4() not null,
  user_id bigint not null references public.users (id) on delete cascade on update cascade,
  highlight_id bigint not null references public.user_highlights (id) on delete cascade on update cascade,
  emoji_id uuid not null references public.emojis (id) on delete cascade on update cascade,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  shipped_at timestamp without time zone default null,

  constraint highlight_reactions_pkey primary key (id),
  constraint highlight_reactions_hash unique (user_id, highlight_id, emoji_id)
)

tablespace pg_default;