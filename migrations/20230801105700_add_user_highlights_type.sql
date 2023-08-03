ALTER TABLE IF EXISTS public.user_highlights
    ADD COLUMN type character varying(25) collate pg_catalog."default" not null default 'pull_request';