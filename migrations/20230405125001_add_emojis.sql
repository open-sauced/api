create table if not exists public.emojis
(
  id uuid default uuid_generate_v4() not null,
  name character varying(255) collate pg_catalog."default" not null default '',
  url character varying(255) collate pg_catalog."default" not null default '',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  display_order integer default 100 not null,

  constraint emojis_pkey primary key (id)
)

tablespace pg_default;
