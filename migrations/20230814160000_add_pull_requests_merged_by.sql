ALTER TABLE IF EXISTS public.pull_requests
    ADD COLUMN merged_by_login text COLLATE pg_catalog."default" DEFAULT ''::text;

create index if not exists pull_requests_idx_merged_by_login on pull_requests (merged_by_login);
