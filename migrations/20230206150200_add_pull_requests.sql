create table if not exists public.pull_requests
(
	id integer not null,
	repo_id integer not null,
	number integer,
	state text,
	draft boolean default false,
	title text not null,
	source_label text,
	target_label text,
	target_branch text,
	source_branch text,
	author_login text,
	author_avatar text,
	assignee_login text,
	assignee_avatar text,
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

create index if not exists gh_prs_idx
	on public.pull_requests (repo_id, id, number, state, draft, title, target_branch, created_at, updated_at);

tablespace pg_default;
