create table if not exists public.pull_requests
(
	id integer not null,
	repo_id integer not null,
	number integer,
	state text,
	draft boolean default false,
	title text not null,
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
	constraint gh_prs_pkey
		primary key (id)
);

create index pull_requests_idx_repo_id
    on pull_requests (repo_id);

create index pull_requests_idx_author
    on pull_requests (author_login);

tablespace pg_default;
