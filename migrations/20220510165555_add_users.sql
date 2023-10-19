create table if not exists public.users
(
  -- static columns
  id bigint not null,
  open_issues bigint not null default 0,
  public_repos bigint not null default 0,
  public_gists bigint not null default 0,
  followers bigint not null default 0,
  following bigint not null default 0,
  role bigint not null default 10,
  display_local_time boolean not null default false,
  has_stars_data boolean not null default false,
  is_private boolean not null default false,
  is_open_sauced_member boolean not null default false,
  is_onboarded boolean not null default false,
  is_waitlisted boolean not null default false,
  hireable boolean not null default false,
  display_email boolean NOT NULL DEFAULT false,
  receive_collaboration boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone default null,
  last_fetched_users_at timestamp without time zone default to_timestamp(0),
  first_opened_pr_at timestamp without time zone default null,
  first_pushed_commit_at timestamp without time zone default null,
  connected_at timestamp without time zone default null,
  type character varying(20) collate pg_catalog."default" not null default 'User',

  -- elastic columns
  timezone character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'UTC+1'::character varying,
  login character varying(255) collate pg_catalog."default" not null default '' unique,
  email character varying(255) collate pg_catalog."default" not null default '',
  bio character varying(255) collate pg_catalog."default" not null default '',
  name character varying(255) collate pg_catalog."default" not null default '',
  twitter_username character varying(15) collate pg_catalog."default" not null default '',
  company character varying(255) collate pg_catalog."default" not null default '',
  location character varying(255) collate pg_catalog."default" not null default '',
  node_id character varying(50) collate pg_catalog."default" not null default '',
  avatar_url character varying(255) collate pg_catalog."default" not null default '',
  gravatar_id character varying(255) collate pg_catalog."default" not null default '',
  url character varying(255) collate pg_catalog."default" not null default '',
  blog character varying(255) collate pg_catalog."default" not null default '',
  interests character varying(200) COLLATE pg_catalog."default" NOT NULL DEFAULT 'javascript'::character varying,
  languages jsonb default '{}' not null,
  linkedin_url character varying(255) collate pg_catalog."default" not null default '',
  github_sponsors_url character varying(255) collate pg_catalog."default" not null default '',
  discord_url character varying(255) collate pg_catalog."default" not null default '',

  -- dynamic columns
  constraint users_pkey primary key (id),
  constraint users_login_key unique (login)
)

tablespace pg_default;

-- indexes
create index if not exists users_idx_open_issues on public.users (open_issues);
create index if not exists users_idx_public_repos on public.users (public_repos);
create index if not exists users_idx_public_gists on public.users (public_gists);
create index if not exists users_idx_followers on public.users (followers);
create index if not exists users_idx_following on public.users (following);
create index if not exists users_idx_role on public.users (role);
create index if not exists users_idx_display_local_time on public.users (display_local_time);
create index if not exists users_idx_has_stars_data on public.users (has_stars_data);
create index if not exists users_idx_is_private on public.users (is_private);
create index if not exists users_idx_is_open_sauced_member on public.users (is_open_sauced_member);
create index if not exists users_idx_is_onboarded on public.users (is_onboarded);
create index if not exists users_idx_is_waitlisted on public.users (is_waitlisted);
create index if not exists users_idx_hireable on public.users (hireable);
create index if not exists users_idx_display_email on public.users (display_email);
create index if not exists users_idx_receive_collaboration on public.users (receive_collaboration);
create index if not exists users_idx_created_at on public.users (created_at);
create index if not exists users_idx_updated_at on public.users (updated_at);
create index if not exists users_idx_deleted_at on public.users (deleted_at);
create index if not exists users_idx_last_fetched_users_at on public.users (last_fetched_users_at);
create index if not exists users_idx_first_opened_pr_at on public.users (first_opened_pr_at);
create index if not exists users_idx_first_pushed_commit_at on public.users (first_pushed_commit_at);
create index if not exists users_idx_connected_at on public.users (connected_at);
create index if not exists users_idx_email on public.users (email);
create index if not exists users_idx_name on public.users (name);
create index if not exists users_idx_node_id on public.users (node_id);
create index if not exists users_idx_type on public.users (type);
create index if not exists users_idx_location on public.users (location);
create index if not exists users_idx_timezone on public.users (timezone);
create index if not exists users_idx_languages on public.users using gin (languages jsonb_path_ops);
create index if not exists users_idx_linkedin_url on public.users (linkedin_url);
create index if not exists users_idx_github_sponsors_url on public.users (github_sponsors_url);
