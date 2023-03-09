create table if not exists public.pull_requests_insights
(
	id integer,
	repo_id integer,
	number integer,
	state text,
	draft boolean,
	title text,
	source_label text default ''::text,
	target_label text default ''::text,
	target_branch text,
	source_branch text,
	author_login text,
	author_avatar text,
	assignee_login text default ''::text,
	assignee_avatar text default ''::text,
	assignees_login text[],
	assignees_avatar text[],
	requested_reviewers_login text[],
	label_names text[],
	labels jsonb,
	merged boolean default false,
	mergeable boolean default false,
	rebaseable boolean default false,
	created_at timestamp default now() not null,
	merged_at timestamp,
	updated_at timestamp default now() not null,
	last_updated_at timestamp default now() not null,
	closed_at timestamp,
	additions integer default 0,
	deletions integer default 0,
	changed_files integer default 0,
	comments integer default 0,
	repo_full_name varchar(255),
	repo_updated_at timestamp,
	repo_topics character varying[],
	repo_stars bigint,
	repo_has_spam boolean,
	repo_is_top_100 boolean,
	repo_recent_contributor_count bigint
);

alter table public.pull_requests_insights owner to doadmin;



create index pull_requests_idx_repo_id
    on pull_requests (repo_id);

create index pull_requests_idx_author
    on pull_requests (author_login);

create index pull_requests_idx_state
    on pull_requests (state);

create index pull_requests_idx_repo_full_name
    on pull_requests (repo_full_name);

tablespace pg_default;
